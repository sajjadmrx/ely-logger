import { Options } from './option.interface'

/**
 * @interface OptionsWithContext
 * Represents a set of options for configuring the logger service.
 * @property discordWebhook - The Discord webhook URL.
 * @property telegram - The options for the Telegram bot.
 * @property mattermost - The options for the Mattermost bot.
 * @property context - The context for the logger service.
 *
 * @example
 * const options: Options = {
 * discordWebhook: 'https://discord.com/api/webhooks/...',
 * telegram: {
 * token: '...',
 * chatId: '123456789'
 * },
 * mattermost: {
 * token: 'xxxxx-yyy-zzz',
 * server: 'https://xxx.zzz.com',
 * channelId: 'channel_id'
 * },
 * context: 'MyContext'
 * }
 */
export interface OptionsWithContext extends Omit<Options, 'isGlobal'> {
	context: string
}
