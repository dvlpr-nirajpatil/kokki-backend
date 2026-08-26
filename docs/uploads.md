# Direct S3 uploads

The API no longer accepts multipart file uploads or processes images. The
frontend uploads files directly to S3 using the presigned URLs documented in:

- `docs/estimate-request-images.md`
- `docs/estimate-request-step-3.md`

The backend creates the object key and presigned URL, then verifies the S3
object's content type and size when the frontend completes the upload.

## Delete a legacy asset

`DELETE /api/v1/uploads` remains available for objects created by the removed
multipart upload endpoint. It accepts either an object key or its full Kokki CDN
URL and requires an access token.

Delete by key:

```bash
curl --request DELETE http://localhost:5000/api/v1/uploads \
  --header "Authorization: Bearer <access-token>" \
  --header "Content-Type: application/json" \
  --data '{"key":"uploads/images/2026/08/785a4187-3f45-43e1-8dca-56194809aa72.webp"}'
```

Delete by CDN URL:

```json
{
  "url": "https://cdn.kokki.in/uploads/images/2026/08/785a4187-3f45-43e1-8dca-56194809aa72.webp"
}
```

S3 deletion is idempotent. If `AWS_CLOUDFRONT_DISTRIBUTION_ID` is configured,
the API also submits an invalidation for the deleted path.
