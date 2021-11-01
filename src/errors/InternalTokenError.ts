import { CustomError } from './CustomError'

/**
 * A class for when an error interanlly in handling the token
 *
 * @class InternalTokenError
 */
export class InternalTokenError extends CustomError {
	constructor () {
		super('Internal token error in server', 500)
	}
}
