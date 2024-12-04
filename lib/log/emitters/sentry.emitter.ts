import * as Sentry from '@sentry/node'
import { Options } from '../interfaces/option.interface'
type LogLevel = 'WARN' | 'INFO' | 'ERROR'

const SentryEmitter = (options: Options, level: LogLevel, context: string, ...msg: any[]) => {
  if (!Sentry.getClient() || !Sentry.getClient().getDsn()) {
    const sentryPackage = 'https://www.npmjs.com/package/@sentry/node'
    console.warn(
      `Sentry DSN not found. Please provide a DSN to Sentry.init() method. See ${sentryPackage} for more information.`
    )
    return
  }

  msg.map(m => {
    if (typeof m === 'string') {
      Sentry.captureMessage(m, level.toLowerCase() as any)
    } else {
      Sentry.captureException(m)
    }
  })
}
export default SentryEmitter
