const crypto = require("crypto");
const { logger } = require("@core/index");
const repository = require("./estimateRequests.repository");
const { pool } = require("@config/db");
const env = require("@config/env");
const AppError = require("@utils/app_error");
const s3Service = require("@integrations/s3/s3.service");
const jwt = require("jsonwebtoken");
const emailTemplates = require("@integrations/email/templates/estimate-request-received.template");

const {
  sendEmail,
} = require("@integrations/email/email.service");

const CUSTOMER_ROLE_CODE = "CUSTOMER";
const ESTIMATE_REQUEST_ID_PREFIX = "KER";
const PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS = 300;
const IMAGE_CONTENT_TYPES = Object.freeze({
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heif",
});
const DOCUMENT_CONTENT_TYPES = Object.freeze({
  ...IMAGE_CONTENT_TYPES,
  "application/pdf": "pdf",
});

//----------------------------------------------------------------------------------------------------------------------------------------
// FUNCTION WHICH FINDS USERS BY PHONE NO EITHER CREATE USER USING PHONE NO AND ASSIGNS CUSTOMER ROLE
//----------------------------------------------------------------------------------------------------------------------------------------

async function findOrCreateUser(client, phoneNumber) {
  let user = await repository.findUserByPhoneNumber(client, phoneNumber);

  if (!user) {
    const seq = await repository.getNextCustomerSeq(client);
    const role = await repository.getRoleByCode(client, CUSTOMER_ROLE_CODE);
    const userId = `${role.prefix}-${String(seq).padStart(6, "0")}`;
    user = await repository.createNewUserByPhoneNumber(
      client,
      userId,
      phoneNumber,
    );
    await repository.assignUserRole(client, user.id, role.id);
  }

  return user;
}

//----------------------------------------------------------------------------------------------------------------------------------------
// CREATE ESTMATE REQUEST STEP - 1
//----------------------------------------------------------------------------------------------------------------------------------------

async function createEstimateRequestStep1(
  registration_no,
  phoneNumber,
  email,
  servicePin,
  canVehicleDriven,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const user = await findOrCreateUser(client, phoneNumber);

    const request_seq = await repository.getNextEstimateRequestSeq(client);

    const request_id = `${ESTIMATE_REQUEST_ID_PREFIX}-${String(request_seq).padStart(6, "0")}`;

    const request = await repository.createEstimateRequest(
      client,
      request_id,
      user.id,
      registration_no,
      servicePin,
      canVehicleDriven,
      email
    );

    await client.query("COMMIT");

    const jwtPayload = {
      id: user.id,
      request_id: request.id,
    };
    const accessToken = jwt.sign(jwtPayload, env.jwt.accessSecret, {
      expiresIn: "60m",
    });

    return { request, accessToken };
  } catch (error) {
    logger.error(error);
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
}

function normalizeContentType(contentType) {
  const mediaType = String(contentType).split(";", 1)[0].trim().toLowerCase();

  const hasWrappingQuotes =
    (mediaType.startsWith('"') && mediaType.endsWith('"')) ||
    (mediaType.startsWith("'") && mediaType.endsWith("'"));

  return hasWrappingQuotes ? mediaType.slice(1, -1).trim() : mediaType;
}

async function getOwnedDraftRequest(requestId, userId) {
  const request = await repository.findEstimateRequestById(requestId);

  if (!request) {
    throw new AppError("Estimate request not found", 404);
  }

  if (request.user_id !== userId) {
    throw new AppError("You do not have access to this estimate request", 403);
  }

  if (request.status !== "DRAFT") {
    throw new AppError("Only draft estimate requests can be updated", 409);
  }

  return request;
}

function createDamageImageObjectKey(estimateRequestId, extension) {
  return `estimate-requests/${estimateRequestId}/damage-images/${crypto.randomUUID()}.${extension}`;
}

function createRequestDocumentsObjectKey(estimateRequestId, extension) {
  return `estimate-requests/${estimateRequestId}/documents/${crypto.randomUUID()}.${extension}`;
}

function isVehicleDamageObjectKey(objectKey, estimateRequestId) {
  const escapedRequestId = estimateRequestId.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  const extensions = Object.values(IMAGE_CONTENT_TYPES).join("|");
  const pattern = new RegExp(
    `^estimate-requests/${escapedRequestId}/damage-images/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\.(${extensions})$`,
    "i",
  );

  return pattern.test(objectKey);
}

function isRequestDocumentsObjectKey(objectKey, estimateRequestId) {
  const escapedRequestId = estimateRequestId.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  const extensions = Object.values(DOCUMENT_CONTENT_TYPES).join("|");
  const pattern = new RegExp(
    `^estimate-requests/${escapedRequestId}/documents/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\.(${extensions})$`,
    "i",
  );

  return pattern.test(objectKey);
}

async function createAssetPresign({
  requestId,
  userId,
  requestedContentType,
  allowedContentTypes,
  createObjectKey,
  assetName,
}) {
  const request = await getOwnedDraftRequest(requestId, userId);
  const contentType = normalizeContentType(requestedContentType);
  const extension = allowedContentTypes[contentType];

  if (!extension) {
    throw new AppError(`Unsupported ${assetName} file type`, 415);
  }

  const objectKey = createObjectKey(request.id, extension);

  try {
    const uploadUrl = await s3Service.createPresignedUploadUrl({
      key: objectKey,
      contentType,
      expiresIn: PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS,
    });

    return { uploadUrl, objectKey };
  } catch (error) {
    logger.error(`Unable to create ${assetName} upload URL`, {
      error: error.message,
      estimateRequestId: request.id,
    });
    throw new AppError("Asset storage is temporarily unavailable", 502);
  }
}

