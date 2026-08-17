# Complete an estimate request

The final customer action validates that the required steps are complete and submits the estimate request for processing.

```http
POST /api/v1/estimate-requests/:id/complete
Authorization: Bearer <access-token>
Content-Type: application/json

{}
```

The backend verifies that:

- The request belongs to the authenticated customer.
- Its current status is `DRAFT`.
- At least one supported vehicle-damage image has been completed.
- The linked customer vehicle has an RC-book key and URL.

Insurance and its document remain optional.

When ready, the backend atomically changes the request status from `DRAFT` to `SUBMITTED` and sets `submitted_at`. The database uses `SUBMITTED` rather than `COMPLETED` because completion here means the customer has finished and submitted the request; assessment workflow states follow afterward.

```json
{
  "success": true,
  "message": "Estimate request completed and submitted",
  "data": {
    "request": {
      "id": "11111111-1111-4111-8111-111111111111",
      "request_id": "KER-000001",
      "status": "SUBMITTED",
      "submitted_at": "2026-08-14T12:00:00.000Z"
    }
  }
}
```

The endpoint returns `422` when a damage image or RC book is missing, `403` for another customer's request, and `409` when the request is no longer a draft or loses eligibility during submission.
