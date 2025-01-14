import { Emitter, LogService } from '../../dist'
import { buildSentryPayload } from '../../lib/log/emitters/sentry.emitter'

const logger = new LogService('my-app', {
  sentry: {
    dsn: 'https://sentry.io/123456',
    tracesSampleRate: 1,
    environment: 'production'
  }
})

async function main() {
  try {
    await fetchTodos()
  } catch (error) {
    logger.error(error).into(Emitter.SENTRY).into(Emitter.CONSOLE)
  }
}

async function main2() {
  try {
    await fetchTodos()
  } catch (error) {
    logger
      .error(
        buildSentryPayload({
          contentOrError: error,
          user: {
            id: 1
          },
          contexts: {
            myContext: {
              id: 1,
              name: 'myContext',
              type: 'myType',
              version: '1.0.0'
            }
          }
        })
      )
      .into(Emitter.SENTRY)
  }
}

main2()

async function fetchTodos() {
  const resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const data = await resp.json()
  data.log()
}
