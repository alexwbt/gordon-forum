import bodyParser from "body-parser";
import express from "express";
import { 
    userRouter,
    postRouter,
} from "./router";
import authRouter from "./router/authRouter";
import { generateRandomSecret } from "./lib/passport";
import cookieParser from "cookie-parser";

const app = express();

app.use(bodyParser.json());

app.use(cookieParser(generateRandomSecret(64)));

app.use("/auth", authRouter)
app.use("/user", userRouter);
app.use("/post", postRouter);

app.listen(8000, () => {
    console.log("running on 8000");
});
