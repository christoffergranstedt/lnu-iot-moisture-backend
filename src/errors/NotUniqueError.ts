import { CustomError } from './CustomError.js'

/**
 * When a entry of same already exist in database
 *
 * @class NotUniqueError
 */
export class NotUniqueError extends CustomError {
	constructor (notUniqueValue: string) {
		super(`Following entry already exist and needs to change: ${notUniqueValue}`, 400)
	}
}
