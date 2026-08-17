const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock(
  "../src/modules/estimatesRequests/estimateRequests.repository",
  () => ({
    findEstimateRequestById: jest.fn(),
    createEstimateRequestImage: jest.fn(),
    saveRequestDocuments: jest.fn(),
    getEstimateRequestCompletionReadiness: jest.fn(),
    submitEstimateRequest: jest.fn(),
  }),
);

jest.mock("../src/integrations/s3/s3.service", () => ({
  createPresignedUploadUrl: jest.fn(),
  getFileMetadata: jest.fn(),
}));

const env = require("../src/config/env");
const repository = require("../src/modules/estimatesRequests/estimateRequests.repository");
const s3Service = require("../src/integrations/s3/s3.service");
const app = require("../src/app");

const REQUEST_ID = "11111111-1111-4111-8111-111111111111";
const USER_ID = "22222222-2222-4222-8222-222222222222";
const OTHER_USER_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DAMAGE_UUID = "33333333-3333-4333-8333-333333333333";
const DAMAGE_KEY = `estimate-requests/${REQUEST_ID}/damage-images/${DAMAGE_UUID}.jpg`;
const HEIC_DAMAGE_KEY = `estimate-requests/${REQUEST_ID}/damage-images/${DAMAGE_UUID}.heic`;
const PDF_DAMAGE_KEY = `estimate-requests/${REQUEST_ID}/damage-images/${DAMAGE_UUID}.pdf`;
const RC_BOOK_KEY = `estimate-requests/${REQUEST_ID}/documents/77777777-7777-4777-8777-777777777777.pdf`;
const INSURANCE_POLICY_KEY = `estimate-requests/${REQUEST_ID}/documents/88888888-8888-4888-8888-888888888888.webp`;

function createAccessToken(userId = USER_ID) {
  return jwt.sign(
    { id: userId, email: "customer@test.com" },
    env.jwt.accessSecret,
    { expiresIn: "5m" },
  );
}

function documentInput({ includePolicy = true } = {}) {
  const documents = [
    {
      document_type: "RC_BOOK",
      order: 0,
      object_key: RC_BOOK_KEY,
    },
  ];

  if (includePolicy) {
    documents.push({
      document_type: "INSURANCE_POLICY",
      order: 1,
      object_key: INSURANCE_POLICY_KEY,
    });
  }

  return documents;
}

