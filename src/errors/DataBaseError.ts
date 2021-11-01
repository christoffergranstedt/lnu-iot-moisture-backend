import { CustomError } from './CustomError'

/**
 * A class for genereal database connection or query errors
 *
 * @class DataBaseError
 */
export class DataBaseError extends CustomError {
	constructor () {
		super('Internal database connection error', 500)
	}
}
