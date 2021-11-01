import { Response } from 'express'

export interface ResponseData extends Response {
  user: {
    id: string
  }
  message: string
}