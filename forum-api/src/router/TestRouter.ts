import express from "express";

const testRouter = express.Router();

testRouter.get("/log", (req, res) => {
    res.status(200).send("hello world");
})

export default testRouter;

