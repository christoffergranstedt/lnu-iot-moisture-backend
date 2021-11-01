import { CustomError } from './CustomError'

/**
 * When ta userame already is taken
 *
 * @class UsernameIsTakenError
 */
export class UsernameIsTakenError extends CustomError {
	constructor () {
		super('Username is already taken, please test another', 400)
	}
}
