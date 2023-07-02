import bodyParser from "body-parser";
import express from "express";
import userRouter from "./router/userRouter";

const app = express();

app.use(bodyParser.json());

app.use("/user", userRouter);

app.listen(3000, () => {
    console.log("running on 3000");
});
