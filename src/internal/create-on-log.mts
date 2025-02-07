/**
 * @file Internal - createOnLog
 * @module mkbuild/internal/createOnLog
 */

import toInputLog from '#internal/to-input-log'
import type { Colors } from '@flex-development/colors'
import type { Logger } from '@flex-development/log'
import type { Message } from '@flex-development/mkbuild'
import { ksort } from '@flex-development/tutils'
import { ok } from 'devlop'
import type { LogHandler, LogLevel, RollupLog } from 'rollup'

export default createOnLog

/**
 * Create a rollup log handler.
 *
 * @see https://rollupjs.org/configuration-options/#onlog
 * @see {@linkcode LogHandler}
 * @see {@linkcode Logger}
 * @see {@linkcode Message}
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Message[]} messages
 *  List to collect build messages
 * @param {Logger} logger
 *  Build task logger
 * @return {LogHandler}
 *  Rollup log handler
 */
function createOnLog(
  this: void,
  messages: Message[],
  logger: Logger
): LogHandler {
  /**
   * Colorizer.
   *
   * > 👉 **Note**: This is a variable to avoid re-calculating the color
   * > functions map.
   *
   * @const {Colors} colors
   */
  const colors: Colors = logger.colors

  return onLog

  /**
   * @this {void}
   *
   * @param {LogLevel} level
   *  Rollup log level
   * @param {RollupLog} log
   *  Rollup log object
   * @return {undefined}
   */
  function onLog(this: void, level: LogLevel, log: RollupLog): undefined {
    ok(typeof log.code === 'string', 'expected `log.code`')
    const { type = level, ...rest } = log

    /**
     * Build message.
     *
     * @const {Message} message
     */
    const message: Message = ksort(Object.assign(rest as Message, {
      level: type
    }))

    return messages.push(message), void logger.log(toInputLog(message, colors))
  }
}
