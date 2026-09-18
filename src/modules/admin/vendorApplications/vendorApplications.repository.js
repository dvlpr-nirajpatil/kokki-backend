
const { query } = require("../../../config/db");


async function getVendorApplications() {
    const SQL = `
        SELECT id,application_no,trade_name, application_no, vendor_type,name,phone,city,state,status,submitted_at
        FROM vendor_applications
        WHERE status != $1
    `;

    const result = await query(SQL, ["DRAFT"]);
    return result.rows;
}


async function getApplicationDetails(applicationId) {
    const SQL = "SELECT * FROM vendor_applications WHERE id = $1";
    const result = await query(SQL, [applicationId]);
    return result.rows[0];
}

async function getGarageDetails(applicationId) {
    const SQL = "SELECT * FROM vendor_application_garage_details WHERE application_id = $1";
    const result = await query(SQL, [applicationId]);
    return result.rows[0];
}

async function getApplicationBusinessTypes(applicationId) {
    const SQL = `
        SELECT
            COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'id', bt.id,
                        'name', bt.name
                    )
                ),
                '[]'::jsonb
            ) AS business_types
        FROM vendor_application_business_types vabt
        JOIN business_types bt
            ON vabt.business_type_id = bt.id
        WHERE vabt.vendor_application_id = $1
    `;
    const result = await query(SQL, [applicationId]);
    return result.rows[0].business_types;
}

async function getApplicationDocuments(applicationId) {
    const SQL = `
        SELECT id, document_type, object_key
        FROM vendor_application_documents
        WHERE application_id = $1
    `;
    const result = await query(SQL, [applicationId]);
    return result.rows;
}

async function getApplicationCashlessInsuranceTieups(applicationId) {
    const SQL = `
        SELECT ins.id, ins.name
        FROM vendor_application_cashless_insurance_tieups vacit
        JOIN insurance_companies ins
            ON vacit.insurance_company_id = ins.id
        WHERE vacit.application_id = $1
    `;
    const result = await query(SQL, [applicationId]);
    return result.rows;
}

async function getApplicationServiceCapabilities(applicationId) {
    const SQL = `
        SELECT rc.id, rc.name
        FROM vendor_application_garage_capabilities vagc
        JOIN repair_capabilities rc
            ON vagc.capability_id = rc.id
        WHERE vagc.application_id = $1
    `;
    const result = await query(SQL, [applicationId]);
    return result.rows;
}

async function getApplicationLocationImages(applicationId) {
    const SQL = `
        SELECT id, photo_type, object_key, sort_order
        FROM vendor_application_garage_photos
        WHERE application_id = $1
        ORDER BY sort_order, id
    `;
    const result = await query(SQL, [applicationId]);
    return result.rows;
}

async function getApplicationSparePartTypes(applicationId) {
    const SQL = `
        SELECT spt.id, spt.name
        FROM vendor_application_spare_part_types vaspt
        JOIN spare_parts_types spt
            ON vaspt.type_id = spt.id
        WHERE vaspt.application_id = $1
    `;
    const result = await query(SQL, [applicationId]);
    return result.rows;
}

async function getApplicationSparePartCategories(applicationId) {
    const SQL = `
        SELECT spc.id, spc.name
        FROM vendor_application_spare_parts_categories vaspc
        JOIN spare_parts_categories spc
            ON vaspc.category_id = spc.id
        WHERE vaspc.application_id = $1
    `;
    const result = await query(SQL, [applicationId]);
    return result.rows;
}

async function getApplicationVehicleCategories(applicationId) {
    const SQL = `
        SELECT vc.id, vc.name
        FROM vendor_application_vehicle_categories vavc
        JOIN vehicle_categories vc
            ON vavc.vehicle_category_id = vc.id
        WHERE vavc.application_id = $1
    `;
    const result = await query(SQL, [applicationId]);
    return result.rows;
}

async function getApplicationVehicleBrands(applicationId) {
    const SQL = `
        SELECT vm.id, vm.name
        FROM vendor_application_vehicle_brands vavb
        JOIN vehicle_makes vm
            ON vavb.brand_id = vm.id
        WHERE vavb.application_id = $1
    `;
    const result = await query(SQL, [applicationId]);
    return result.rows;
}




module.exports = {
    getVendorApplications,
    getApplicationDetails,
    getGarageDetails,
    getApplicationBusinessTypes,
    getApplicationDocuments,
    getApplicationCashlessInsuranceTieups,
    getApplicationServiceCapabilities,
    getApplicationLocationImages,
    getApplicationSparePartTypes,
    getApplicationSparePartCategories,
    getApplicationVehicleCategories,
    getApplicationVehicleBrands
};
