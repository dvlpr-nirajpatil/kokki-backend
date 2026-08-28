const { query } = require("../../../config/db");

async function getEstimateRequests() {
    const SQL = `
        SELECT
            er.*,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', er_images.id,
                        'object_key', er_images.object_key
                    )
                ) FILTER (WHERE er_images.id IS NOT NULL),
                '[]'
            ) AS images,
              COALESCE(
                json_agg(
                    json_build_object(
                        'id' , er_documents.id,
                        'document_type', er_documents.document_type,
                        'object_key', er_documents.object_key
                    )
                ) FILTER (WHERE er_images.id IS NOT NULL),
                '[]'
            ) AS documents
       

        FROM estimate_requests er

        LEFT JOIN estimate_request_images er_images
            ON er.id = er_images.estimate_request_id

        LEFT JOIN estimate_request_documents er_documents on er.id = er_documents.estimate_request_id    

        WHERE er.status = $1

        GROUP BY er.id

        ORDER BY er.created_at DESC
    `;

    const result = await query(SQL, ["SUBMITTED"]);

    return result.rows;
}

module.exports = {
    getEstimateRequests
}