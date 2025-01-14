import { Logger } from '@nestjs/common'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'

const consoleEmitter = (level: LogLevel, context: string, ...msg: any[]) => {
  const nestLogger = new Logger(context)
  const formattedMessages = msg
    .map(m => {
      if (m instanceof Error) {
        return JSON.stringify(m, Object.getOwnPropertyNames(m), 2)
      }

      if (typeof m === 'object') {
        return JSON.stringify(m, null, 2)
      }

      return m
    })
    .join(' ')

  nestLogger[level.toLowerCase().replace('info', 'log')](formattedMessages)
}
export default consoleEmitter
