/**
 * @file Interfaces - Opts
 * @module mkbuild/cli/interfaces/opts
 */

import type { Options } from '#src/interfaces'
import type { Sourcemap } from '#src/types'
import type * as pathe from '@flex-development/pathe'
import type { EmptyObject, Omit } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'

/**
 * Parsed CLI options.
 *
 * @todo update documentation
 *
 * @extends {Omit<Options,'nodePaths'>}
 */
interface Flags extends Omit<Options, 'nodePaths'> {
  assetNames: string

  bundle: boolean

  chunkNames: string

  clean: boolean

  color: boolean

  conditions: Set<string>

  cwd: string

  format: esbuild.Format

  ignore: Set<string>

  ignoreAnnotations: boolean

  jsxDev: boolean

  jsxImportSource: string

  jsxSideEffects: boolean

  keepNames: boolean

  loader: Record<pathe.Ext, esbuild.Loader>

  logLevel: esbuild.LogLevel

  logLimit: number

  mainFields: string[]

  mangleQuoted: boolean

  minify: boolean

  minifyIdentifiers: boolean

  minifySyntax: boolean

  minifyWhitespace: boolean

  name: string

  outdir: string

  pattern: string

  platform: esbuild.Platform

  preserveSymlinks: boolean

  resolveExtensions: Set<string>

  /**
   * Serve files.
   *
   * @see https://esbuild.github.io/api/#serve
   *
   * @default false
   */
  serve: EmptyObject | false

  /**
   * Private key certificate file.
   *
   * @see https://esbuild.github.io/api/#serve
   */
  'serve.certfile'?: string

  /**
   * File serving host.
   *
   * @see https://esbuild.github.io/api/#serve
   */
  'serve.host': string

  /**
   * Private key file.
   *
   * @see https://esbuild.github.io/api/#serve
   */
  'serve.keyfile'?: string

  /**
   * Port to serve files on.
   *
   * @see https://esbuild.github.io/api/#serve
   */
  'serve.port'?: number

  /**
   * Directory to serve.
   *
   * @see https://esbuild.github.io/api/#serve
   */
  'serve.servedir'?: string

  /**
   * Enable sourcemaps.
   *
   * @see https://esbuild.github.io/api/#sourcemap
   *
   * @default false
   */
  sourcemap: Sourcemap | boolean

  sourcesContent: boolean

  splitting: boolean

  /**
   * Watch files.
   *
   * @default false
   */
  watch: boolean
}

export type { Flags as default }
