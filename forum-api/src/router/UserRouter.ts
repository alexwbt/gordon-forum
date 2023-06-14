import express, { Request, Response } from "express";
import { PrismaClient, User } from '@prisma/client'

type CreateUserReq = {
    name: string
    email: string
}
type CreateUserResp = User

type DeleteUserReq = {
    userId: number
}
type DeleteUserResp = User

const prisma = new PrismaClient()

const userRouter = express.Router()

userRouter.post<string, any, any, CreateUserReq>('/add', async (req, res) => {
    const { name, email } = req.body

    const user: CreateUserResp = await prisma.user.create({ data: { name, email }})
    res.status(200).send(user)
})

userRouter.delete('/delete', async (req: Request<{}, DeleteUserResp, DeleteUserReq>, res) => {
    const resp: User = await prisma.user.delete({
        where: {
            id: req.body.userId
        }
    })
    res.status(200).send(resp)
})

export default userRouter