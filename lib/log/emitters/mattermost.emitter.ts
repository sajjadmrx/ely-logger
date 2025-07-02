import { PACKAGE_NAME, consoleColors } from '../../config'
import { Options } from '../interfaces/option.interface'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'

function serializeMessage(...messages: any[]) {
	const payload = []
	for (const msg of messages) {
		if (msg.stack) {
			payload.push(`\`\`\`\n${msg.stack}\n\`\`\``)
		} else if (typeof msg === 'object') {
			payload.push(`\`\`\`json\n${JSON.stringify(msg, null, 2)}\n\`\`\``)
		} else if (typeof msg === 'number') {
			payload.push(`\`${msg}\``)
		} else {
			payload.push(msg.toString())
		}
	}
	return payload.join('\n')
}

const mattermostEmitter = (options: Options, level: LogLevel, context: string, ...msg: any[]) => {
	const flags = {
		ERROR: ':red_circle:',
		WARN: ':warning:',
		INFO: ':information_source:',
	}

	const color = {
		ERROR: '#FF0000',
		WARN: '#FFAA00',
		INFO: '#00FF00',
	}[level]

	if (!options) {
		return console.error(
			`[${PACKAGE_NAME}] ${consoleColors.red}No options provided!${consoleColors.reset}`
		)
	}

	if (!options.mattermost) {
		return console.error(
			`[${PACKAGE_NAME}] ${consoleColors.red}No Mattermost configuration provided!${consoleColors.reset}`
		)
	}

	const { token, server, channelId } = options.mattermost

	if (!token || !server || !channelId) {
		return console.error(
			`[${PACKAGE_NAME}] ${consoleColors.red}Incomplete Mattermost configuration! token, server, and channelId are required.${consoleColors.reset}`
		)
	}

	// Create the message with Mattermost markdown formatting
	const messageText = `${flags[level] || ':question:'} **[${context}]** - ${level}\n\n${serializeMessage(...msg)}`

	// Mattermost API payload
	const body = {
		channel_id: channelId,
		message: messageText,
		props: {
			attachments: [
				{
					color: color,
					title: `${level} - ${context}`,
					text: serializeMessage(...msg),
					footer: 'ely-logger',
					ts: Math.floor(Date.now() / 1000),
				},
			],
		},
	}

	const url = `${server.replace(/\/$/, '')}/api/v4/posts`

	fetch(url, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	}).catch((error) => {
		console.error(
			`[${PACKAGE_NAME}] ${consoleColors.red}Failed to send Mattermost message${consoleColors.reset}`,
			error
		)
	})
}

export default mattermostEmitter
