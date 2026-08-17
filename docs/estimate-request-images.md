# Estimate request damage images

Step 2 uploads image bytes directly from the client to S3. Both backend calls require the customer's bearer token. The `:id` value is the estimate request's internal UUID.

Supported content types are `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/heic`, and `image/heif`. PDF files are accepted by the document endpoint, not the damage-image endpoint. Presigned URLs expire after five minutes.

## 1. Create an upload URL

```http
POST /api/v1/estimate-requests/:id/damage/presign
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "contentType": "image/jpeg"
}
```

The response contains an `uploadUrl` and a key under:

```text
estimate-requests/:id/damage-images/:uuid.jpg
```

## 2. Upload directly to S3

Use the exact content type supplied to the presign endpoint:

```bash
curl --request PUT '<uploadUrl>' \
  --header 'Content-Type: image/jpeg' \
  --upload-file './vehicle-damage.jpg'
```

## 3. Complete the upload

```http
POST /api/v1/estimate-requests/:id/damage/complete
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "objectKey": "estimate-requests/11111111-1111-4111-8111-111111111111/damage-images/33333333-3333-4333-8333-333333333333.jpg"
}
```

The backend verifies ownership and `DRAFT` status, validates the request-scoped key, checks the S3 object's MIME type and size, and saves the key and derived CDN URL. Repeating completion with the same key is idempotent.

The AWS identity needs `s3:PutObject` and `s3:GetObject` for `estimate-requests/*`. The bucket CORS policy must allow frontend `PUT` requests and the `Content-Type` header.
