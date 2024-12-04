import * as Sentry from '@sentry/node'
import { Emitter, LogService } from '../../dist'

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  environment: 'production',
  tracesSampleRate: 1.0,
  integrations: [Sentry.nestIntegration()]
})
const logger = new LogService('my-app')

async function main() {
  try {
    await fetchTodos()
  } catch (error) {
    logger.error(error).into(Emitter.SENTRY)
  }
}

main()

async function fetchTodos() {
  await fetch('https://jsonplaceholder.typicode.com/todos/1')

  throw new Error('Oops')
}
