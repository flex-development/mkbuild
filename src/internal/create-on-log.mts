/**
 * @file Internal - createOnLog
 * @module mkbuild/internal/createOnLog
 */

import type { Message, RollupCode } from '@flex-development/mkbuild'
import { ksort, omit } from '@flex-development/tutils'
import { ok } from 'devlop'
import type { LogHandler, LogLevel, RollupLog } from 'rollup'

export default createOnLog

/**
 * Create a log handler.
 *
 * @see https://rollupjs.org/configuration-options/#onlog
 * @see {@linkcode LogHandler}
 * @see {@linkcode Message}
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Message[]} messages
 *  List to collect build messages
 * @return {LogHandler}
 *  Rollup log handler
 */
function createOnLog(this: void, messages: Message[]): LogHandler {
  return onLog

  /**
   * @see https://rollupjs.org/configuration-options/#onlog
   *
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

    return void messages.push(ksort({
      ...omit(log, ['message']),
      code: log.code as RollupCode,
      level,
      text: log.message
    }))
  }
}
