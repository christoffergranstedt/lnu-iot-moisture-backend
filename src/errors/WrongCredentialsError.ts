import { CustomError } from './CustomError.js'

/**
 * When a credentials are provided when authenticating
 *
 * @class WrongCredentialsError
 */
export class WrongCredentialsError extends CustomError {
	constructor () {
		super('Wrong credentials, please try again', 401)
	}
}
