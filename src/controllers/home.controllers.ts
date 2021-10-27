/**
 * Home of the REST API. Return just information about the API.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Information about the REST API
 */
export const startEndpoint = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		res.locals.data = {
			message: 'Welcome to the REST API for Smart Home',
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}`,
					type: 'GET'
				}
			]
		}

		res.status(200)
		return next()
	} catch (error) {
		next(error)
	}
}
