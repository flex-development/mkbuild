/**
 * @file Interfaces - OutputFile
 * @module mkbuild/interfaces/OutputFile
 */

import type BuildEntry from './build-entry'
import type SourceFile from './source-file'

/**
 * Output file object schema.
 */
interface OutputFile {
  /**
   * Output file content.
   */
  contents?: string

  /**
   * TypeScript declaration file?
   */
  declaration?: true

  /**
   * Output file extension.
   */
  ext?: Required<BuildEntry>['ext'] | '.d.cts' | '.d.mts' | '.d.ts'

  /**
   * Path to output file.
   *
   * **Note**: Relative to `options.outdir`.
   */
  path: string

  /**
   * esbuild transform skipped?
   */
  raw?: true

  /**
   * Full path to source file.
   */
  src: SourceFile['file']
}

export type { OutputFile as default }
