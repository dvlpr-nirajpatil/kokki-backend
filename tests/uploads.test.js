const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../src/integrations/s3/s3.service", () => ({
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

describe("Legacy upload deletion API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not accept backend file uploads", async () => {
    const apiResponse = await request(app)
      .post("/api/v1/uploads")
      .set("Authorization", `Bearer ${createAccessToken()}`);

    expect(apiResponse.statusCode).toBe(404);
    expect(s3Service.deleteFile).not.toHaveBeenCalled();
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
