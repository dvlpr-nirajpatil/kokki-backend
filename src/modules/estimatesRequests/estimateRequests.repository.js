const { query } = require("@config/db");

async function getRoleByCode(client, code) {
  const SQL = "SELECT * FROM roles WHERE code = $1";
  const roles = await client.query(SQL, [code]);
  return roles.rows[0];
}

async function getNextCustomerSeq(client) {
  const result = await client.query(
    "SELECT nextval('customer_user_seq') AS seq",
  );
  return result.rows[0].seq;
}

async function getNextEstimateRequestSeq(client) {
  const result = await client.query(
    "SELECT nextval('estimate_request_seq') AS seq",
  );
  return result.rows[0].seq;
}

async function findUserByPhoneNumber(client, phoneNo) {
  const SQL = "SELECT * FROM users where phone = $1";
  const users = await client.query(SQL, [phoneNo]);
  return users.rows[0];
}

async function assignUserRole(client, user_id, role_id) {
  const SQL =
    "INSERT INTO user_roles (user_id,role_id) VALUES ($1,$2) RETURNING *";
  const userRole = await client.query(SQL, [user_id, role_id]);
  return userRole.rows[0];
}

async function createNewUserByPhoneNumber(client, user_id, phoneNo, email) {
  const SQL = "INSERT INTO users (user_id,phone,email) VALUES ($1,$2,$3) RETURNING *";
  const user = await client.query(SQL, [user_id, phoneNo, email]);
  return user.rows[0];
}

async function createEstimateRequest(
  client,
  request_id,
  user_id,
  vehicle_no,
  service_pin,
  vehicle_drivable,
  email
) {
  const SQL =
    "INSERT INTO estimate_requests (request_id,user_id,vehicle_no,service_pincode,vehicle_drivable,current_step,email) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *";
  const request = await client.query(SQL, [
    request_id,
    user_id,
    vehicle_no,
    service_pin,
    vehicle_drivable,
    2,
    email
  ]);
  return request.rows[0];
}

async function findEstimateRequestById(id) {
  const SQL = `
        SELECT
            id,
            request_id,
            user_id,
            vehicle_no,
            status,
            current_step
        FROM estimate_requests
        WHERE id = $1
    `;
  const request = await query(SQL, [id]);
  return request.rows[0];
}

async function createEstimateRequestImage(
  estimateRequestId,
  objectKey,
  imageUrl,
) {
  const SQL = `
        INSERT INTO estimate_request_images (
            estimate_request_id,
            object_key,
            image_url
        )
        VALUES ($1, $2, $3)
        ON CONFLICT (object_key)
        DO UPDATE SET
            image_url = EXCLUDED.image_url,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
    `;
  const image = await query(SQL, [estimateRequestId, objectKey, imageUrl]);
  return image.rows[0];
}

async function getEstimateRequestCompletionReadiness(estimateRequestId) {
  const SQL = `
        SELECT
            EXISTS (
                SELECT 1
                FROM estimate_request_documents erd
                WHERE erd.estimate_request_id = $1
                  AND erd.document_type = 'RC_BOOK'
            ) AS has_rc_book,
            EXISTS (
                SELECT 1
                FROM estimate_request_images eri
                WHERE eri.estimate_request_id = $1
                  AND eri.object_key ~* '\\.(jpg|png|webp|avif|heic|heif)$'
            ) AS has_damage_images
    `;
  const readiness = await query(SQL, [estimateRequestId]);
  return readiness.rows[0];
}

async function submitEstimateRequest(estimateRequestId, userId) {
  const SQL = `
        UPDATE estimate_requests er
        SET status = 'SUBMITTED',
            submitted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE er.id = $1
          AND er.user_id = $2
          AND er.status = 'DRAFT'
          AND EXISTS (
              SELECT 1
              FROM estimate_request_documents erd
              WHERE erd.estimate_request_id = er.id
                AND erd.document_type = 'RC_BOOK'
          )
          AND EXISTS (
              SELECT 1
              FROM estimate_request_images eri
              WHERE eri.estimate_request_id = er.id
                AND eri.object_key ~* '\\.(jpg|png|webp|avif|heic|heif)$'
          )
        RETURNING *
    `;
  const request = await query(SQL, [estimateRequestId, userId]);
  return request.rows[0];
}

async function saveRequestDocuments(estimateRequestId, documents) {
  const SQL = `
        INSERT INTO estimate_request_documents (
            estimate_request_id,
            document_type,
            object_key,
            "order"
        )
        SELECT
            $1,
            input.document_type::estimate_request_document_type,
            input.object_key,
            input.document_order
        FROM jsonb_to_recordset($2::jsonb) AS input (
            document_type text,
            object_key text,
            document_order integer
        )
        ON CONFLICT (estimate_request_id, document_type)
        DO UPDATE SET
            object_key = EXCLUDED.object_key,
            "order" = EXCLUDED."order",
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
    `;
  const input = documents.map((document) => ({
    document_type: document.document_type,
    object_key: document.object_key,
    document_order: document.order,
  }));
  const result = await query(SQL, [estimateRequestId, JSON.stringify(input)]);

  return result.rows.sort((first, second) => first.order - second.order);
}

async function getUserById(userId) {
  const SQL = "SELECT * FROM users where id = $1";
  const result = await query(SQL, [userId]);
  return result.rows[0];

}

module.exports = {
  findUserByPhoneNumber,
  getNextCustomerSeq,
  getRoleByCode,
  assignUserRole,
  createNewUserByPhoneNumber,
  createEstimateRequest,
  getNextEstimateRequestSeq,
  findEstimateRequestById,
  createEstimateRequestImage,
  getEstimateRequestCompletionReadiness,
  submitEstimateRequest,
  saveRequestDocuments,
  getUserById

};
