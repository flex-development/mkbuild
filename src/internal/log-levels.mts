/**
 * @file Internal - logLevels
 * @module mkbuild/internal/logLevels
 */

import type { LogType } from '@flex-development/mkbuild'
import type { LogLevel } from 'rollup'

/**
 * Map, where each key is a log type and each value is a rollup log level.
 *
 * @see {@linkcode LogLevel}
 * @see {@linkcode LogType}
 *
 * @internal
 *
 * @const {Map<LogType, LogLevel | 'error'>} logLevels
 */
const logLevels: Map<LogType, LogLevel | 'error'> = new Map([
  ['debug', 'debug'],
  ['error', 'error'],
  ['info', 'info'],
  ['trace', 'debug'],
  ['verbose', 'debug'],
  ['warn', 'warn']
])

export default logLevels
