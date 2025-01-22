/**
 * @file Internal - formatLog
 * @module mkbuild/internal/formatLog
 */

import pathe from '@flex-development/pathe'
import { ksort } from '@flex-development/tutils'
import { ok } from 'devlop'
import type { LogLevel, RollupLog } from 'rollup'

/**
 * Format a rollup `log`.
 *
 * @see https://rollupjs.org/plugin-development/#onlog
 * @see https://github.com/rollup/rollup/issues/5699
 * @see {@linkcode LogLevel}
 * @see {@linkcode RollupLog}
 *
 * @internal
 *
 * @this {void}
 *
 * @param {LogLevel} level
 *  Rollup log level
 * @param {RollupLog} log
 *  Rollup log object
 * @return {undefined}
 */
function formatLog(this: void, level: LogLevel, log: RollupLog): undefined {
  ok(typeof log.code === 'string', 'expected `log.code`')

  /**
   * Path to module where message originated.
   *
   * @const {string | undefined} id
   */
  const id: string | undefined = log.id || log.loc?.file

  if (log.plugin) {
    log.message = log.message.slice(`[plugin ${log.plugin}]`.length + 1)
  }

  if (id) {
    /**
     * String to search for in {@linkcode log.message}.
     *
     * @var {string} seed
     */
    let seed: string = pathe.basename(id)

    if (log.loc) seed += ` (${log.loc.line}:${log.loc.column}):`

    log.message = log.message.slice(log.message.indexOf(seed) + seed.length + 1)
    log.message = log.message.trimStart()
  }

  if (!log.level) log.level = level
  return void ksort(log)
}

export default formatLog
