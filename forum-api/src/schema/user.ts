import joi from 'joi'
import * as SchemaType from '../types/schema'

export const CreateUserRequest = joi.object<SchemaType.CreateUserRequest>({
    name: joi.string().required(),
    email: joi.string().required(),
})
