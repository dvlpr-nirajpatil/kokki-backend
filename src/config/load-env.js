const path = require("path");
const dotenv = require("dotenv");

const ENVIRONMENT_FILES = Object.freeze({
  development: ".env.development",
  uat: ".env.uat",
  production: ".env.production",
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
    "development";
  const isTest =
    requestedEnvironment === undefined &&
    cliEnvironment === undefined &&
    vercelEnvironment === undefined &&
    process.env.NODE_ENV === "test";

  if (!VALID_ENVIRONMENTS.includes(environment)) {
    throw new Error(
      `Environment must be one of: ${VALID_ENVIRONMENTS.join(", ")}`,
    );
  }

  if (!vercelEnvironment) {
    const projectRoot = path.resolve(__dirname, "../..");
    const environmentFile = path.join(
      projectRoot,
      ENVIRONMENT_FILES[environment],
    );
    const result = dotenv.config({
      path: environmentFile,
      override: true,
      quiet: true,
    });

    if (result.error) {
      throw new Error(
        `Could not load ${path.basename(environmentFile)}. Create it from the matching example file.`,
        { cause: result.error },
      );
    }
  }

  // The command controls the runtime mode; values inside the file cannot.
  process.env.NODE_ENV = isTest ? "test" : environment;

  return environment;
}

module.exports = {
  ENVIRONMENT_FILES,
  VALID_ENVIRONMENTS,
  getCliEnvironment,
  getVercelEnvironment,
  loadEnvironment,
};
