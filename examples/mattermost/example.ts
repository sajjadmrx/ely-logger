import { Emitter, LogService } from '../../lib/index'

// Example 1: Basic Mattermost logging
const logger = new LogService('MattermostExample', {
	mattermost: {
		token: 'xxx-yyy-zzz',
		server: 'https://xx.server.net',
		channelId: 'xxxaaaadasdsada', // Replace with your actual channel ID
	},
})

// Log different types of messages
logger.log('This is an info message from ely-logger').into(Emitter.MATTERMOST)
logger.warn('This is a warning message').into(Emitter.MATTERMOST)
logger.error('This is an error message').into(Emitter.MATTERMOST)

// Log with objects
logger
	.log('User data:', { id: 1, name: 'John Doe', email: 'john@example.com' })
	.into(Emitter.MATTERMOST)

// Log with errors
try {
	throw new Error('Something went wrong!')
} catch (error) {
	logger.error('Caught an error:', error).into(Emitter.MATTERMOST)
}
