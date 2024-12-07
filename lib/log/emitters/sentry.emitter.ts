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
    if (typeof m === 'string') {
      Sentry.captureMessage(m, level.toLowerCase() as any)
    } else {
      Sentry.captureException(m)
    }
  })
}
export default SentryEmitter
