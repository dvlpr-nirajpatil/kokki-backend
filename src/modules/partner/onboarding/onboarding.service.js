const AppError = require("../../../utils/app_error");
const repository = require("./onboarding.repository");
const { pool, query } = require("../../../config/db");
const crypto = require("crypto");
const s3Presign = require("../../../integrations/s3/presign.service");
const env = require("../../../config/env");
const { sendEmail } = require("../../../integrations/email/email.service");
const {
  vendorApplicationSubmittedTemplate,
} = require("../../../integrations/email/templates/vendor-application-submitted.template");


async function createApplication(data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const seq = await repository.getNextApplicationNumber(client);

    const applicationNo = `KVA-${String(seq).padStart(6, "0")}`;

    data.application_no = applicationNo;

    const application = await repository.createVendorApplication(client, data);

    await client.query("COMMIT");

    return application;
  } catch (e) {
    await client.query("ROLLBACK");

    throw new AppError(e);
  } finally {
    client.release();
  }
}

async function saveBusinessDetails(data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const application = await repository.saveBusinessDetails(client, data);

    await client.query("COMMIT");

    return application;
  } catch (e) {
    await client.query("ROLLBACK");
    throw new AppError(e);
  } finally {
    client.release();
  }
}

async function getFormFields() {
  try {
    const [partTypes, vehicleCategories, vehicleBrands, partsCategories, vendorTypes] =
      await Promise.all([
        repository.getSparePartTypes(),
        repository.getVehicleCategories(),
        repository.getVehicleBrands(),
        repository.getSparePartsCategories(),
        repository.getSparePartsVendorTypes()
      ]);

    return {
      partTypes,
      vehicleCategories,
      vehicleBrands,
      partsCategories,
      vendorTypes
    };
  } catch (e) {
    throw new AppError(e);
  }
}

async function saveSparePartsProfile(data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");


    const businessTypes = await repository.saveVendorApplicationBusinessTypes(client, data.id, data.businessTypes);

    const partTypes = await repository.saveVendorApplicationSparePartsTypes(
      client,
      data.id,
      data.partTypes,
    );

    const vehicleCategories =
      await repository.saveVendorApplicationVehicleCategories(
        client,
        data.id,
        data.vehicleCategories,
      );

    const brands = await repository.saveVendorApplicationBrands(
      client,
      data.id,
      data.vehicleBrands,
    );

    const partsCategories =
      await repository.saveVendorApplicationPartsCategories(
        client,
        data.id,
        data.partsCategories,
      );

    await client.query("COMMIT");

    return {
      businessTypes,
      partTypes,
      vehicleCategories,
      brands,
      partsCategories,
    };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function saveBusinessHours(data) {
  try {
    const business = await repository.saveBusinessHours(data);
    return business;
  } catch (e) {
    throw new AppError(e);
  }
}

async function submitApplication(id) {
  try {
    const application = await repository.submitApplication(id);

    const submittedAt = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(new Date(application.submitted_at));

    const email = vendorApplicationSubmittedTemplate({
      email: application.email,
      vendorName: application.name,
      businessName: application.trade_name,
      applicationNumber: application.application_no,
      vendorType: application.vendor_type == "SPARE_PARTS" ? "Spare Parts Vendorship" : "Service Vendorship",
      submittedAt: submittedAt,
      supportEmail: "support@kokki.in",
    });

    await sendEmail(email);

    return application;
  } catch (e) {
    throw new AppError(e);
  }
}

async function saveGarageCapabilties(data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const garrage = await repository.saveGarageDetails(client, data);
    const capabilities = await repository.saveGarageCapabilities(client, data);
    garrage.capabilities = capabilities;

    await client.query("COMMIT");

    return garrage;
  } catch (e) {
    await client.query("ROLLBACK");
    throw new AppError(e);
  } finally {
    client.release();
  }
}

async function fetchRepairCapabilties() {
  try {

    return await repository.fetchRepairCapabilities();
  } catch (e) {
    throw new AppError(e);
  }
}

async function getVehiclesAndExperienceFormFields() {
  try {

    const [vehicleTypes, vehicleBrands] = await Promise.all([
      repository.getVehicleCategories(),
      repository.getVehicleBrands(),

    ]);

    return { vehicleTypes, vehicleBrands };

  } catch (error) {
    throw new AppError(error);
  }
}

async function saveStepSixDetailsServiceVendor(data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insuranceCompnaies = await repository.saveVendorApplicationsInsuranceCompanies(client, data.id, data.insurance_compnies)

    const insuranceDetails = await repository.saveVehiclesAndInsuranceDetails(
      client,
      data,
    );



    await client.query("COMMIT");

    return { insuranceCompnaies, insuranceDetails };
  } catch (e) {
    await client.query("ROLLBACK");
    throw new AppError(e);
  } finally {
    client.release();
  }
}



//----------------------------------------------------------------------------------------------------------------------------------------
// CREATE PRESIGN LOCATION IMAGES 
//----------------------------------------------------------------------------------------------------------------------------------------

function createLocationImageObjectKey(application_id, extension) {
  return `vendor-applications/${application_id}/location/${crypto.randomUUID()}.${extension}`;
}


