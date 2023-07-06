import joi from 'joi'
import * as SchemaType from '../types/schema'

export const LoginRequest = joi.object({
    name: joi.string().required(),
    password: joi.string().required(),
})
