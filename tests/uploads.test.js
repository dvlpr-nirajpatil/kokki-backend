const request = require("supertest");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");

jest.mock("../src/integrations/s3/s3.service", () => ({
  uploadFile: jest.fn(({ key }) =>
    Promise.resolve({ key, url: `https://cdn.kokki.in/${key}` }),
  ),
  deleteFile: jest.fn(() => Promise.resolve()),
}));

jest.mock("../src/integrations/s3/cloudfront.service", () => ({
  invalidateFile: jest.fn(() =>
    Promise.resolve({ id: "invalidation-id", status: "InProgress" }),
  ),
}));

const env = require("../src/config/env");
const s3Service = require("../src/integrations/s3/s3.service");
const cloudFrontService = require("../src/integrations/s3/cloudfront.service");
const app = require("../src/app");

const ASSET_KEY =
  "uploads/images/2026/08/785a4187-3f45-43e1-8dca-56194809aa72.webp";

function createAccessToken() {
  return jwt.sign(
    { id: "00000000-0000-4000-8000-000000000001", email: "upload@test.com" },
    env.jwt.accessSecret,
    { expiresIn: "5m" },
  );
}

describe("Upload API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("converts an image to WebP and returns its object key", async () => {
    const image = await sharp({
      create: {
        width: 2400,
        height: 1200,
        channels: 3,
        background: "#336699",
      },
    })
      .png()
      .toBuffer();

    const apiResponse = await request(app)
      .post("/api/v1/uploads")
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .attach("files", image, {
        filename: "vehicle.png",
        contentType: "image/png",
      });

    expect(apiResponse.statusCode).toBe(201);
    expect(apiResponse.body.data.files[0]).toEqual(
      expect.objectContaining({
        key: expect.stringMatching(/^uploads\/images\/\d{4}\/\d{2}\/[\w-]+\.webp$/),
        url: expect.stringMatching(/^https:\/\/cdn\.kokki\.in\/uploads\/images\//),
        type: "image",
        contentType: "image/webp",
        originalContentType: "image/png",
        width: 1920,
        height: 960,
      }),
    );

    const uploadedBody = s3Service.uploadFile.mock.calls[0][0].body;
    const uploadedMetadata = await sharp(uploadedBody).metadata();

    expect(uploadedMetadata.format).toBe("webp");
    expect(s3Service.uploadFile).toHaveBeenCalledTimes(1);
  });

  test("rejects spoofed image MIME types based on file content", async () => {
    const apiResponse = await request(app)
      .post("/api/v1/uploads")
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .attach("files", Buffer.from("this is not an image"), {
        filename: "fake.png",
        contentType: "image/png",
      });

    expect(apiResponse.statusCode).toBe(415);
    expect(apiResponse.body.success).toBe(false);
    expect(s3Service.uploadFile).not.toHaveBeenCalled();
  });

  test("uploads a validated PDF without image conversion", async () => {
    const pdf = Buffer.from(
      "%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n",
    );

    const apiResponse = await request(app)
      .post("/api/v1/uploads")
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .attach("files", pdf, {
        filename: "policy.pdf",
        contentType: "application/octet-stream",
      });

    expect(apiResponse.statusCode).toBe(201);
    expect(apiResponse.body.data.files[0]).toEqual(
      expect.objectContaining({
        key: expect.stringMatching(/^uploads\/documents\/\d{4}\/\d{2}\/[\w-]+\.pdf$/),
        type: "pdf",
        contentType: "application/pdf",
        originalName: "policy.pdf",
      }),
    );
    expect(s3Service.uploadFile.mock.calls[0][0].body).toEqual(pdf);
  });

  test("rolls back earlier objects when a later S3 upload fails", async () => {
    const pdf = Buffer.from("%PDF-1.7\n%%EOF\n");

    s3Service.uploadFile
      .mockImplementationOnce(({ key }) =>
        Promise.resolve({ key, url: `https://cdn.kokki.in/${key}` }),
      )
      .mockRejectedValueOnce(new Error("S3 unavailable"));

    const apiResponse = await request(app)
      .post("/api/v1/uploads")
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .attach("files", pdf, "first.pdf")
      .attach("files", pdf, "second.pdf");

    expect(apiResponse.statusCode).toBe(502);
    expect(s3Service.deleteFile).toHaveBeenCalledTimes(1);
    expect(s3Service.deleteFile).toHaveBeenCalledWith(
      s3Service.uploadFile.mock.calls[0][0].key,
    );
  });

  test("deletes an asset using its object key", async () => {
    const apiResponse = await request(app)
      .delete("/api/v1/uploads")
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ key: ASSET_KEY });

    expect(apiResponse.statusCode).toBe(200);
    expect(apiResponse.body.data.asset).toEqual({
      key: ASSET_KEY,
      url: `${env.aws.cdnBaseUrl}/${ASSET_KEY}`,
      cdnInvalidation: {
        id: "invalidation-id",
        status: "InProgress",
      },
    });
    expect(s3Service.deleteFile).toHaveBeenCalledWith(ASSET_KEY);
    expect(cloudFrontService.invalidateFile).toHaveBeenCalledWith(ASSET_KEY);
  });

  test("extracts and deletes an object key from its CDN URL", async () => {
    const apiResponse = await request(app)
      .delete("/api/v1/uploads")
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ url: `${env.aws.cdnBaseUrl}/${ASSET_KEY}?version=1` });

    expect(apiResponse.statusCode).toBe(200);
    expect(apiResponse.body.data.asset.key).toBe(ASSET_KEY);
    expect(s3Service.deleteFile).toHaveBeenCalledWith(ASSET_KEY);
  });

  test("rejects asset URLs from another domain", async () => {
    const apiResponse = await request(app)
      .delete("/api/v1/uploads")
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ url: `https://attacker.example/${ASSET_KEY}` });

    expect(apiResponse.statusCode).toBe(400);
    expect(s3Service.deleteFile).not.toHaveBeenCalled();
  });

  test("rejects deletion of keys outside the upload prefix", async () => {
    const apiResponse = await request(app)
      .delete("/api/v1/uploads")
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ key: "system/private-config.json" });

    expect(apiResponse.statusCode).toBe(400);
    expect(s3Service.deleteFile).not.toHaveBeenCalled();
  });

  test("requires authentication before deleting an asset", async () => {
    const apiResponse = await request(app)
      .delete("/api/v1/uploads")
      .send({ key: ASSET_KEY });

    expect(apiResponse.statusCode).toBe(401);
    expect(s3Service.deleteFile).not.toHaveBeenCalled();
  });
});
