/**
 * @interface Options
 * Represents a set of options for configuring the logger service.
 * @property discordWebhook - The Discord webhook URL.
 * @property telegram - The options for the Telegram bot.
 * @property mattermost - The options for the Mattermost bot.
 * @property context - The context for the logger service.
 * @property isGlobal - Whether the module is global.
 * @example
 * const options: Options = {
 * discordWebhook: 'https://discord.com/api/webhooks/...',
 * telegram: {
 * token: '...',
 * chatId: '123456789'
 * },
 * mattermost: {
 * token: 'xxxx-yyyy-zzz',
 * server: 'https://xxx.yyy.com',
 * channelId: 'channel_id'
 * },
 * isGlobal: true,
 * }
 */

/**
 * Options for configuring the logger.
 */
export interface Options {
	/**
	 * The Discord webhook URL.
	 * @default undefined
	 * @example 'https://discord.com/api/webhooks/...'
	 */
	discordWebhook?: string

	/**
	 * Options for the Telegram bot.
	 * @property token - The token for the Telegram bot.
	 * @property chatId - The chat ID for the Telegram bot.
	 * @default undefined
	 * @example { token: '..', chatId: '123456789' }
	 */
	telegram?: {
		token: string
		chatId: string
	}

	/**
	 * Options for the Mattermost bot.
	 * @property token - The bot token for Mattermost.
	 * @property server - The Mattermost server URL.
	 * @property channelId - The channel ID to send messages to.
	 * @default undefined
	 */
	mattermost?: {
		token: string
		server: string
		channelId: string
	}

	/**
	 * Options for the file emitter.
	 * @property path - The path for the file or directory.
	 * @property includeDateInFilename - Whether to include the date in the filename. [when path is a directory]
	 * @property fileFormat - The format of the file. [txt | log]
	 * @property flags - The flags for writing to the file. [a | w | r | a+ | w+ | r+]
	 * @property messageFormat - The format of the message. [DATE | LEVEL | CONTEXT | MESSAGE]
	 * @default undefined
	 * @example { path: './logs', includeDateInFilename: true, fileFormat: 'log', messageFormat: 'DATE - LEVEL | CONTEXT | MESSAGE' }
	 */
	file?: {
		path: string // can be a file path or a directory path
		includeDateInFilename?: boolean
		fileFormat?: 'txt' | 'log'
		flags?: string // 'a' | 'w' | 'r' | 'a+' | 'w+' | 'r+'
		messageFormat?:
			| 'DATE | LEVEL | CONTEXT | MESSAGE'
			| 'DATE - LEVEL | CONTEXT | MESSAGE'
			| 'DATE | CONTEXT | MESSAGE'
			| 'DATE - CONTEXT | MESSAGE'
			| 'DATE | MESSAGE'
			| 'DATE - MESSAGE'
	}

	/**
	 * Options for Sentry integration.
	 * @property dsn - The Data Source Name for Sentry.
	 * @property integrations - An array of integrations for Sentry. [optional]
	 * @property tracesSampleRate - The sample rate for tracing.
	 * @property environment - The environment name.
	 */
	sentry?: {
		dsn: string
		integrations?: any[]
		tracesSampleRate: number
		environment: string
	}
}

/**
 * @interface NestOptions
 * Represents a set of options for configuring the logger service.
 * @property isGlobal - Whether the module is global.
 * @default false
 */
export interface NestOptions extends Options {
	/**
	 * Whether the module is global.
	 * @default false
	 */
	isGlobal?: boolean
}
