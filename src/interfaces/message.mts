/**
 * @file Interfaces - Message
 * @module mkbuild/interfaces/Message
 */

import type {
  LogType,
  MessageLocation,
  RollupCode
} from '@flex-development/mkbuild'

/**
 * Build message.
 */
interface Message {
  /**
   * Name of relevant export.
   */
  binding?: string | null | undefined

  /**
   * Cause for message.
   */
  cause?: unknown

  /**
   * Log code.
   *
   * @see {@linkcode RollupCode}
   */
  code?: RollupCode | null | undefined

  /**
   * Module id of exporting file.
   */
  exporter?: string | null | undefined

  /**
   * Code snippet.
   */
  frame?: string | null | undefined

  /**
   * Plugin hook name.
   */
  hook?: string | null | undefined

  /**
   * Module id of file where message occurred.
   */
  id?: string | null | undefined

  /**
   * List of relevant module ids.
   */
  ids?: string[] | null | undefined

  /**
   * Location where message originated in {@linkcode id}.
   *
   * @see {@linkcode MessageLocation}
   */
  loc?: MessageLocation | null | undefined

  /**
   * Log level of message.
   *
   * @see {@linkcode LogType}
   */
  level: LogType

  /**
   * Message text.
   */
  message: string

  /**
   * Message metadata.
   */
  meta?: unknown

  /**
   * List of relevant chunk, export, or import names.
   */
  names?: string[] | null | undefined

  /**
   * Plugin name.
   */
  plugin?: string | null | undefined

  /**
   * Custom plugin code.
   */
  pluginCode?: unknown

  /**
   * Index of where message originated in {@linkcode id}.
   */
  pos?: number | null | undefined

  /**
   * Module id of file that re-exports bindings from another module.
   */
  reexporter?: string | null | undefined

  /**
   * Stack trace.
   */
  stack?: string | null | undefined

  /**
   * Help URL.
   */
  url?: string | null | undefined
}

export type { Message as default }
