const dotenv = require("dotenv");

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

const {
  getVercelEnvironment,
  loadEnvironment,
} = require("../src/config/load-env");

describe("environment loading", () => {
  const originalEnvironment = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnvironment };
    jest.clearAllMocks();
  });

  test.each([
    ["development", "development"],
    ["preview", "uat"],
    ["production", "production"],
  ])("maps Vercel %s to %s", (vercelEnvironment, expectedEnvironment) => {
    expect(
      getVercelEnvironment({
        VERCEL: "1",
        VERCEL_ENV: vercelEnvironment,
      }),
    ).toBe(expectedEnvironment);
  });

  test("uses a custom Vercel UAT target", () => {
    expect(
      getVercelEnvironment({
        VERCEL: "1",
        VERCEL_ENV: "preview",
        VERCEL_TARGET_ENV: "uat",
      }),
    ).toBe("uat");
  });

  test("uses Vercel-injected values without loading an env file", () => {
    process.env.VERCEL = "1";
    process.env.VERCEL_ENV = "preview";
    delete process.env.VERCEL_TARGET_ENV;

    expect(loadEnvironment()).toBe("uat");
    expect(process.env.NODE_ENV).toBe("uat");
    expect(dotenv.config).not.toHaveBeenCalled();
  });
});
