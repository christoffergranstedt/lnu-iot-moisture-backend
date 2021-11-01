import { ErrorResponse } from '../types/ErrorResponse'
import { CustomError } from './CustomError'

/**
 * A class for when user provides wrong input
 *
 * @class InputValidationError
 */
export class InputValidationError extends CustomError {
	constructor (errorMessages: ErrorResponse[]) {
		super('User input is incorrect', 400)
		if (errorMessages) this.setErrorMessages(errorMessages)
	}
}
