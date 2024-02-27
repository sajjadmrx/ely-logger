import { OptionsWithContext } from './interfaces/options-Context.interface'
import { Message } from './message'
import { setOptions } from './options'

/**
 * @enum Emitter
 * Enum representing different emitters for logging.
 * @example
 * const emitter = Emitter.DISCORD
 */
export enum Emitter {
  'DISCORD' = 'DISCORD',
  'TELEGRAM' = 'TELEGRAM',
  'CONSOLE' = 'CONSOLE'
}

/**
 * @class LogService
 * Represents a logging service that provides methods for logging messages with different severity levels.
 * @example
 * const logger = new LogService('MyContext')
 * logger.log('This is an info message').into(Emitter.CONSOLE)
 */
export class LogService {
  private context: string

  /**
   * Creates a new instance of the LogService.
   * @constructor
   * @param { string | OptionsWithContext } context - The context for the logger service.
   * @example
   * const logger = new LogService('MyContext')
   * logger.log('This is an info message').into(Emitter.CONSOLE)
   */
  constructor(context: string | OptionsWithContext) {
    if (typeof context === 'string') {
      this.context = context
    } else {
      this.context = context?.context || ''
      setOptions(context)
    }
  }

  /**
   * @method log
   * Logs a message with the 'INFO' severity level.
   * @param msg - The message to be logged.
   * @returns A Message object with the specified message, severity level set to 'INFO', and the current context.
   */
  log(...msg: any[]) {
    return new Message(...msg).is('INFO').context(this.context)
  }

  /**
   * @method warn
   * Logs a message with the 'WARN' severity level.
   * @param msg - The message to be logged.
   * @returns A Message object with the specified message, severity level set to 'WARN', and the current context.
   */
  warn(...msg: any[]) {
    return new Message(...msg).is('WARN').context(this.context)
  }

  /**
   * @method error
   * Logs a message with the 'ERROR' severity level.
   * @param msg - The message to be logged.
   * @returns A Message object with the specified message, severity level set to 'ERROR', and the current context.
   */
  error(...msg: any[]) {
    return new Message(...msg).is('ERROR').context(this.context)
  }
}
