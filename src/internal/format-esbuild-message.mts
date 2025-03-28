/**
 * @file Internal - formatEsbuildMessage
 * @module mkbuild/internal/formatEsbuildMessage
 */

import logLevels from '#internal/log-levels'
import type { LogType } from '@flex-development/mkbuild'
import { Location } from '@flex-development/vfile-location'
import type { LogLevel, Message } from 'esbuild'
import type { RollupLog } from 'rollup'

/**
 * Convert an esbuild `message` to a rollup log.
 *
 * @see {@linkcode LogLevel}
 * @see {@linkcode Message}
 * @see {@linkcode RollupLog}
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Message} message
 *  The message to handle
 * @param {string} code
 *  The code being transformed
 * @param {string} id
 *  Module id
 * @param {string} plugin
 *  Plugin name
 * @param {LogLevel | undefined} [level='warning']
 *  esbuild log level override
 * @return {RollupLog}
 *  `message` formatted as rollup log
 */
function formatEsbuildMessage(
  this: void,
  message: Message,
  code: string,
  id: string,
  plugin: string,
  level: LogLevel | undefined = 'warning'
): RollupLog {
  /**
   * esbuild {@linkcode message} as rollup log.
   *
   * @const {RollupLog} log
   */
  const log: RollupLog = {
    hook: 'transform',
    id,
    message: message.text,
    meta: { level, notes: message.notes },
    plugin,
    pluginCode: message.id
  }

  if (level !== 'silent') {
    log.type = ({
      debug: 'debug',
      error: 'error',
      info: 'info',
      verbose: 'verbose',
      warning: 'warn'
    } as Record<LogLevel, LogType>)[level]

    log.level = logLevels.get(log.type)
  }

  if (message.location) {
    log.frame = message.location.lineText

    log.loc = {
      column: message.location.column + 1,
      file: message.location.file,
      line: message.location.line
    }

    log.pos = new Location(code).offset(log.loc)
  }

  return log
}

export default formatEsbuildMessage
