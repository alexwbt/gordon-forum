import { PrismaClient } from '@prisma/client';
import express from "express";
import { useRequestHandler } from '../lib/router';
import { CreateUserRequest, DeleteUserRequest, GetUserRequest, UpdateUserRequest } from '../schema/user';
import { RequestHandlerError } from '../lib/error';

const prisma = {} as any;

const userRouter = express.Router()

// Add User
useRequestHandler({
    router: userRouter,
    method: "post",
    bodySchema: CreateUserRequest,
    requestHandler: async ({ body, query, params }) => {
        const { name, email } = body
        const user = await prisma.user.create({
            data: { name, email }
        })
        return {
            status: 200,
            body: {...user}
        }
    }
})

// Get All Users
useRequestHandler({
    router: userRouter,
    method: "get",
    path: '/all',
    requestHandler: async () => {
        const users = await prisma.user.findMany()
        return {
            status: 200,
            body: {result: users}
        }
    }
})

// Get User by Id
useRequestHandler({
    router: userRouter,
    method: "get",
    path: '/:id',
    paramsSchema: GetUserRequest,
    requestHandler: async ({ body, query, params }) => {
        const { id } = params
        const user = await prisma.user.findFirst({
            where: { id: +id }
        })
        return {
            status: 200,
            body: {...user}
        }
    }
})

// Update User (partial)
useRequestHandler({
    router: userRouter,
    method: "patch",
    bodySchema: UpdateUserRequest,
    requestHandler: async ({ body, query, params }) => {
        const { id, name, email } = body
        const user = await prisma.user.update({
            where: { id },
            data: {
                name,
                email
            }
        })
        return {
            status: 200,
            body: {...user}
        }
    }
})

// Delete User
useRequestHandler({
    router: userRouter,
    method: "delete",
    bodySchema: DeleteUserRequest,
    requestHandler: async ({ body, query, params }) => {
        const { id } = body
        const user = await prisma.user.delete({
            where: { id },
        })
        if (user) {
            return {
                status: 200,
                body: {...user}
            }
        } else {
            // return {
            //     status: 400,
            //     body: {
            //         message: `No user found (id ${id}).`
            //     }
            // }
            throw new RequestHandlerError(400, `No user found (id ${id}).`)
        }
    }
})

export default userRouter