const request = require("supertest");

jest.mock("../src/modules/estimatesRequests/estimateRequests.service", () => ({
  createEstimateRequestStep1: jest.fn(),
}));

const app = require("../src/app");
const service = require("../src/modules/estimatesRequests/estimateRequests.service");

const endpoint = "/api/v1/estimate-requests/create-request/step-1";
const validPayload = {
  registrationNo: "MH01AB1234",
  phoneNo: "9876543210",
  email: "customer@example.com",
  servicePin: 411001,
  isVehicleDrivable: "YES",
};

describe("Estimate request step 1 validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    service.createEstimateRequestStep1.mockResolvedValue({
      request: { id: "11111111-1111-4111-8111-111111111111" },
      accessToken: "access-token",
    });
  });

  test("rejects a request with missing fields", async () => {
    const response = await request(app).post(endpoint).send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Registration number is required");
    expect(service.createEstimateRequestStep1).not.toHaveBeenCalled();
  });

  test.each([
    ["registration number", { registrationNo: "MH01@1234" }],
    ["phone number", { phoneNo: "1234567890" }],
    ["email", { email: "invalid-email" }],
    ["service PIN", { servicePin: 12345 }],
    ["vehicle drivable status", { isVehicleDrivable: "MAYBE" }],
  ])("rejects an invalid %s", async (_field, override) => {
    const response = await request(app)
      .post(endpoint)
      .send({ ...validPayload, ...override });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(service.createEstimateRequestStep1).not.toHaveBeenCalled();
  });

  test("passes normalized validated data to the service", async () => {
    const response = await request(app)
      .post(endpoint)
      .send({
        ...validPayload,
        registrationNo: " mh 01 ab 1234 ",
        email: " CUSTOMER@EXAMPLE.COM ",
        servicePin: "411001",
        isVehicleDrivable: "NOT_SURE",
      });

    expect(response.statusCode).toBe(201);
    expect(service.createEstimateRequestStep1).toHaveBeenCalledWith(
      "MH 01 AB 1234",
      "9876543210",
      "customer@example.com",
      411001,
      "NOT_SURE",
    );
  });

  test("rejects fields outside the step 1 contract", async () => {
    const response = await request(app)
      .post(endpoint)
      .send({ ...validPayload, unexpected: true });

    expect(response.statusCode).toBe(400);
    expect(service.createEstimateRequestStep1).not.toHaveBeenCalled();
  });
});
