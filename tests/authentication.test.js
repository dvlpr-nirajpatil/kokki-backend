const request = require("supertest");
const app = require("../src/app");
const { query, closeDbConnection } = require("../src/config/db");

const TEST_EMAILS = [
  "signup.test@example.com",
  "duplicate-signup.test@example.com",
];
const TEST_DEVICE_IDS = ["SIGNUP_TEST_DEVICE", "DUPLICATE_SIGNUP_TEST_DEVICE"];

const cleanupSignupTestData = async () => {
  await query(
    `DELETE FROM sessions
     WHERE device_id = ANY($1)
        OR user_id IN (SELECT id FROM users WHERE email = ANY($2))`,
    [TEST_DEVICE_IDS, TEST_EMAILS],
  );
  await query("DELETE FROM users WHERE email = ANY($1)", [TEST_EMAILS]);
};

describe("SIGN UP APIS", () => {
  beforeEach(async () => {
    await cleanupSignupTestData();
  });

  afterAll(async () => {
    await cleanupSignupTestData();
    await closeDbConnection();
  });

  test("email is required", async () => {
    const response = await request(app).post("/v1/signUp").send({
      password: "12345678",
      name: "Niraj Patil",
      device_id: "DEVICE_1",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("email is required");
  });

  test("name is required", async () => {
    const response = await request(app).post("/v1/signUp").send({
      email: "dev.nirajpatil5@gmail.com",
      password: "12345678",
      device_id: "DEVICE_1",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("name is required");
  });

  test("password is required", async () => {
    const response = await request(app).post("/v1/signUp").send({
      email: "dev.nirajpatil5@gmail.com",
      name: "Niraj Patil",
      device_id: "DEVICE_1",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("password is required");
  });

  test("device id is required", async () => {
    const response = await request(app).post("/v1/signUp").send({
      email: "signup.test@example.com",
      password: "12345678",
      name: "Niraj Patil",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("device_id is required");
  });

  test("email must be valid", async () => {
    const response = await request(app).post("/v1/signUp").send({
      email: "invalid-email",
      password: "12345678",
      name: "Niraj Patil",
      device_id: "SIGNUP_TEST_DEVICE",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid email address");
  });

  test("user should be created successfully", async () => {
    const payload = {
      email: "signup.test@example.com",
      password: "12345678",
      name: "Niraj Patil",
      device_id: "SIGNUP_TEST_DEVICE",
    };

    const response = await request(app).post("/v1/signUp").send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Profile Successfully Created");
    expect(response.body.data.user.email).toBe(payload.email);
    expect(response.body.data.user.name).toBe(payload.name);
    expect(response.body.data.accessToken).toEqual(expect.any(String));
    expect(response.body.data.refreshToken).toEqual(expect.any(String));
    expect(response.body.data.session.user_id).toBe(response.body.data.user.id);
    expect(response.body.data.session.device_id).toBe(payload.device_id);
  });

  test("duplicate email should not create user", async () => {
    const payload = {
      email: "duplicate-signup.test@example.com",
      password: "12345678",
      name: "Niraj Patil",
      device_id: "DUPLICATE_SIGNUP_TEST_DEVICE",
    };

    await request(app).post("/v1/signUp").send(payload);
    const response = await request(app).post("/v1/signUp").send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Email Alredy Exists");
  });
});
