import { EndpointNotImplementedYetError } from '../errors/EndpointNotImplementedYetError.js'
import { Thing } from '../models/Thing.js'

/**
 * To get all properties for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getProperties = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To get a speicific event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getProperty = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To get all values for a spcecific property for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getPropertyValues = async (req, res, next) => {
	const { propertyName, thingId } = req.params
	const values = await Thing.getPropertyValues(thingId, propertyName)
	res.locals.data = {
		message: 'Values for the property, there may be more values, see pagination',
		values: values
	}
	res.status(200)
	return next()
}

/**
 * To create a new property for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const createProperty = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To update a property for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const updateProperty = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To delete a property for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const deleteProperty = async (req, res, next) => {
	EndpointNotImplementedYetError()
}
