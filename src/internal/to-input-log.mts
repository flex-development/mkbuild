/**
 * @file Internal - toInputLog
 * @module mkbuild/internal/toInputLog
 */

import type { ColorFunction, Colors } from '@flex-development/colors'
import type { InputLogObject } from '@flex-development/log'
import type { LogType, Message } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { fallback } from '@flex-development/tutils'
import { ok } from 'devlop'

/**
 * Convert a build message to an input log object.
 *
 * @see {@linkcode InputLogObject}
 * @see {@linkcode Message}
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Message} msg
 *  Build message
 * @param {Colors} colors
 *  Color function map
 * @return {InputLogObject}
 *  Input log object
 */
function toInputLog(this: void, msg: Message, colors: Colors): InputLogObject {
  ok(typeof msg.level === 'string', 'expected `msg.level`')

  /**
   * Format arguments.
   *
   * @const {unknown[]} args
   */
  const args: unknown[] = []

  /**
   * Module id.
   *
   * @const {string | undefined} id
   */
  const id: string | undefined = msg.id || msg.loc?.file

  /**
   * Indentation.
   *
   * @const {string} indent
   */
  const indent: string = ' '.repeat(2)

  /**
   * Tint map.
   *
   * @const {Record<LogType, ColorFunction>} tint
   */
  const tint: Record<LogType, ColorFunction> = {
    debug: colors.gray,
    error: colors.red,
    info: colors.cyan,
    trace: colors.gray,
    verbose: colors.gray,
    warn: colors.yellow
  }

  /**
   * Message text.
   *
   * @var {string} message
   */
  let message: string = `${colors.bold('%s')} ${msg.message}`

  if (id) {
    message += `\n${indent}%s`
    args.push(colors.gray(pathe.relative(pathe.cwd(), id)))
  }

  if (msg.loc) {
    message += '%s'
    args.push(colors.gray(`:${msg.loc.line}:${msg.loc.column}`))

    if (msg.frame) {
      /**
       * Space to add before {@linkcode msg.loc.line}, as well as before
       * {@linkcode msg.frame}.
       *
       * @const {string} space
       */
      const space: string = indent.repeat(2)

      message += colors.gray(`:\n${space}%j |${space}`)
      message += colors.dim(tint[msg.level]('%s'))

      args.push(msg.loc.line, msg.frame.trimStart())
    }
  }

  return {
    args: [tint[msg.level](`[${fallback(msg.plugin, 'rollup')}]`), ...args],
    level: msg.level,
    message,
    stack: msg.stack,
    type: msg.level
  }
}

export default toInputLog
