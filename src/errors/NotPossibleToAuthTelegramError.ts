import { CustomError } from './CustomError'

/**
 * When the provided resources is not found
 *
 * @class NoResourceIdError
 */
export class NotPossibleToAuthTelegramError extends CustomError {
	constructor () {
		super('It was not possible to authenticate your userid, possibly becuase of a misspel. Please try again', 400)
	}
}
