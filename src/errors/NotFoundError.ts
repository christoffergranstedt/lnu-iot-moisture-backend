import { CustomError } from './CustomError'

/**
 * When the provided resources is not found
 *
 * @class NoResourceIdError
 */
export class NotFoundError extends CustomError {
	constructor () {
		super('Route not found', 404)
	}
}
