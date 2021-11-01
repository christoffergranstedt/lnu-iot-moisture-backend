import { CustomError } from './CustomError'

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
