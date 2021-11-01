import { CustomError } from './CustomError'

/**
 * When the provided resources does not exist
 *
 * @class NoResourceIdError
 */
export class NoResourceIdError extends CustomError {
	constructor (id: string) {
		super(`The resource of the id ${id} could not be found`, 404)
	}
}
