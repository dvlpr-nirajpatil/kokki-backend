const { z } = require("zod");

const requiredString = (fieldName) =>
  z.string({
    error: (issue) =>
      issue.input === undefined
        ? `${fieldName} is required`
        : `${fieldName} must be a string`,
  });

const createEstimateRequestStep1Schema = z.object({
  body: z
    .object({
      registrationNo: requiredString("Registration number")
        .trim()
        .min(4, "Registration number must contain at least 4 characters")
        .max(20, "Registration number must contain at most 20 characters")
        .regex(
          /^[a-zA-Z0-9 -]+$/,
          "Registration number can only contain letters, numbers, spaces, and hyphens",
        )
        .transform((registrationNo) => registrationNo.toUpperCase()),
      phoneNo: requiredString("Phone number")
        .trim()
        .regex(
          /^[6-9]\d{9}$/,
          "Phone number must be a valid 10-digit Indian mobile number",
        ),
      email: requiredString("Email")
        .trim()
        .toLowerCase()
        .max(255, "Email must contain at most 255 characters")
        .email("Email must be valid"),
      servicePin: z.coerce
        .number({ error: "Service PIN must be a number" })
        .int("Service PIN must be an integer")
        .min(100000, "Service PIN must be a valid 6-digit PIN")
        .max(999999, "Service PIN must be a valid 6-digit PIN"),
      isVehicleDrivable: z.enum(["YES", "NO", "NOT_SURE"], {
        error: "Vehicle drivable status must be YES, NO, or NOT_SURE",
      }),
    })
    .strict(),
});

const requestIdParams = z
  .object({
    id: z.string().uuid("Estimate request id must be a valid UUID"),
  })
  .strict();

const presignEstimateAssetSchema = z.object({
  params: requestIdParams,
  body: z
    .object({
      contentType: z.string().trim().min(1).max(100),
    })
    .strict(),
});

const completeDamageImageSchema = z.object({
  params: requestIdParams,
  body: z
    .object({
      objectKey: z.string().trim().min(1).max(1024),
    })
    .strict(),
});

const estimateDocumentSchema = z
  .object({
    document_type: z.enum(["RC_BOOK", "INSURANCE_POLICY"]),
    order: z.number().int().nonnegative(),
    object_key: z.string().trim().min(1).max(500),
  })
  .strict();

const completeEstimateDocumentsSchema = z.object({
  params: requestIdParams,
  body: z
    .array(estimateDocumentSchema)
    .min(1)
    .max(2)
    .superRefine((documents, context) => {
      const documentTypes = documents.map((document) => document.document_type);

      if (!documentTypes.includes("RC_BOOK")) {
        context.addIssue({
          code: "custom",
          message: "RC book document is required",
        });
      }

      const uniqueTypes = new Set(documentTypes);

      if (uniqueTypes.size !== documentTypes.length) {
        context.addIssue({
          code: "custom",
          message: "Each document type can only be submitted once",
        });
      }

      const orders = documents.map((document) => document.order);
      if (new Set(orders).size !== orders.length) {
        context.addIssue({
          code: "custom",
          message: "Each document must have a unique order",
        });
      }

      const objectKeys = documents.map((document) => document.object_key);
      if (new Set(objectKeys).size !== objectKeys.length) {
        context.addIssue({
          code: "custom",
          message: "Each document must have a unique object key",
        });
      }
    }),
});

const completeEstimateRequestSchema = z.object({
  params: requestIdParams,
  body: z.object({}).strict().optional().default({}),
});

module.exports = {
  createEstimateRequestStep1Schema,
  presignEstimateAssetSchema,
  completeDamageImageSchema,
  completeEstimateDocumentsSchema,
  completeEstimateRequestSchema,
};
