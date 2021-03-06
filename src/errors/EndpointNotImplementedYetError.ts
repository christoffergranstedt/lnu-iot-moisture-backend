import { CustomError } from './CustomError'

/**
 * A class for when user provides wrong input
 *
 * @class InputValidationError
 */
export class EndpointNotImplementedYetError extends CustomError {
	constructor () {
		super('Endpoint is not implemented yet', 501)
	}
}
