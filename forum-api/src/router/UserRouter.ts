import { PrismaClient } from '@prisma/client';
import express from "express";
import { useRequestHandler } from '../lib/router';
import { CreateUserRequest } from '../schema/user';

const prisma = new PrismaClient()

const userRouter = express.Router()

useRequestHandler({
    router: userRouter,
    method: "post",
    bodySchema: CreateUserRequest,
    requestHandler: ({ body, query, params }) => {
        return {
            status: 200,
            body: "test"
        }
    }
})

export default userRouter