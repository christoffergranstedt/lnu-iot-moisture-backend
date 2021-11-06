import { CustomError } from './CustomError'

/**
 * When no user is found
 *
 * @class RateLimitError
 */
export class NoUserFound extends CustomError {
	constructor () {
		super('User is not found', 404)
	}
}
