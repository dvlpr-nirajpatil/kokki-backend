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

  test.each([
    ["development", ".env.development"],
    ["uat", ".env.uat"],
  ])("loads the required %s environment file", (environment, fileName) => {
    dotenvConfigSpy.mockReturnValue({ parsed: {} });

    expect(loadEnvironment(environment)).toBe(environment);
    expect(process.env.NODE_ENV).toBe(environment);

    const options = dotenvConfigSpy.mock.calls[0][0];
    expect(options.path.endsWith(fileName)).toBe(true);
    expect(options.override).toBe(true);
    expect(options.quiet).toBe(true);
  });

  test("loads optional production .env without overriding injected values", () => {
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    delete process.env.VERCEL_TARGET_ENV;
    process.env.NODE_ENV = "production";
    process.env.PORT = "7000";
    dotenvConfigSpy.mockReturnValue({ parsed: { PORT: "3000" } });

    expect(loadEnvironment()).toBe("production");
    expect(process.env.PORT).toBe("7000");

    const options = dotenvConfigSpy.mock.calls[0][0];
    expect(options.path.endsWith(".env")).toBe(true);
    expect(options.override).toBe(false);
    expect(options.quiet).toBe(true);
  });

  test("allows production to run when .env does not exist", () => {
    const missingFileError = new Error("File not found");
    missingFileError.code = "ENOENT";
    dotenvConfigSpy.mockReturnValue({ error: missingFileError });

    expect(loadEnvironment("production")).toBe("production");
    expect(process.env.NODE_ENV).toBe("production");
  });

  test("fails when a required development or UAT file does not exist", () => {
    const missingFileError = new Error("File not found");
    missingFileError.code = "ENOENT";
    dotenvConfigSpy.mockReturnValue({ error: missingFileError });

    expect(() => loadEnvironment("uat")).toThrow(
      "Could not load .env.uat. Create it from the matching example file.",
    );
  });
});
