const { query } = require("../../../config/db");

async function getEstimateRequests() {
  const SQL = `
        SELECT *
        FROM estimate_requests
        WHERE status = $1
        ORDER BY created_at DESC
    `;

  const result = await query(SQL, ["SUBMITTED"]);
  return result.rows;
}

async function getEstimateRequestById(estimateRequestId) {
  const SQL = `
        SELECT *
        FROM estimate_requests
        WHERE id = $1
    `;

  const result = await query(SQL, [estimateRequestId]);
  return result.rows[0];
}

async function getEstimateRequestImages(estimateRequestId) {
  const SQL = `
        SELECT id, object_key
        FROM estimate_request_images
        WHERE estimate_request_id = $1
        ORDER BY sort_order, id
    `;

  const result = await query(SQL, [estimateRequestId]);
  return result.rows;
}

async function getEstimateRequestDocuments(estimateRequestId) {
  const SQL = `
        SELECT id, document_type, object_key
        FROM estimate_request_documents
        WHERE estimate_request_id = $1
        ORDER BY sort_order, id
    `;

  const result = await query(SQL, [estimateRequestId]);
  return result.rows;
}

module.exports = {
  getEstimateRequests,
  getEstimateRequestById,
  getEstimateRequestImages,
  getEstimateRequestDocuments,
};
