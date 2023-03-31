/**
 * @file Interfaces - Flags
 * @module mkbuild/interfaces/Flags
 */

import type Config from './config'

/**
 * CLI options.
 */
interface Flags {
  /**
   * Remove output directories before starting build.
   *
   * @default true
   */
  clean?: Config['clean']

  /**
   * Generate TypeScript declaration (`*.d.cts`, `*.d.mts`, or `*.d.ts`) files.
   *
   * Pass `'only'` to only write declaration files.
   *
   * @default !!mlly.resolveModule(cwd + 'node_modules/typescript/package.json')
   */
  dts?: Config['dts']

  /**
   * Output file extension.
   *
   * @default format === 'cjs' ? '.cjs' : format === 'esm' ? '.mjs' : '.js'
   */
  ext?: Config['ext']

  /**
   * Output file format.
   *
   * @see https://esbuild.github.io/api/#format
   *
   * @default 'esm'
   */
  format?: Config['format']

  /**
   * Bundle output file name.
   *
   * @default '[name]'
   */
  name?: Config['name']

  /**
   * Output directory.
   *
   * @default 'dist'
   */
  outdir?: Config['outdir']

  /**
   * Glob patterns matching source files.
   *
   * Not applicable if {@linkcode bundle} is enabled.
   *
   * @see https://github.com/sindresorhus/globby
   *
   * @default '**'
   */
  pattern?: string | undefined

  /**
   * Directory containing source files or relative path to bundle input.
   *
   * @default bundle ? 'src/index' : 'src'
   */
  source?: Config['source']

  /**
   * Generate sourcemaps.
   *
   * @see https://esbuild.github.io/api/#sourcemap
   */
  sourcemap?: Config['sourcemap']

  /**
   * Add original source code to sourcemap.
   *
   * @see https://esbuild.github.io/api/#sources-content
   */
  sourcesContent?: Config['sourcesContent']

  /**
   * Relative path to tsconfig file.
   *
   * @see https://esbuild.github.io/api/#tsconfig
   */
  tsconfig?: Config['tsconfig']

  /**
   * Watch files.
   *
   * @default false
   */
  watch?: Config['watch']
}

export type { Flags as default }
