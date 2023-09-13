// import { PrismaClient } from "@prisma/client";
// import passport from "passport";
// // import KeycloakBearerStrategy from "passport-keycloak-bearer";
// // import env from "../env";
// // import logger from "./logger";
// // import { Strategy as LocalStrategy } from "passport-local"
// // import { PrismaClient } from "@prisma/client";

// // passport.use(new KeycloakBearerStrategy({
// //     ...env.keycloak,
// //     customLogger: logger
// // }, (jwtPayload, done) => {
// //     logger.info(jwtPayload)
// //     return done(null, jwtPayload)
// // }))

// // export const keycloakAuth = passport.authenticate("keycloak", { session: false })


// // // Local JWT Auth

// // const prisma = new PrismaClient()
// // var JwtStrategy = require('passport-jwt').Strategy,
// //     ExtractJwt = require('passport-jwt').ExtractJwt;
// // var opts = {}
// // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// // opts.secretOrKey = 'secret';
// // opts.issuer = 'accounts.examplesoft.com';
// // opts.audience = 'yoursite.net';

// // const jwtAuth = new JwtStrategy(opts, function(jwt_payload, done) {
// //     User.findOne({id: jwt_payload.sub}, function(err, user) {
// //         if (err) {
// //             return done(err, false);
// //         }
// //         if (user) {
// //             return done(null, user);
// //         } else {
// //             return done(null, false);
// //             // or you could create a new account
// //         }
// //     });
// // })


// // google strategy
// // export const googleAuthStrategy = passport.authenticate('google', { session: false, failureRedirect: '/auth/google' });

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

passport.use(new GoogleStrategy({
    clientID: "123758332840-374nfer3cjsj7v8m7vjcou3o5kp8vkum.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(11111, accessToken, refreshToken)
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
        cb(null, profile);
    }
));

// import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt"
// // const prisma = new PrismaClient()

// export const googleAuthStrategy = passport.authenticate('jwt', { session: false });

// const opts: StrategyOptions = {
//   jwtFromRequest: ExtractJwt.,
//   secretOrKey: 'secret',
//   issuer: 'https://accounts.google.com/o/oauth2/auth',
//   // audience: 'yoursite.net',
// }

// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//     console.log(11111, jwt_payload)
//     done(null)
// }));

import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import passportJWT from "passport-jwt";
import { getEnvString } from "./env";

export type ValueOf<T> = T[keyof T];

export const generateRandomSecret = (length: number): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=~"
    return Array(length).fill(0).reduce(s => s + chars[Math.floor(Math.random() * chars.length)], "");
};

const JWT_ACCESS_SECRET = getEnvString("JWT_ACCESS_SECRET", generateRandomSecret(64));
const JWT_REFRESH_SECRET = getEnvString("JWT_REFRESH_SECRET", generateRandomSecret(64));
const JWT_EMAIL_SECRET = getEnvString("JWT_EMAIL_SECRET", generateRandomSecret(64));

export const TokenRole = {
    OWNER: 'owner',
    MANAGER: 'manager'
} as const;
export type Role = ValueOf<typeof TokenRole>;

export const TokenType = {
    ACCESS: 'access',
    REFRESH: 'refresh',
    EMAIL: 'email'
} as const;

export type AccessToken = {
    type: typeof TokenType.ACCESS;
    id: string;
    role: Role;
    // access: Access | null;
    // shops: string[];
};
export type RefreshToken = {
    type: typeof TokenType.REFRESH;
    id: string;
    role: Role;
    refreshId: string;
}
export type EmailToken = {
    type: typeof TokenType.EMAIL;
    email: string;
};
export type Token = AccessToken | RefreshToken | EmailToken;

passport.use('jwt-header', new passportJWT.Strategy({
    secretOrKey: JWT_ACCESS_SECRET,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (payload: { id: Number }, done) => {
    done(null, payload);
}));

passport.use('jwt-cookie', new passportJWT.Strategy({
    secretOrKey: JWT_REFRESH_SECRET,
    jwtFromRequest: req => req && req.signedCookies && req.signedCookies["refresh_token"]
}, async (payload: { id: Number }, done) => {
    done(null, payload);
}));

const signToken = (payload: any, secret: string, options?: SignOptions): Promise<string> => {
    return new Promise((resolve, reject) => jwt.sign(
        payload, secret, { ...options },
        (err, encoded) => {
            if (err || !encoded) reject(err);
            else resolve(encoded);
        }
    ));
};

const parseToken = <T>(token: string, secret: string, options?: VerifyOptions): Promise<T> => {
    return new Promise((resolve, reject) => jwt.verify(
        token, secret, { ...options },
        (err, decoded: any) => {
            if (err || !decoded) reject(err);
            else resolve(decoded);
        }
    ));
};

export const signAccessToken = (id: string, role: Role) => {
    const payload: AccessToken = { type: TokenType.ACCESS, id, role };
    return signToken(payload, JWT_ACCESS_SECRET, { expiresIn: '10m' });
};
export const signRefreshToken = (id: string, role: Role, refreshId: string) => {
    const payload: RefreshToken = { type: TokenType.REFRESH, id, role, refreshId };
    return signToken(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
};
export const signEmailToken = (email: string) => {
    const payload: EmailToken = { type: TokenType.EMAIL, email };
    return signToken(payload, JWT_EMAIL_SECRET, { expiresIn: '3m' });
};
export const parseEmailToken = (token: string) => parseToken<EmailToken>(token, JWT_EMAIL_SECRET);

export default async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(['jwt-header', 'jwt-cookie'], { session: false }, (err: any, user: any, info: any) => {
        if (!user) {
            res.status(401).send({message:"gordon"});
            return;
        }
        console.log(user)
        req.user = user;
        next();
    })(req, res, next);
};

