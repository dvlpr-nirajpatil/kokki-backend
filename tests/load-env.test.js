const dotenv = require("dotenv");

const {
  getVercelEnvironment,
  loadEnvironment,
} = require("../src/config/load-env");

describe("environment loading", () => {
  const originalEnvironment = { ...process.env };
  let dotenvConfigSpy;

  beforeEach(() => {
    dotenvConfigSpy = jest.spyOn(dotenv, "config");
  });

  afterEach(() => {
    process.env = { ...originalEnvironment };
    dotenvConfigSpy.mockRestore();
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
    expect(dotenvConfigSpy).not.toHaveBeenCalled();
  });

  test("uses process.env without loading a file when no argument is provided", () => {
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    delete process.env.VERCEL_TARGET_ENV;
    process.env.NODE_ENV = "production";
    process.env.PORT = "7000";

    expect(loadEnvironment()).toBe("production");
    expect(process.env.PORT).toBe("7000");
    expect(dotenvConfigSpy).not.toHaveBeenCalled();
  });
});
