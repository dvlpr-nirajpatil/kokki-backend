const { response } = require("../../../core/index");
const service = require("./onboarding.service");
const jwt = require("../../../utils/jwt");



//----------------------------------------------------------------------------------------------------------------------------------------
// CREATE VENDOR APPLICATION STEP - 1 
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.createVendorApplication = async (req, res) => {
  try {

    const data = req.validatedData.body;

    const application = await service.createApplication(data);

    const payload = {
      id: application.id
    }

    const accessToken = await jwt.getAccessToken(payload);

    return response.success(
      res,
      201,
      "Application Successfully Created !",
      { application, accessToken },
    );

  } catch (e) {
    throw e;
  }
};

//----------------------------------------------------------------------------------------------------------------------------------------
// SAVE BUSINESS DETAILS STEP - 2
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.saveBusinessDetails = async (req, res) => {
  try {
    const data = req.validatedData.body;

    data.id = req.validatedData.params.id;

    const application = await service.saveBusinessDetails(data);

    return response.success(
      res,
      200,
      "Business details stored successfully !",
      application,
    );
  } catch (e) {
    throw e;
  }
};

//----------------------------------------------------------------------------------------------------------------------------------------
// SUBMIT APPLICATION LAST STEP
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.submitApplication = async (req, res) => {
  try {
    const id = req.validatedData.params.id;
    const application = await service.submitApplication(id);
    return response.success(
      res,
      200,
      "Application Successfully Submitted !",
      application,
    );
  } catch (e) {
    throw e;
  }
};



//----------------------------------------------------------------------------------------------------------------------------------------
// SPARES PARTS STEP 3 GET FIELDS
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.getSparePartsProfileFormFields = async (req, res) => {
  try {
    const fields = await service.getFormFields();
    return response.success(res, 200, fields);
  } catch (e) {
    throw e;
  }
};

//----------------------------------------------------------------------------------------------------------------------------------------
// SPARE PARTS STEP 3 SAVE
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.saveSparePartsProfile = async (req, res) => {
  try {
    const data = req.validatedData.body;
    data.id = req.validatedData.params.id;

    const result = await service.saveSparePartsProfile(data);

    return response.success(res, 200, "Profile Successfully Saved !", result);
  } catch (e) {
    throw e;
  }
};


//----------------------------------------------------------------------------------------------------------------------------------------
// SAVE BUSINESS DETAILS
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.saveBusinessHours = async (req, res) => {
  try {
    const data = req.validatedData.body;
    data.id = req.validatedData.params.id;

    const result = await service.saveBusinessHours(data);

    return response.success(
      res,
      200,
      "business hours successfully updated !",
      result,
    );
  } catch (e) {
    throw e;
  }
};

//----------------------------------------------------------------------------------------------------------------------------------------
// GARAGE VENDOR SPECIFIC
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.fetchRepairCapabilities = async (req, res) => {
  try {
    const capabilites = await service.fetchRepairCapabilties();
    return response.success(
      res,
      200,
      "Repair Capabilities fetched successfully !",
      capabilites,
    );
  } catch (e) {
    throw e;
  }
};


module.exports.getVehiclesAndInsuranceExpeirnceFormFields = async (req, res) => {
  try {

    const data = await service.getVehiclesAndExperienceFormFields();
    return response.success(res, 200, "Vehicle and insurance experince form fields get successfully !", data);

  } catch (e) {
    throw e;
  }
}



module.exports.presignLocationImages = async (req, res) => {
  const { id } = req.validatedData.params;
  const { contentType } = req.validatedData.body;
  const presign = await service.createLocationImagePresign(
    id,
    contentType,
  );

  return response.success(res, 200, "Location image upload URL created", presign);
};


module.exports.saveGarageOrShopImages = async (req, res) => {
  try {

    const body = req.validatedData.body;
    const application_id = req.validatedData.params.id;

    const data = {
      id: application_id,
      images: body
    }



    const images = await service.saveGarageAndShopImages(data);


    return response.success(res, 200, "Images Stored Successfully !", images);
  } catch (e) {
    throw e;
  }
}



module.exports.presignOnboardingDocuments = async (req, res) => {
  const { id } = req.validatedData.params;
  const { contentType } = req.validatedData.body;
  const presign = await service.createApplicationDocumentsPresign(
    id,
    contentType,
  );

  return response.success(res, 200, "Application document upload URL created", presign);
};



module.exports.saveApplicationDocuments = async (req, res) => {
  try {
    const id = req.validatedData.params.id;
    const documents = req.validatedData.body;
    const data = {
      id, documents
    };




    const uploadedDocuments = await service.saveApplicationDocuments(data);

    return response.success(res, 200, "Documents Successfuly Stored !", uploadedDocuments);

  } catch (e) {
    throw e;
  }
}


module.exports.saveLocation = async (req, res) => {
  const data = {
    ...req.validatedData.body,
    id: req.validatedData.params.id
  };

  const application = await service.saveBusinessLocation(data);

  return response.success(
    res,
    200,
    "Location successfully updated!",
    application
  );
};


//----------------------------------------------------------------------------------------------------------------------------------------
// SERVICE VENDOR ONBOARDING - STEP 4
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.getSetpFourFormFieldsServiceVendor = async (req, res) => {
  const data = await service.getStepFourFieldsServiceVendorOnboarding();
  return response.success(res, 200, "Step 4 form fields fetched successfully!", data);
}

module.exports.saveStepFourServiceVendor = async (req, res) => {

  const data = {
    id: req.validatedData.params.id,
    ...req.validatedData.body
  }

  const details = await service.saveStepFourDetailsServiceVendor(data);

  return response.success(res, 200, "Step Four details successfully stored!", details);

}


//----------------------------------------------------------------------------------------------------------------------------------------
// SERVICE VENDOR ONBOARDING - STEP 5
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.getSetpFiveFormFieldsServiceVendor = async (req, res) => {
  const data = await service.getStepFiveFieldsServiceVendorOnboarding();
  return response.success(res, 200, "Step Five form fields fetched successfully!", data);
}

module.exports.saveStepFiveServiceVendor = async (req, res) => {
  try {
    const data = req.validatedData.body;
    data.id = req.validatedData.params.id;
    const garage = await service.saveGarageCapabilties(data);
    return response.success(
      res,
      200,
      "Garage Capabilties updated successfully !",
      garage,
    );
  } catch (e) {
    throw e;
  }
};



//----------------------------------------------------------------------------------------------------------------------------------------
// SERVICE VENDOR - STEP 6
//----------------------------------------------------------------------------------------------------------------------------------------
module.exports.getStepSixFormFieldsServiceVendor = async (req, res) => {
  const data = await service.getStepSixFieldsServiceVendorOnboarding();
  return response.success(res, 200, "Step Six form fields fetched successfully!", data);
}

module.exports.saveStepSixServiceVendor = async (req, res) => {
  try {

    const data = req.validatedData.body;

    data.id = req.validatedData.params.id;

    const result = await service.saveStepSixDetailsServiceVendor(data);

    return response.success(res, 200, "Step 6 data save successfully", result);

  } catch (e) {
    throw e;
  }
}