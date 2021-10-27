import axios from 'axios'

import { UserDoc } from '../models/User'

/**
 * To notify a user with an event
 *
 * @param {object} user - A user that should hold a telegram id.
 * @param {string} event - A string with an event.
 */
export const notifyUserByTelegram = async (user: UserDoc, event): Promise<void> => {
	const { TELEGRAM_BOT } = process.env
	if (!user.telegramId) throw new Error('User has not set up telegram ID')
	await axios({
		url: `https://api.telegram.org/bot${TELEGRAM_BOT}/sendMessage`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		data: {
			chat_id: user.telegramId,
			text: event,
			parse_mode: 'HTML'
		}
	})
}
