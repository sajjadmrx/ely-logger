import { Emitter, LogService } from '../../dist'

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

main()

async function fetchTodos() {
  await fetch('https://jsonplaceholder.typicode.com/todos/1')

  throw new Error('Oops')
}
