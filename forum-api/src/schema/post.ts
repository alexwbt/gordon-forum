import joi from 'joi'
import * as SchemaType from '../types/schema'

// title
// body
// published
// author
// authorId

export const CreatePostRequest = joi.object({
    title: joi.string().required(),
    body: joi.string().required(),
    published: joi.boolean().default(false),
})

export const GetPostRequest = joi.object({
    id: joi.string().required()
})

export const UpdatePostRequest = joi.object({
    id: joi.number().required(),
    name: joi.string(),
    email: joi.string(),
})

export const DeletePostRequest = joi.object({
    id: joi.number().required()
})
