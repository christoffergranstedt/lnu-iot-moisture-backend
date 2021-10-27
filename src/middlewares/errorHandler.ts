import { ErrorRequestHandler, Request, Response, NextFunction } from "express"

import { CustomError } from '../errors/CustomError'

export const errorHandler: ErrorRequestHandler  = (err: Error, _req: Request, res: Response, next: NextFunction) => {

	if (err instanceof CustomError) {
		return res.status(err.getStatusCode()).send({ errors: err.getErrors() })
	}

	return res.status(500).send({
		errors: [{ message: 'Something went wrong in the server, please try again' }]
	})

  next(err)
}