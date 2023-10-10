export const CONSTANTS = {
  GLOBAL_PREFIX: "api",
};

export const SWAGGER_CONSTANTS = {
  TITLE: "API",
  DESCRIPTION: "WPCAS Survey Service API description",
  VERSION: "1.0",
  PATH: "api/docs",
  SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY: "api-config-key",
  SWAGGER_AUTH_SECURITY_SCHEMA_JWT: "jwt",
};

export enum SWAGGER_TAGS {
  DEFAULT = "default",
  SURVEYCONFIG = "survey-config",
  SURVEYPARAMETER = "survey-parameter"
}
