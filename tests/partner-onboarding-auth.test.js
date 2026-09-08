const request = require("supertest");

jest.mock("../src/modules/partner/onboarding/onboarding.service", () => ({
  createApplication: jest.fn(),
  getFormFields: jest.fn(),
  saveBusinessHours: jest.fn(),
}));

const onboardingService = require("../src/modules/partner/onboarding/onboarding.service");
const app = require("../src/app");

const APPLICATION_ID = "26cb1dce-fe76-418b-b8ef-ef31970ea310";
const OTHER_APPLICATION_ID = "91c2332a-d11b-46b9-9017-79a4c44de659";

async function createApplicationAndGetToken() {
  onboardingService.createApplication.mockResolvedValue({
    id: APPLICATION_ID,
    vendor_type: "SERVICE_GARAGE",
  });

  const apiResponse = await request(app)
    .post("/api/v1/partner/onboarding/create-application")
    .send({
      name: "Test Partner",
      phone: "9876543210",
      whatsapp: "9876543210",
      email: "partner@example.com",
      vendor_type: "SERVICE_GARAGE",
    });

  expect(apiResponse.statusCode).toBe(201);
  return apiResponse.body.data.accessToken;
}

describe("Partner onboarding authentication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates the initial application without an access token", async () => {
    const accessToken = await createApplicationAndGetToken();

    expect(accessToken).toEqual(expect.any(String));
  });

  test("requires a bearer token for subsequent onboarding endpoints", async () => {
    const apiResponse = await request(app).get(
      "/api/v1/partner/onboarding/spare-parts-profile-form-fields",
    );

    expect(apiResponse.statusCode).toBe(401);
    expect(apiResponse.body.message).toBe("Access token is required");
    expect(onboardingService.getFormFields).not.toHaveBeenCalled();
  });

  test("accepts the application token on subsequent endpoints", async () => {
    const accessToken = await createApplicationAndGetToken();
    onboardingService.getFormFields.mockResolvedValue({ partTypes: [] });

    const apiResponse = await request(app)
      .get("/api/v1/partner/onboarding/spare-parts-profile-form-fields")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(apiResponse.statusCode).toBe(200);
    expect(onboardingService.getFormFields).toHaveBeenCalledTimes(1);
  });

  test("rejects access to a different application ID", async () => {
    const accessToken = await createApplicationAndGetToken();

    const apiResponse = await request(app)
      .post(`/api/v1/partner/onboarding/${OTHER_APPLICATION_ID}/business-hours`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        business_days: "Monday-Friday",
        opening_time: "09:00",
        closing_time: "18:00",
      });

    expect(apiResponse.statusCode).toBe(403);
    expect(apiResponse.body.message).toBe(
      "You do not have access to this vendor application",
    );
    expect(onboardingService.saveBusinessHours).not.toHaveBeenCalled();
  });

  test("allows access when the route ID matches the token", async () => {
    const accessToken = await createApplicationAndGetToken();
    onboardingService.saveBusinessHours.mockResolvedValue({
      id: APPLICATION_ID,
    });

    const apiResponse = await request(app)
      .post(`/api/v1/partner/onboarding/${APPLICATION_ID}/business-hours`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        business_days: "Monday-Friday",
        opening_time: "09:00",
        closing_time: "18:00",
      });

    expect(apiResponse.statusCode).toBe(200);
    expect(onboardingService.saveBusinessHours).toHaveBeenCalledWith(
      expect.objectContaining({ id: APPLICATION_ID }),
    );
  });
});
