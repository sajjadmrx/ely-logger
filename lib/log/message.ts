import consoleEmitter from './emitters/console.emitter'
import discordEmitter from './emitters/discord.emitter'
import fileEmitter from './emitters/file.emitter'
import mattermostEmitter from './emitters/mattermost.emitter'
import SentryEmitter from './emitters/sentry.emitter'
import telegramEmitter from './emitters/telegram.emitter'
import { Options } from './interfaces/option.interface'
import { Emitter } from './log.service'
type LogLevel = 'WARN' | 'INFO' | 'ERROR'

export class Message {
	private level: LogLevel = 'INFO'
	private msg: any[] = []
	private _context: string
	constructor(
		private options: Omit<Options, 'isGlobal'>,
		...msg: any[]
	) {
		this.msg = msg
	}

	context(context: string) {
		this._context = context
		return this
	}

	is(level: LogLevel) {
		this.level = level
		return this
	}

	into(emitter: Emitter) {
		const emitters: Record<Emitter, any> = {
			CONSOLE: consoleEmitter,
			DISCORD: discordEmitter,
			TELEGRAM: telegramEmitter,
			FILE: fileEmitter,
			SENTRY: SentryEmitter,
			MATTERMOST: mattermostEmitter,
		}

		const emitterFunc = emitters[emitter]
		if (!emitterFunc) {
			throw new Error('Invalid emitter')
		}
		if (emitter === Emitter.CONSOLE) {
			emitterFunc(this.level, this._context, ...this.msg)
		} else {
			emitterFunc(this.options, this.level, this._context, ...this.msg)
		}

		return this
	}
}
