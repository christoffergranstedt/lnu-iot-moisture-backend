import { ErrorResponse } from '../types/ErrorResponse'


/**
 * A class that acts a base class for my custom errors and implements a certain structure
 *
 * @class CustomError
 */
export class CustomError extends Error {
	private statusCode: number
	private messages: ErrorResponse[]

	constructor (description: string, statusCode: number) {
		super(description)
		this.statusCode = statusCode
	}

	/**
 	* Returns an array of object with errors
 	*
 	* @returns {object} - Returns an array of object with errors
 	*/
	public getErrors (): ErrorResponse[] {
		if (this.messages) {
			return this.messages
		} else {
			return [{ message: this.message }]
		}
	}

		/**
 	* Set the error messages
 	*
 	* @param {messages} - An array of ErrorResponses
 	*/
	public setErrorMessages (messages: ErrorResponse[]): void {
		this.messages = messages;
	}

	/**
 	* Returns the status code
 	*
 	* @returns {object} - Returns status code for the error
 	*/
	getStatusCode (): number {
		return this.statusCode
	}
}