async function createLocationImagePresign(
  application_id,
  requestedContentType,
) {
  return s3Presign.createAssetPresign({
    application_id,
    requestedContentType,
    allowedContentTypes: s3Presign.IMAGE_CONTENT_TYPES,
    createObjectKey: createLocationImageObjectKey,
    assetName: "Shop or Garage Images",
  });
}


async function saveGarageAndShopImages(data) {
  try {

    const uploadedImages = data.images;

    await Promise.all(
      uploadedImages.map((image) =>
        s3Presign.verifyUploadedObject(
          {
            objectKey: image.object_key,
            allowedContentTypes: s3Presign.IMAGE_CONTENT_TYPES
          })));

    const storedImages = await repository.saveShopOrGarageImages(data);

    return storedImages.map((image) => ({
      ...image,
      url: `${env.aws.cdnBaseUrl}/${image.object_key}`,
    }));


  } catch (e) {
    throw new AppError(e);
  }
}


//----------------------------------------------------------------------------------------------------------------------------------------
// CREATE PRESIGN APPLICATION DOCUMENTS
//----------------------------------------------------------------------------------------------------------------------------------------

function createApplicationDocumentsObjectKey(application_id, extension) {
  return `vendor-applications/${application_id}/documents/${crypto.randomUUID()}.${extension}`;
}

async function createApplicationDocumentsPresign(
  application_id,
  requestedContentType,
) {
  return s3Presign.createAssetPresign({
    application_id,
    requestedContentType,
    allowedContentTypes: s3Presign.DOCUMENT_CONTENT_TYPES,
    createObjectKey: createApplicationDocumentsObjectKey,
    assetName: "Application Documents",
  });
}


async function saveApplicationDocuments(data) {
  try {
    const documents = data.documents;






    if (!documents?.length) {
      throw new AppError("At least one document is required", 400);
    }

    await Promise.all(
      documents.map((document) =>
        s3Presign.verifyUploadedObject({
          objectKey: document.object_key,
          allowedContentTypes: s3Presign.DOCUMENT_CONTENT_TYPES
        })
      )
    );

    const savedDocuments =
      await repository.saveUploadedDocuments(data);

    return savedDocuments.map((document) => ({
      ...document,
      url: `${env.aws.cdnBaseUrl}/${document.object_key}`,
    }));

  } catch (e) {
    throw new AppError(e);
  }
}


async function saveBusinessLocation(data) {
  const application = await repository.saveBusinessLocation(data);

  if (!application) {
    throw new AppError("Vendor application not found", 404);
  }

  return application;
}

//----------------------------------------------------------------------------------------------------------------------------------------
// STEP 4 - SERVICE VENDOR
//----------------------------------------------------------------------------------------------------------------------------------------

async function getStepFourFieldsServiceVendorOnboarding() {
  try {

    const [busiessTypes, vehicleCategories, vehicleBrands] = await Promise.all([
      repository.getBusinessTypesForServiceCenters(),
      repository.getVehicleCategories(),
      repository.getVehicleBrands()
    ]);

    return {
      busiessTypes, vehicleCategories, vehicleBrands
    }

  } catch (e) {
    throw new AppError(e);
  }
}


async function saveStepFourDetailsServiceVendor(data) {
  const client = await pool.connect();
  try {


    await client.query("BEGIN");
    const businessType = await repository.saveBusinessType(client, data.id, data.businessType);
    const vehicleCategories = await repository.saveVendorApplicationVehicleCategories(client, data.id, data.vehicleCategories);
    const vehicleBrands = await repository.saveVendorApplicationBrands(client, data.id, data.vehicleBrands);
    await client.query("COMMIT");

    return {
      businessType, vehicleCategories, vehicleBrands
    }

  } catch (e) {
    await client.query("ROLLBACK");
    throw new AppError(e);
  } finally {
    client.release();
  }
}


//----------------------------------------------------------------------------------------------------------------------------------------
// STEP 5 - SERVICE VENDOR
//----------------------------------------------------------------------------------------------------------------------------------------

async function getStepFiveFieldsServiceVendorOnboarding() {
  try {

    return await repository.fetchRepairCapabilities();

  } catch (e) {
    throw new AppError(e);
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------
// STEP 6 - SERVICE VENDOR
//----------------------------------------------------------------------------------------------------------------------------------------

async function getStepSixFieldsServiceVendorOnboarding() {
  try {

    return await repository.getInsuranceCompanies();

  } catch (e) {
    throw new AppError(e);
  }
}



module.exports = {
  getStepSixFieldsServiceVendorOnboarding,
  getStepFiveFieldsServiceVendorOnboarding,
  saveStepFourDetailsServiceVendor,
  getStepFourFieldsServiceVendorOnboarding,
  saveBusinessLocation,
  saveApplicationDocuments,
  saveGarageAndShopImages,
  createApplicationDocumentsPresign,
  createLocationImagePresign,
  saveStepSixDetailsServiceVendor,
  getVehiclesAndExperienceFormFields,
  fetchRepairCapabilties,
  submitApplication,
  saveBusinessHours,
  createApplication,
  saveBusinessDetails,
  getFormFields,
  saveSparePartsProfile,
  saveGarageCapabilties,
};
