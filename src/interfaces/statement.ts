/**
 * @file Interfaces - Statement
 * @module mkbuild/interfaces/Statement
 */

import type { ESMExport, ESMImport } from 'mlly'

/**
 * Import, export, or require statement object schema.
 */
interface Statement {
  /**
   * Code snippet.
   */
  code: string

  /**
   * Ending index of {@link code} in source content.
   */
  end: number

  /**
   * Module specifier.
   */
  specifier: string | undefined

  /**
   * Starting index of statement in source content.
   */
  start: number

  /**
   * Statement type.
   */
  type: ESMExport['type'] | ESMImport['type'] | 'require.resolve' | 'require'
}

export type { Statement as default }
