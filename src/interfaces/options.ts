/**
 * @file Interfaces - Options
 * @module mkbuild/interfaces/Options
 */

import type {
  EsbuildOptions,
  GeneratedFileType,
  OutputExtension
} from '#src/types'
import type * as pathe from '@flex-development/pathe'
import type { OneOrMany } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'

/**
 * Common build options.
 *
 * @extends {EsbuildOptions}
 */
interface Options extends EsbuildOptions {
  /**
   * Asset name template.
   *
   * @see https://esbuild.github.io/api/#asset-names
   *
   * @default 'assets/[name]-[hash]'
   */
  assetNames?: string

  /**
   * Arbitrary strings to insert at the beginning of generated JavaScript and
   * CSS files.
   *
   * @see https://esbuild.github.io/api/#banner
   *
   * @default {}
   */
  banner?: { [K in GeneratedFileType]?: string }

  /**
   * Bundle files.
   *
   * @see https://esbuild.github.io/api/#bundle
   *
   * @default false
   */
  bundle?: boolean

  /**
   * Chunk name template.
   *
   * @see https://esbuild.github.io/api/#chunk-names
   *
   * @default 'chunks/[name]-[hash]'
   */
  chunkNames?: string

  /**
   * Remove output directory before starting build.
   */
  clean?: boolean

  /**
   * Export conditions to apply.
   *
   * @see https://esbuild.github.io/api/#conditions
   *
   * @default ['import','default']
   */
  conditions?: Set<string> | string[]

  /**
   * Insert `require` function definition snippet into ESM bundles.
   *
   * [1]: https://esbuild.github.io/api/#platform
   *
   * @default bundle && format === 'esm' && platform === 'node'
   */
  createRequire?: boolean

  /**
   * Current working directory.
   *
   * @default '.'
   */
  cwd?: string

  /**
   * Generate TypeScript declaration (`*.d.cts`, `*.d.mts`, or `*.d.ts`) files.
   *
   * Pass `'only'` to only write declaration files.
   *
   * @default !!mlly.resolveModule(cwd+'node_modules/typescript/package.json')
   */
  dts?: boolean | 'only'

  /**
   * Output file extension.
   *
   * @default format === 'cjs' ? '.cjs' : format === 'esm' ? '.mjs' : '.js'
   */
  ext?: OutputExtension

  /**
   * Arbitrary strings to insert at the end of generated JavaScript and CSS
   * files.
   *
   * @see https://esbuild.github.io/api/#footer
   *
   * @default {}
   */
  footer?: { [K in GeneratedFileType]?: string }

  /**
   * Output file format.
   *
   * @see https://esbuild.github.io/api/#format
   *
   * @default 'esm'
   */
  format?: esbuild.Format

  /**
   * Glob patterns to exclude matches in {@linkcode pattern}.
   *
   * If a `.gitignore` file is found, patterns from the ignore file (that are
   * not negated) will be added to the default set of ignore patterns.
   *
   * @see https://github.com/mrmlnc/fast-glob#ignore
   *
   * @default IGNORE_PATTERNS
   */
  ignore?: Set<string> | string[]

  /**
   * Input file interpreter.
   *
   * @see https://esbuild.github.io/api/#loader
   * @see https://esbuild.github.io/content-types
   *
   * @default loaders(format,bundle)
   */
  loader?: Record<pathe.Ext, esbuild.Loader>

  /**
   * Log level.
   *
   * @see https://esbuild.github.io/api/#log-level
   *
   * @default 'info'
   */
  logLevel?: esbuild.LogLevel

  /**
   * Log overrides.
   *
   * @see https://esbuild.github.io/api/#log-override
   *
   * @default {}
   */
  logOverride?: Record<string, esbuild.LogLevel>

  /**
   * Additional `package.json` fields to try when resolving a package.
   *
   * @see https://esbuild.github.io/api/#main-fields
   *
   * @default ['module','main']
   */
  mainFields?: Set<string> | string[]

  /**
   * Bundle output file name.
   *
   * @default '[name]'
   */
  name?: string

  /**
   * Output file extension map.
   *
   * **Note**: Entry `.js` will be overwritten by {@linkcode ext}.
   *
   * @see https://esbuild.github.io/api/#out-extension
   *
   * @default {}
   */
  outExtension?: Record<pathe.Ext, pathe.Ext>

  /**
   * Output directory.
   *
   * @default 'dist'
   */
  outdir?: string

  /**
   * Glob patterns matching source files.
   *
   * **Note**: Not applicable if {@linkcode bundle} is enabled.
   *
   * @see https://github.com/sindresorhus/globby
   *
   * @default '**'
   */
  pattern?: OneOrMany<string> | Set<string>

  /**
   * Platform to generate code for.
   *
   * @see https://esbuild.github.io/api/#platform
   *
   * @default 'neutral'
   */
  platform?: esbuild.Platform

  /**
   * Resolvable file extensions.
   *
   * @see https://esbuild.github.io/api/#resolve-extensions
   *
   * @default mlly.RESOLVE_EXTENSIONS
   */
  resolveExtensions?: Set<string> | string[]

  /**
   * Directory containing source files or relative path to bundle input.
   *
   * @default bundle ? 'src/index' : 'src'
   */
  source?: string
}

export type { Options as default }
