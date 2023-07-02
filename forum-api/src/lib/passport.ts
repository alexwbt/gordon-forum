import passport from "passport";
import KeycloakBearerStrategy from "passport-keycloak-bearer";
import env from "../env";
import logger from "./logger";

passport.use(new KeycloakBearerStrategy({
    ...env.keycloak,
    customLogger: logger
}, (jwtPayload, done) => {
    logger.info(jwtPayload)
    return done(null, jwtPayload)
}))

const keycloak_pass = passport.authenticate("keycloak", { session: false })
export default keycloak_pass
