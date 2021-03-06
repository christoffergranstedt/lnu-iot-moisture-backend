import cron from 'node-cron'
import { Events } from '../constants/Events'
import { PROPERTY } from '../constants/Property'
import { NoResourceIdError } from '../errors'
import { Thing } from '../models/Thing'
import { notifyUserByTelegram } from './telegram'

// this is a cron job that will run every three hours and generate a random value.
// This is only since the thing is not active right now
export const publishMoistureLevelLoop = cron.schedule('0 0 */12 * * *', () =>  {
  publishRandomValue()
})

const publishRandomValue = async () => {
  const thingId = '74242ee9-7657-40fa-8019-1d258cf0ae01'
  const thing = await Thing.getThing(thingId)
  if (!thing) throw new NoResourceIdError(thingId)

  const valueInProcent = Math.floor(Math.random() * (90 - 20 + 1)) + 20; // Random number between 20 and 90
  await Thing.addPropertyValue(thingId, PROPERTY.Moisture, valueInProcent)

  const lowAlertValue = await Thing.getAlertValue(thingId, Events.LowMoisture)
  const highAlertValue = await Thing.getAlertValue(thingId, Events.HighMoisture)

  if (valueInProcent < lowAlertValue) {
    const users = await Thing.getEventSubscribers(thingId, Events.LowMoisture)
    const event = `Low moisture level in thing, ${thingId}. Moisture value is : ${valueInProcent.toFixed(2)}%`
    for (let i = 0; i < users.length; i++) {
      const telegramId = (users[i].telegramId) as string
      if (users[i].telegramId) await notifyUserByTelegram(telegramId, event)
    }
  }

  if (valueInProcent > highAlertValue) {
    const users = await Thing.getEventSubscribers(thingId, Events.HighMoisture)
    const event = `High moisture level in thing, ${thingId}. Moisture value is : ${valueInProcent.toFixed(2)}%`
    for (let i = 0; i < users.length; i++) {
      const telegramId = (users[i].telegramId) as string
      if (users[i].telegramId) await notifyUserByTelegram(telegramId, event)
    }
  }
}