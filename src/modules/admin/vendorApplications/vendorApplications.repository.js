
const { query } = require("../../../config/db");


async function getVendorApplications() {
    const SQL = `
        SELECT *
        FROM vendor_applications
        WHERE status != $1
    `;

    const result = await query(SQL, ["DRAFT"]);
    return result.rows;
}


async function getVendorApplicationById(applicationId) {

    const SQL = `SELECT vap.*,
                        COALESCE( 
                            json_agg(
                                json_build_object(
                                    
                                )
                            )
                 `;

    const result = await query(SQL, [applicationId]);

    return result.rows[0];

}


module.exports = {
    getVendorApplicationById,
    getVendorApplications
}