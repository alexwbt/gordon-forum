import joi from 'joi'
import * as SchemaType from '../types/schema'

export const CreateUserRequest = joi.object<SchemaType.CreateUserRequest>({
    name: joi.string().required(),
    email: joi.string().required(),
})

export const GetUserRequest = joi.object<SchemaType.GetUserRequest>({
    id: joi.string().required()
})

export const UpdateUserRequest = joi.object<SchemaType.UpdateUserRequest>({
    id: joi.number().required(),
    name: joi.string(),
    email: joi.string(),
})

export const DeleteUserRequest = joi.object<SchemaType.DeleteUserRequest>({
    id: joi.number().required()
})
