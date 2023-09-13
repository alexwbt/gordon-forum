import express from "express"
import passport from "passport";
import { TokenRole, signAccessToken, signRefreshToken } from "../lib/passport";

const authRouter = express.Router();

authRouter.get('/google', passport.authenticate('google', {
    scope: ['profile'],
}));

authRouter.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/auth/google' }),
    async (req, res) => {
        const [accessToken, refreshToken] = await Promise.all([
            signAccessToken(
                "id-1",
                TokenRole.OWNER,
            ),
            signRefreshToken(
                "id-1",
                TokenRole.OWNER,
                ""
            )
        ]);


        res.cookie('refresh_token', refreshToken, {
            signed: true,
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 2592000000, // 30 days
            domain: "localhost:8000",
            secure: true
        });

        res.send({
            accessToken
        });
    }
)

export default authRouter;
