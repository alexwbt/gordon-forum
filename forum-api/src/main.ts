import express from "express";
import testRouter from "./router/TestRouter";
import bodyParser from "body-parser";
import userRouter from "./router/UserRouter";

const app = express();

app.use(bodyParser.json());

app.use("/test", testRouter);
app.use("/user", userRouter);

app.listen(3000, () => {
    console.log("running on 3000");
});
