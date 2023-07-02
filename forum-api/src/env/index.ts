import { getEnvStringRequired } from "../lib/env";

const env = {
    keycloak: {
        realm: getEnvStringRequired("KEYCLOAK_REALM"),
        url: getEnvStringRequired("KEYCLOAK_URL"),
    }
} as const

export default env
