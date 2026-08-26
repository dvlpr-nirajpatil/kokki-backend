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
  const fileEnvironment = requestedEnvironment || cliEnvironment;

  if (!fileEnvironment) {
    const environment =
      vercelEnvironment || process.env.NODE_ENV || "development";

    if (environment !== "test" && !VALID_ENVIRONMENTS.includes(environment)) {
      throw new Error(
        `Environment must be one of: ${VALID_ENVIRONMENTS.join(", ")}`,
      );
    }

    process.env.NODE_ENV = environment;
    return environment;
  }

  if (!VALID_ENVIRONMENTS.includes(fileEnvironment)) {
    throw new Error(
      `Environment must be one of: ${VALID_ENVIRONMENTS.join(", ")}`,
    );
  }

  const projectRoot = path.resolve(__dirname, "../..");
  const environmentFile = path.join(
    projectRoot,
    ENVIRONMENT_FILES[fileEnvironment],
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

  // The command controls the runtime mode; values inside the file cannot.
  process.env.NODE_ENV = fileEnvironment;

  return fileEnvironment;
}

module.exports = {
  ENVIRONMENT_FILES,
  VALID_ENVIRONMENTS,
  getCliEnvironment,
  getVercelEnvironment,
  loadEnvironment,
};
