import axios from 'axios'

/**
 * To notify a user with an event
 *
 * @param {object} user - A user that should hold a telegram id.
 * @param {string} event - A string with an event.
 */
export const notifyUserByTelegram = async (telegramId: string, event: string): Promise<void> => {
	const { TELEGRAM_BOT } = process.env
	if (!telegramId) throw new Error('User has not set up telegram ID')
	await axios({
		url: `https://api.telegram.org/bot${TELEGRAM_BOT}/sendMessage`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		data: {
			chat_id: telegramId,
			text: event,
			parse_mode: 'HTML'
		}
	})
}
