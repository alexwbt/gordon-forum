import passport from "passport";
import KeycloakBearerStrategy from "passport-keycloak-bearer";
import env from "../env";
import logger from "./logger";
import { Strategy as LocalStrategy } from "passport-local"
import { PrismaClient } from "@prisma/client";

passport.use(new KeycloakBearerStrategy({
    ...env.keycloak,
    customLogger: logger
}, (jwtPayload, done) => {
    logger.info(jwtPayload)
    return done(null, jwtPayload)
}))

export const keycloakAuth = passport.authenticate("keycloak", { session: false })


// Local JWT Auth

const prisma = new PrismaClient()
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';

const jwtAuth = new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
})

