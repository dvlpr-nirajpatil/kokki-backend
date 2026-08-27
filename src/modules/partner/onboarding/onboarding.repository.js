const { query } = require("../../../config/db");

async function getNextApplicationNumber(client) {
  const result = await client.query(
    "SELECT nextval('vendor_onboarding_request_seq') AS seq",
  );
  return result.rows[0].seq;
}

async function createVendorApplication(client, data) {
  const SQL = `
        INSERT INTO vendor_applications (
            application_no,
            vendor_type,
            name,
            phone,
            whatsapp,
            email
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;

  const result = await client.query(SQL, [
    data.application_no,
    data.vendor_type,
    data.name,
    data.phone,
    data.whatsapp,
    data.email,
  ]);

  return result.rows[0];
}

async function saveBusinessDetails(client, data) {
  const SQL = `
        UPDATE vendor_applications
        SET
            gstin = $1,
            legal_name = $2,
            trade_name = $3,
            business_type = $4,
            gst_status = $5,
            address = $6,
            state = $7,
            city = $8,
            pincode = $9,
            latitude = $10,
            longitude = $11
        WHERE id = $12
        RETURNING *
    `;

  const result = await client.query(SQL, [
    data.gstin,
    data.legal_name,
    data.trade_name,
    data.business_type,
    data.gst_status,
    data.address,
    data.state,
    data.city,
    data.pincode,
    data.latitude,
    data.longitude,
    data.id,
  ]);

  return result.rows[0];
}

async function getSparePartTypes() {
  const SQL = "SELECT id, name From spare_parts_types";
  const result = await query(SQL);
  return result.rows;
}

async function getVehicleCategories() {
  const SQL = "SELECT id, name From vehicle_categories";
  const result = await query(SQL);
  return result.rows;
}

async function getVehicleBrands() {
  const SQL = "SELECT id, name From vehicle_makes";
  const result = await query(SQL);
  return result.rows;
}

async function getSparePartsCategories() {
  const SQL = "SELECT id, name From spare_parts_categories";
  const result = await query(SQL);
  return result.rows;
}

async function saveVendorApplicationSparePartsTypes(
  client,
  applicationId,
  types,
) {
  await client.query(
    `DELETE FROM vendor_application_spare_part_types
         WHERE application_id = $1`,
    [applicationId],
  );

  const SQL = `
        INSERT INTO vendor_application_spare_part_types (
            application_id,
            type_id
        )
        SELECT $1, unnest($2::uuid[])
        RETURNING *
    `;

  const result = await client.query(SQL, [applicationId, types]);

  return result.rows;
}

async function saveVendorApplicationVehicleCategories(
  client,
  applicationId,
  vehicleCategories,
) {
  await client.query(
    `DELETE FROM vendor_application_vehicle_categories
         WHERE application_id = $1`,
    [applicationId],
  );

  const SQL = `
        INSERT INTO vendor_application_vehicle_categories (
            application_id,
            vehicle_category_id
        )
        SELECT $1, unnest($2::uuid[])
        RETURNING *
    `;

  const result = await client.query(SQL, [applicationId, vehicleCategories]);

  return result.rows;
}

async function saveVendorApplicationBrands(client, applicationId, brands) {
  await client.query(
    `DELETE FROM vendor_application_vehicle_brands
         WHERE application_id = $1`,
    [applicationId],
  );

  const SQL = `
        INSERT INTO vendor_application_vehicle_brands (
            application_id,
            brand_id
        )
        SELECT $1, unnest($2::uuid[])
        RETURNING *
    `;

  const result = await client.query(SQL, [applicationId, brands]);

  return result.rows;
}

async function saveVendorApplicationPartsCategories(
  client,
  applicationId,
  categories,
) {
  await client.query(
    `DELETE FROM vendor_application_spare_parts_categories
         WHERE application_id = $1`,
    [applicationId],
  );

  const SQL = `
        INSERT INTO vendor_application_spare_parts_categories (
            application_id,
            category_id
        )
        SELECT $1, unnest($2::uuid[])
        RETURNING *
    `;

  const result = await client.query(SQL, [applicationId, categories]);

  return result.rows;
}

async function saveBusinessHours(data) {
  const SQL =
    "UPDATE vendor_applications SET business_days = $1, opening_time = $2 ,  closing_time = $3 WHERE id = $4 RETURNING *";
  const result = await query(SQL, [
    data.business_days,
    data.opening_time,
    data.closing_time,
    data.id,
  ]);
  return result.rows[0];
}

async function submitApplication(id) {
  const SQL = `
        UPDATE vendor_applications
        SET
            status = 'SUBMITTED',
            submitted_at = NOW()
        WHERE id = $1
        RETURNING *
    `;

  const result = await query(SQL, [id]);

  return result.rows[0];
}

async function fetchRepairCapabilities() {
  const SQL = "SELECT id,name FROM repair_capabilities";
  const result = await query(SQL);
  return result.rows;
}

async function saveGarageDetails(client, data) {
  await client.query(
    "DELETE FROM  vendor_application_garage_details WHERE application_id = $1",
    [data.id],
  );
  const SQL = `
        INSERT INTO vendor_application_garage_details (
            application_id,
            service_pickup_radius_km,
            provides_pickup_drop,
            no_of_service_bays,
            no_of_technicians,
            no_of_denting_technicians,
            no_of_painters,
            paint_booth_available,
            vehicle_lift_available,
            diagnostic_scanner_available,
            wheel_alignment_machine_available,
            dedicated_accident_repair_area_available
        )
        VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12
        )
        RETURNING *
    `;

  const result = await client.query(SQL, [
    data.id,
    data.service_pickup_radius_km,
    data.provides_pickup_drop,
    data.no_of_service_bays,
    data.no_of_technicians,
    data.no_of_denting_technicians,
    data.no_of_painters,
    data.paint_booth_available,
    data.vehicle_lift_available,
    data.diagnostic_scanner_available,
    data.wheel_alignment_machine_available,
    data.dedicated_accident_repair_area_available,
  ]);

  return result.rows[0];
}

async function saveGarageCapabilities(client, data) {
  const SQL = `
        INSERT INTO vendor_application_garage_capabilities (
            application_id,
            capability_id
        )
        SELECT $1, unnest($2::uuid[])
        RETURNING *
    `;

  const result = await client.query(SQL, [data.id, data.repair_capabilities]);

  return result.rows;
}


async function saveVehiclesAndInsuranceDetails(client, data) {
  const SQL = `
    UPDATE vendor_application_garage_details
    SET
      currently_handles_insurance_repairs = $1,
      no_of_insurance_repair_experience = $2,
      insurance_vehicles_per_month = $3,
      has_dedicated_insurance_coordinator = $4,
      has_surveyor_inspection_facility = $5,
      has_previous_cashless_repair_experience = $6
    WHERE application_id = $7
    RETURNING *
  `;

  const result = await client.query(SQL, [
    data.currently_handles_insurance_repairs,
    data.no_of_insurance_repair_experience,
    data.insurance_vehicles_per_month,
    data.has_dedicated_insurance_coordinator,
    data.has_surveyor_inspection_facility,
    data.has_previous_cashless_repair_experience,
    data.id
  ]);

  return result.rows[0];
}

async function saveShopOrGarageImages(data) {

  const photoTypes = data.images.map(
    image => image.photo_type
  );

  const objectKeys = data.images.map(
    image => image.object_key
  );

  const sortOrders = data.images.map(
    image => image.sort_order ?? 0
  );

  const SQL = `
        INSERT INTO vendor_application_garage_photos (
            application_id,
            photo_type,
            object_key,
            sort_order
        )
        SELECT
            $1,
            *
        FROM unnest(
            $2::vendor_application_garage_photo_type[],
            $3::text[],
            $4::integer[]
        )
        RETURNING *
    `;

  const result = await query(SQL, [
    data.id,
    photoTypes,
    objectKeys,
    sortOrders
  ]);

  return result.rows;

}


async function saveUploadedDocuments(data) {

  const documentTypes = data.documents.map(
    document => document.document_type
  );

  const fileTypes = data.documents.map(
    document => document.file_type
  );

  const objectKeys = data.documents.map(
    document => document.object_key
  );

  const sortOrders = data.documents.map(
    document => document.sort_order ?? 0
  );

  const SQL = `
        INSERT INTO vendor_application_documents (
            application_id,
            document_type,
            file_type,
            object_key,
            sort_order
        )
        SELECT
            $1,
            *
        FROM unnest(
            $2::vendor_application_document_type[],
            $3::vendor_application_document_file_type[],
            $4::text[],
            $5::integer[]
        )
        RETURNING *
    `;

  const result = await query(SQL, [
    data.id,
    documentTypes,
    fileTypes,
    objectKeys,
    sortOrders
  ]);

  return result.rows;
}

module.exports = {
  saveUploadedDocuments,
  saveShopOrGarageImages,
  saveVehiclesAndInsuranceDetails,
  saveGarageDetails,
  saveGarageCapabilities,
  fetchRepairCapabilities,
  submitApplication,
  saveBusinessHours,
  getNextApplicationNumber,
  createVendorApplication,
  saveBusinessDetails,
  getSparePartTypes,
  getVehicleCategories,
  getVehicleBrands,
  getSparePartsCategories,
  saveVendorApplicationSparePartsTypes,
  saveVendorApplicationVehicleCategories,
  saveVendorApplicationBrands,
  saveVendorApplicationPartsCategories,
};