describe("Estimate request asset APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    repository.findEstimateRequestById.mockResolvedValue({
      id: REQUEST_ID,
      request_id: "KER-000001",
      user_id: USER_ID,
      vehicle_no: "MH01AB1234",
      status: "DRAFT",
      current_step: 2,
    });
    repository.createEstimateRequestImage.mockResolvedValue({
      id: "44444444-4444-4444-8444-444444444444",
      estimate_request_id: REQUEST_ID,
      object_key: DAMAGE_KEY,
      image_url: `${env.aws.cdnBaseUrl}/${DAMAGE_KEY}`,
    });
    repository.saveRequestDocuments.mockImplementation(
      async (estimateRequestId, documents) =>
        documents.map((document, index) => ({
          id: `99999999-9999-4999-8999-99999999999${index}`,
          estimate_request_id: estimateRequestId,
          ...document,
        })),
    );
    repository.getEstimateRequestCompletionReadiness.mockResolvedValue({
      has_rc_book: true,
      has_damage_images: true,
    });
    repository.submitEstimateRequest.mockResolvedValue({
      id: REQUEST_ID,
      request_id: "KER-000001",
      user_id: USER_ID,
      status: "SUBMITTED",
      submitted_at: "2026-08-14T12:00:00.000Z",
    });
    s3Service.createPresignedUploadUrl.mockResolvedValue(
      "https://s3.example.test/presigned-upload",
    );
    s3Service.getFileMetadata.mockImplementation(async (key) => {
      const extension = key.slice(key.lastIndexOf(".") + 1).toLowerCase();
      const contentTypes = {
        jpg: "image/jpeg",
        heic: "image/heic",
        pdf: "application/pdf",
        webp: "image/webp",
      };

      return {
        key,
        contentType: contentTypes[extension],
        contentLength: 1024,
        etag: '"etag"',
      };
    });
  });

  test("creates a five-minute damage-image presigned URL", async () => {
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/presign`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ contentType: "image/jpeg" });

    expect(apiResponse.statusCode).toBe(200);
    expect(apiResponse.body.data).toEqual({
      uploadUrl: "https://s3.example.test/presigned-upload",
      objectKey: expect.stringMatching(
        new RegExp(`^estimate-requests/${REQUEST_ID}/damage-images/.+\\.jpg$`),
      ),
    });
    expect(s3Service.createPresignedUploadUrl).toHaveBeenCalledWith({
      key: apiResponse.body.data.objectKey,
      contentType: "image/jpeg",
      expiresIn: 300,
    });
  });

  test("requires authentication before creating an upload URL", async () => {
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/presign`)
      .send({ contentType: "image/jpeg" });

    expect(apiResponse.statusCode).toBe(401);
    expect(repository.findEstimateRequestById).not.toHaveBeenCalled();
    expect(s3Service.createPresignedUploadUrl).not.toHaveBeenCalled();
  });

  test("rejects an estimate request owned by another user", async () => {
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/presign`)
      .set("Authorization", `Bearer ${createAccessToken(OTHER_USER_ID)}`)
      .send({ contentType: "image/jpeg" });

    expect(apiResponse.statusCode).toBe(403);
    expect(s3Service.createPresignedUploadUrl).not.toHaveBeenCalled();
  });

  test("rejects uploads after the request leaves draft status", async () => {
    repository.findEstimateRequestById.mockResolvedValue({
      id: REQUEST_ID,
      user_id: USER_ID,
      status: "SUBMITTED",
    });

    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/presign`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ contentType: "image/jpeg" });

    expect(apiResponse.statusCode).toBe(409);
    expect(s3Service.createPresignedUploadUrl).not.toHaveBeenCalled();
  });

  test("rejects unsupported damage-image types including PDF", async () => {
    const textResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/presign`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ contentType: "text/plain" });
    const pdfResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/presign`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ contentType: "application/pdf" });

    expect(textResponse.statusCode).toBe(415);
    expect(pdfResponse.statusCode).toBe(415);
    expect(s3Service.createPresignedUploadUrl).not.toHaveBeenCalled();
  });

  test("creates a document presigned URL for PDF", async () => {
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/documents/presign`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ contentType: "application/pdf" });

    expect(apiResponse.statusCode).toBe(200);
    expect(apiResponse.body.message).toBe("Document upload URL created");
    expect(apiResponse.body.data.objectKey).toMatch(
      new RegExp(`^estimate-requests/${REQUEST_ID}/documents/.+\\.pdf$`),
    );
    expect(s3Service.createPresignedUploadUrl).toHaveBeenCalledWith({
      key: apiResponse.body.data.objectKey,
      contentType: "application/pdf",
      expiresIn: 300,
    });
  });

  test("verifies and saves a completed damage image", async () => {
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ objectKey: DAMAGE_KEY });

    expect(apiResponse.statusCode).toBe(201);
    expect(s3Service.getFileMetadata).toHaveBeenCalledWith(DAMAGE_KEY);
    expect(repository.createEstimateRequestImage).toHaveBeenCalledWith(
      REQUEST_ID,
      DAMAGE_KEY,
      `${env.aws.cdnBaseUrl}/${DAMAGE_KEY}`,
    );
  });

  test("normalizes quoted HEIC metadata returned by S3", async () => {
    s3Service.getFileMetadata.mockResolvedValue({
      key: HEIC_DAMAGE_KEY,
      contentType: '"image/heic"',
      contentLength: 1024,
    });

    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ objectKey: HEIC_DAMAGE_KEY });

    expect(apiResponse.statusCode).toBe(201);
    expect(repository.createEstimateRequestImage).toHaveBeenCalledWith(
      REQUEST_ID,
      HEIC_DAMAGE_KEY,
      `${env.aws.cdnBaseUrl}/${HEIC_DAMAGE_KEY}`,
    );
  });

  test("does not allow a PDF to be completed as damage image", async () => {
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ objectKey: PDF_DAMAGE_KEY });

    expect(apiResponse.statusCode).toBe(400);
    expect(s3Service.getFileMetadata).not.toHaveBeenCalled();
    expect(repository.createEstimateRequestImage).not.toHaveBeenCalled();
  });

  test("rejects a damage key outside this estimate request path", async () => {
    const otherKey =
      "estimate-requests/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/damage-images/33333333-3333-4333-8333-333333333333.jpg";
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ objectKey: otherKey });

    expect(apiResponse.statusCode).toBe(400);
    expect(s3Service.getFileMetadata).not.toHaveBeenCalled();
    expect(repository.createEstimateRequestImage).not.toHaveBeenCalled();
  });

  test("does not save a damage upload missing from S3", async () => {
    s3Service.getFileMetadata.mockResolvedValue(null);

    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ objectKey: DAMAGE_KEY });

    expect(apiResponse.statusCode).toBe(404);
    expect(repository.createEstimateRequestImage).not.toHaveBeenCalled();
  });

  test("rejects damage metadata whose MIME type does not match the key", async () => {
    s3Service.getFileMetadata.mockResolvedValue({
      key: DAMAGE_KEY,
      contentType: "image/png",
      contentLength: 1024,
    });

    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/damage/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({ objectKey: DAMAGE_KEY });

    expect(apiResponse.statusCode).toBe(415);
    expect(repository.createEstimateRequestImage).not.toHaveBeenCalled();
  });

  test("verifies and stores the RC book and optional insurance document", async () => {
    const documents = documentInput();
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/documents/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send(documents);

    expect(apiResponse.statusCode).toBe(201);
    expect(s3Service.getFileMetadata).toHaveBeenCalledWith(RC_BOOK_KEY);
    expect(s3Service.getFileMetadata).toHaveBeenCalledWith(
      INSURANCE_POLICY_KEY,
    );
    expect(repository.saveRequestDocuments).toHaveBeenCalledTimes(1);
    expect(repository.saveRequestDocuments).toHaveBeenCalledWith(
      REQUEST_ID,
      documents,
    );
    expect(apiResponse.body.data.documents).toEqual([
      expect.objectContaining({
        document_type: "RC_BOOK",
        object_key: RC_BOOK_KEY,
        url: `${env.aws.cdnBaseUrl}/${RC_BOOK_KEY}`,
      }),
      expect.objectContaining({
        document_type: "INSURANCE_POLICY",
        object_key: INSURANCE_POLICY_KEY,
        url: `${env.aws.cdnBaseUrl}/${INSURANCE_POLICY_KEY}`,
      }),
    ]);
  });

  test("stores Step 3 with only the required RC book", async () => {
    const documents = documentInput({ includePolicy: false });
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/documents/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send(documents);

    expect(apiResponse.statusCode).toBe(201);
    expect(repository.saveRequestDocuments).toHaveBeenCalledWith(
      REQUEST_ID,
      documents,
    );
  });

  test("requires the RC book when completing documents", async () => {
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/documents/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send([
        {
          document_type: "INSURANCE_POLICY",
          order: 0,
          object_key: INSURANCE_POLICY_KEY,
        },
      ]);

    expect(apiResponse.statusCode).toBe(400);
    expect(repository.findEstimateRequestById).not.toHaveBeenCalled();
    expect(repository.saveRequestDocuments).not.toHaveBeenCalled();
  });

  test("rejects duplicate document types", async () => {
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/documents/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send([
        documentInput({ includePolicy: false })[0],
        {
          document_type: "RC_BOOK",
          order: 1,
          object_key: INSURANCE_POLICY_KEY,
        },
      ]);

    expect(apiResponse.statusCode).toBe(400);
    expect(repository.saveRequestDocuments).not.toHaveBeenCalled();
  });

  test("rejects a document key outside the request's document path", async () => {
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/documents/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send([
        {
          document_type: "RC_BOOK",
          order: 0,
          object_key: "external/rc-book.pdf",
        },
      ]);

    expect(apiResponse.statusCode).toBe(400);
    expect(repository.saveRequestDocuments).not.toHaveBeenCalled();
  });

  test("does not store documents until every object exists in S3", async () => {
    s3Service.getFileMetadata.mockImplementation(async (key) =>
      key === INSURANCE_POLICY_KEY
        ? null
        : {
            key,
            contentType: "application/pdf",
            contentLength: 1024,
          },
    );

    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/documents/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send(documentInput());

    expect(apiResponse.statusCode).toBe(404);
    expect(repository.saveRequestDocuments).not.toHaveBeenCalled();
  });

  test("completes and submits a ready estimate request", async () => {
    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({});

    expect(apiResponse.statusCode).toBe(200);
    expect(
      repository.getEstimateRequestCompletionReadiness,
    ).toHaveBeenCalledWith(REQUEST_ID);
    expect(repository.submitEstimateRequest).toHaveBeenCalledWith(
      REQUEST_ID,
      USER_ID,
    );
  });

  test("does not submit without damage images or an RC book", async () => {
    repository.getEstimateRequestCompletionReadiness.mockResolvedValue({
      has_rc_book: false,
      has_damage_images: false,
    });

    const apiResponse = await request(app)
      .post(`/api/v1/estimate-requests/${REQUEST_ID}/complete`)
      .set("Authorization", `Bearer ${createAccessToken()}`)
      .send({});

    expect(apiResponse.statusCode).toBe(422);
    expect(repository.submitEstimateRequest).not.toHaveBeenCalled();
  });
});