async function createDamageImagePresign(
  requestId,
  userId,
  requestedContentType,
) {
  return createAssetPresign({
    requestId,
    userId,
    requestedContentType,
    allowedContentTypes: IMAGE_CONTENT_TYPES,
    createObjectKey: createDamageImageObjectKey,
    assetName: "vehicle image",
  });
}

async function createRequestDocumentsPresign(
  requestId,
  userId,
  requestedContentType,
) {
  return createAssetPresign({
    requestId,
    userId,
    requestedContentType,
    allowedContentTypes: DOCUMENT_CONTENT_TYPES,
    createObjectKey: createRequestDocumentsObjectKey,
    assetName: "estimate document",
  });
}

async function verifyUploadedObject({
  objectKey,
  estimateRequestId,
  isAllowedObjectKey,
  allowedContentTypes,
  assetName,
}) {
  if (!isAllowedObjectKey(objectKey, estimateRequestId)) {
    throw new AppError(
      "Object key does not belong to this estimate request",
      400,
    );
  }

  let object;

  try {
    object = await s3Service.getFileMetadata(objectKey);
  } catch (error) {
    logger.error(`Unable to verify ${assetName} in storage`, {
      error: error.message,
      estimateRequestId,
      objectKey,
    });
    throw new AppError("Asset storage is temporarily unavailable", 502);
  }

  if (!object) {
    throw new AppError("Uploaded file was not found in storage", 404);
  }

  const contentType = normalizeContentType(object.contentType || "");
  const expectedExtension = allowedContentTypes[contentType];
  const actualExtension = objectKey
    .slice(objectKey.lastIndexOf(".") + 1)
    .toLowerCase();

  if (!expectedExtension || expectedExtension !== actualExtension) {
    throw new AppError(`Uploaded object is not a supported ${assetName}`, 415);
  }

  if (!Number.isFinite(object.contentLength) || object.contentLength <= 0) {
    throw new AppError("Uploaded file is empty", 422);
  }

  if (object.contentLength > env.upload.maxFileSizeBytes) {
    throw new AppError("Uploaded file exceeds the maximum allowed size", 413);
  }

  return object;
}

async function completeEstimateImage(requestId, userId, objectKey) {
  const request = await getOwnedDraftRequest(requestId, userId);

  await verifyUploadedObject({
    objectKey,
    estimateRequestId: request.id,
    isAllowedObjectKey: isVehicleDamageObjectKey,
    allowedContentTypes: IMAGE_CONTENT_TYPES,
    assetName: "vehicle image",
  });

  const imageUrl = `${env.aws.cdnBaseUrl}/${objectKey}`;

  try {
    return await repository.createEstimateRequestImage(
      request.id,
      objectKey,
      imageUrl,
    );
  } catch (error) {
    logger.error("Unable to save estimate request image", {
      error: error.message,
      estimateRequestId: request.id,
      objectKey,
    });
    throw new AppError("Unable to save the uploaded image", 500);
  }
}

async function saveRequestDocuments(requestId, userId, documents) {
  const request = await getOwnedDraftRequest(requestId, userId);

  await Promise.all(
    documents.map((document) =>
      verifyUploadedObject({
        objectKey: document.object_key,
        estimateRequestId: request.id,
        isAllowedObjectKey: isRequestDocumentsObjectKey,
        allowedContentTypes: DOCUMENT_CONTENT_TYPES,
        assetName: "estimate document",
      }),
    ),
  );

  try {
    const storedDocuments = await repository.saveRequestDocuments(
      request.id,
      documents,
    );

    return storedDocuments.map((document) => ({
      ...document,
      url: `${env.aws.cdnBaseUrl}/${document.object_key}`,
    }));
  } catch (error) {
    logger.error("Unable to save estimate request documents", {
      error: error.message,
      estimateRequestId: request.id,
    });
    throw new AppError("Unable to save the uploaded documents", 500);
  }
}

async function completeEstimateRequest(requestId, userId) {
  const request = await getOwnedDraftRequest(requestId, userId);
  const readiness = await repository.getEstimateRequestCompletionReadiness(
    request.id,
  );

  if (!readiness?.has_damage_images) {
    throw new AppError(
      "Upload at least one vehicle damage image before completing the request",
      422,
    );
  }

  if (!readiness.has_rc_book) {
    throw new AppError(
      "Upload the vehicle RC book before completing the request",
      422,
    );
  }

  const submittedRequest = await repository.submitEstimateRequest(
    request.id,
    userId,
  );

  if (!submittedRequest) {
    throw new AppError(
      "Estimate request is no longer eligible for completion",
      409,
    );
  }

  const user = await repository.getUserById(userId);


  const template = emailTemplates.estimateRequestReceivedTemplate({
    customerName: user.name,
    requestNo: request.request_id,
    vehicleNo: request.vehicle_no,
  });

  sendEmail({
    to: submittedRequest.email,
    ...template,
  }).catch((error) => {
    console.error("Estimate confirmation email failed:", error);
  });


  return submittedRequest;
}






module.exports = {
  createEstimateRequestStep1,
  createDamageImagePresign,
  createRequestDocumentsPresign,
  completeEstimateImage,
  saveRequestDocuments,
  completeEstimateRequest,
};
