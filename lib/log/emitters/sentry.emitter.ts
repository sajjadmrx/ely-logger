import * as Sentry from '@sentry/node'
import { Options } from '../interfaces/option.interface'
import consoleEmitter from './console.emitter'
type LogLevel = 'WARN' | 'INFO' | 'ERROR'

const SentryEmitter = (options: Options, level: LogLevel, context: string, ...msg: any[]) => {
	if (!options.sentry || !options.sentry.dsn) {
		consoleEmitter('ERROR', 'ely-logger', 'Sentry options are not provided')
		return
	}
	Sentry.init({
		dsn: options.sentry.dsn,
		integrations: options.sentry.integrations || [],
		tracesSampleRate: options.sentry.tracesSampleRate,
		environment: process.env.NODE_ENV,
	})

	msg.map((m) => {
		Sentry.withScope((scope) => {
			if (m.sentry) {
				const { contexts, extra, tags, user } = m.sentry as SentryPayload
				if (user) {
					scope.setUser({
						email: user.email,
						geo: user.geo,
						id: user.id,
						ip_address: user.ip_address,
						username: user.username,
					})
				}

				if (contexts) {
					Object.keys(contexts).map((key) => {
						scope.setContext(key, contexts[key])
					})
				}

				if (extra) {
					Object.keys(extra).map((key) => {
						scope.setExtra(key, extra[key])
					})
				}

				if (tags) {
					Object.keys(tags).map((key) => {
						scope.setTag(key, tags[key])
					})
				}
			}
			if (context) {
				scope.setContext('context', { name: context })
			}

			if (level === 'ERROR') {
				scope.setExtra('error', m)
				if (m && m.isAxiosError) {
					const fullUrl = m.config.baseURL + m.config.url
					scope.setExtra('axios', {
						method: m.config.method,
						url: fullUrl,
						status: m.response?.status,
						statusText: m.response?.statusText,
						response: m.response?.data || m.response?.statusText,
					})
				}

				Reflect.deleteProperty(m, 'sentry')
				if (m.isContent) {
					scope.captureMessage(m.message, 'error')
				} else {
					scope.captureException(m)
				}
			} else {
				const sentryLevels = {
					WARN: 'warning',
					INFO: 'log',
				}
				if (m.isContent) {
					scope.captureMessage(m.message, sentryLevels[level] as any)
				} else {
					scope.captureMessage(JSON.stringify(m), sentryLevels[level] as any)
				}
			}
		})
	})
}
export default SentryEmitter

export interface SentryPayload {
	contentOrError: string | Error
	contexts?: Record<string, any>
	user?: {
		[key: string]: any
		id?: string | number
		ip_address?: string
		email?: string
		username?: string
		geo?: {
			country_code?: string
			region?: string
			city?: string
		}
	}
	extra?: Record<string, any>
	tags?: Record<string, any>
}

/**
 * Builds a Sentry payload by attaching Sentry-specific metadata to the provided content or error.
 *
 * @param options - The options for building the Sentry payload.
 * @param options.contentOrError - The content or error to which the Sentry metadata will be attached.
 * @param options.contexts - Additional context data to include in the Sentry payload.
 * @param options.user - User information to include in the Sentry payload.
 * @param options.extra - Extra information to include in the Sentry payload.
 * @param options.tags - Tags to include in the Sentry payload.
 * @returns The content or error with the attached Sentry metadata.
 */
export function buildSentryPayload(options: SentryPayload) {
	if (typeof options.contentOrError === 'string') {
		const myString = new String(options.contentOrError)
		Reflect.defineProperty(myString, 'sentry', {
			value: {
				contexts: options.contexts,
				user: options.user,
				extra: options.extra,
				tags: options.tags,
			},
			writable: false,
		})

		return myString
	}

	if (typeof options.contentOrError === 'object') {
		Reflect.defineProperty(options.contentOrError, 'sentry', {
			value: {
				contexts: options.contexts,
				user: options.user,
				extra: options.extra,
				tags: options.tags,
			},
			writable: false,
		})
	}

	return options.contentOrError
}
