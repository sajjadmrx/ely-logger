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
    environment: process.env.NODE_ENV
  })
  msg.map(m => {
    if (level === 'ERROR') {
      if (typeof m === 'string') {
        Sentry.captureMessage(m, level.toLowerCase() as any)
      } else {
        Sentry.setExtra('error', m)
        if (m && m.isAxiosError) {
          const fullUrl = m.config.baseURL + m.config.url
          Sentry.setExtra('axios', {
            method: m.config.method,
            url: fullUrl,
            status: m.response?.status,
            statusText: m.response?.statusText,
            response: m.response?.data || m.response?.statusText
          })
        }
        Sentry.captureException(m)

        // clean up
        Sentry.setExtra('error', undefined)
        Sentry.setExtra('axios', undefined)
      }
    } else {
      Sentry.captureMessage(JSON.stringify(m), level.toLowerCase() as any)
    }
  })
}
export default SentryEmitter
