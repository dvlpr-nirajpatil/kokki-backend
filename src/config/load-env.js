const path = require("path");
const dotenv = require("dotenv");

const ENVIRONMENT_FILES = Object.freeze({
  development: ".env.development",
  uat: ".env.uat",
  production: ".env",
});

const VALID_ENVIRONMENTS = Object.freeze(Object.keys(ENVIRONMENT_FILES));

const VERCEL_ENVIRONMENTS = Object.freeze({
  development: "development",
  preview: "uat",
  uat: "uat",
  production: "production",
});

function getCliEnvironment() {
  const inlineEnvironment = process.argv.find((argument) =>
    argument.startsWith("--env="),
  );

  if (inlineEnvironment) return inlineEnvironment.slice("--env=".length);

  const environmentFlagIndex = process.argv.findIndex(
    (argument) => argument === "--env" || argument === "-e",
  );

  if (environmentFlagIndex >= 0) {
    return process.argv[environmentFlagIndex + 1];
  }

  return undefined;
}

function getVercelEnvironment(rawEnvironment = process.env) {
  const isVercel = Boolean(
    rawEnvironment.VERCEL ||
    rawEnvironment.VERCEL_ENV ||
    rawEnvironment.VERCEL_TARGET_ENV,
  );

  if (!isVercel) return undefined;

  const target = (
    rawEnvironment.VERCEL_TARGET_ENV ||
    rawEnvironment.VERCEL_ENV ||
    "production"
  ).toLowerCase();

  const environment = VERCEL_ENVIRONMENTS[target];

  if (!environment) {
    throw new Error(`Unsupported Vercel environment: ${target}`);
  }

  return environment;
}

function loadEnvironment(requestedEnvironment) {
  const cliEnvironment = getCliEnvironment();
  const vercelEnvironment = getVercelEnvironment();
  const environment =
    requestedEnvironment ||
    cliEnvironment ||
    vercelEnvironment ||
    process.env.NODE_ENV ||
    "development";

  if (environment === "test") {
    process.env.NODE_ENV = environment;
    return environment;
  }

  if (!VALID_ENVIRONMENTS.includes(environment)) {
    throw new Error(
      `Environment must be one of: ${VALID_ENVIRONMENTS.join(", ")}`,
    );
  }

  // Vercel injects configuration directly into process.env.
  if (!requestedEnvironment && !cliEnvironment && vercelEnvironment) {
    process.env.NODE_ENV = environment;
    return environment;
  }

  const projectRoot = path.resolve(__dirname, "../..");
  const environmentFile = path.join(
    projectRoot,
    ENVIRONMENT_FILES[environment],
  );
  const isProduction = environment === "production";
  const result = dotenv.config({
    path: environmentFile,
    // Docker/system-injected production values take precedence over .env.
    override: !isProduction,
    quiet: true,
  });

  if (result.error && !(isProduction && result.error.code === "ENOENT")) {
    throw new Error(
      `Could not load ${path.basename(environmentFile)}. Create it from the matching example file.`,
      { cause: result.error },
    );
  }

  // The command controls the runtime mode; values inside the file cannot.
  process.env.NODE_ENV = environment;

  return environment;
}

module.exports = {
  ENVIRONMENT_FILES,
  VALID_ENVIRONMENTS,
  getCliEnvironment,
  getVercelEnvironment,
  loadEnvironment,
};
