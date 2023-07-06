import bodyParser from "body-parser";
import express from "express";
import { 
    userRouter,
    postRouter,
} from "./router";

const app = express();

app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/post", postRouter);

app.listen(3000, () => {
    console.log("running on 3000");
});
