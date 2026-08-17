# Estimate request documents

Step 3 stores one required RC book and one optional insurance policy in `estimate_request_documents`. Files are uploaded directly to S3; the generic `/uploads` API is not involved.

Supported content types are `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, and `application/pdf`.

## 1. Presign each document

Call this endpoint once per file:

```http
POST /api/v1/estimate-requests/:id/documents/presign
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "contentType": "application/pdf"
}
```

Upload the raw file to the returned `uploadUrl` using S3 `PUT` and the same `Content-Type`. Keep the returned `objectKey`.

## 2. Complete Step 3

After every S3 upload succeeds, submit all document keys in one request:

```http
POST /api/v1/estimate-requests/:id/documents/complete
Authorization: Bearer <access-token>
Content-Type: application/json

[
  {
    "document_type": "RC_BOOK",
    "order": 0,
    "object_key": "estimate-requests/11111111-1111-4111-8111-111111111111/documents/77777777-7777-4777-8777-777777777777.pdf"
  },
  {
    "document_type": "INSURANCE_POLICY",
    "order": 1,
    "object_key": "estimate-requests/11111111-1111-4111-8111-111111111111/documents/88888888-8888-4888-8888-888888888888.webp"
  }
]
```

The array must contain exactly one `RC_BOOK`. `INSURANCE_POLICY` is optional, and each type, order, and object key must be unique. To submit only the RC book, omit the insurance-policy item.

Before writing anything to the database, the backend verifies ownership and `DRAFT` status, checks that every key belongs to this request's document path, and confirms every object exists in S3 with a matching MIME type, extension, and valid size. The database upsert is atomic and safe to repeat. CDN URLs are derived from the stored keys and returned in the response.

Run `npm run migrate` before using these endpoints so the document table and the forward schema cleanup are applied.
