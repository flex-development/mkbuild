/**
 * @file Internal - formatDiagnostic
 * @module mkbuild/internal/formatDiagnostic
 */

import { Location, type Point } from '@flex-development/vfile-location'
import { ok } from 'devlop'
import type { LogLevel, RollupLog } from 'rollup'
import type {
  Diagnostic,
  DiagnosticCategory,
  SourceFile,
  default as TypeScript
} from 'typescript'

export { formatDiagnostic as default, type MinimalDiagnostic }

/**
 * Minimal TypeScript diagnostic.
 *
 * @see {@linkcode Diagnostic}
 *
 * @internal
 *
 * @extends {Omit<Diagnostic,'file'>}
 */
interface MinimalDiagnostic extends Omit<Diagnostic, 'file'> {
  /**
   * Source file associated with diagnostic.
   *
   * @see {@linkcode SourceFile}
   */
  file?: Pick<SourceFile, 'fileName' | 'text'> | undefined
}

/**
 * Convert a TypeScript `diagnostic` to a rollup log.
 *
 * @see {@linkcode MinimalDiagnostic}
 * @see {@linkcode RollupLog}
 * @see {@linkcode TypeScript}
 *
 * @internal
 *
 * @this {void}
 *
 * @param {MinimalDiagnostic} diagnostic
 *  The diagnostic to handle
 * @param {string} plugin
 *  Plugin name
 * @param {string} hook
 *  Plugin hook name
 * @param {typeof TypeScript} ts
 *  TypeScript module
 * @return {RollupLog}
 *  `diagnostic` as rollup log
 */
function formatDiagnostic(
  this: void,
  diagnostic: MinimalDiagnostic,
  plugin: string,
  hook: string,
  ts: typeof TypeScript
): RollupLog {
  /**
   * Diagnostic as rollup log.
   *
   * @const {RollupLog} log
   */
  const log: RollupLog = {
    hook,
    level: ({
      [ts.DiagnosticCategory.Error]: 'warn',
      [ts.DiagnosticCategory.Message]: 'info',
      [ts.DiagnosticCategory.Suggestion]: 'info',
      [ts.DiagnosticCategory.Warning]: 'warn'
    } as Record<DiagnosticCategory, LogLevel | 'error'>)[diagnostic.category],
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    meta: { category: diagnostic.category },
    plugin,
    pluginCode: diagnostic.code
  }

  if (diagnostic.file) {
    ok(typeof diagnostic.start === 'number', 'expected `diagnostic.start`')
    ok(typeof log.meta === 'object', 'expected `log.meta`')

    /**
     * Location utility.
     *
     * @const {Location} location
     */
    const location: Location = new Location(diagnostic.file.text)

    /**
     * Point where {@linkcode diagnostic} starts.
     *
     * @const {Point} point
     */
    const point: Point = location.point(diagnostic.start)

    log.id = diagnostic.file.fileName

    log.frame = diagnostic.file.text.slice(
      location.offset({ column: 1, line: point.line }),
      diagnostic.file.text.indexOf('\n', point.offset)
    )

    log.loc = {
      column: point.column,
      file: diagnostic.file.fileName,
      line: point.line
    }

    log.pos = point.offset
  }

  return log
}
