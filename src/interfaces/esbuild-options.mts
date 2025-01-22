/**
 * @file Interfaces - EsbuildOptions
 * @module mkbuild/interfaces/EsbuildOptions
 */

import type { JsxTransform } from '@flex-development/mkbuild'
import type { EmptyString, Ext } from '@flex-development/pathe'
import type { Tsconfig } from '@flex-development/tsconfig-types'
import type { FilterPattern } from '@rollup/pluginutils'
import type { Charset, Drop, Loader, LogLevel, Platform } from 'esbuild'

/**
 * Options passed to the [esbuild transform api][esbuild-transform].
 *
 * [esbuild-transform]: https://esbuild.github.io/api/#transform
 *
 * @todo `globalName`
 * @todo `ignoreAnnotations`
 * @todo `pure`
 * @todo `treeShaking`
 */
interface EsbuildOptions {
  /**
   * By default esbuild's output is ASCII-only. Any non-ASCII characters are
   * escaped using backslash escape sequences. Disable character escaping by
   * setting the charset.
   *
   * @see https://esbuild.github.io/api/#charset
   * @see {@linkcode Charset}
   */
  charset?: Charset | null | undefined

  /**
   * Replace global identifiers with constant expressions.
   *
   * @see https://esbuild.github.io/api/#define
   */
  define?: { [key: string]: string } | null | undefined

  /**
   * Remove certain constructs before transformation.
   *
   * @see https://esbuild.github.io/api/#drop
   * @see {@linkcode Drop}
   */
  drop?: Drop[] | null | undefined

  /**
   * Remove labeled statements with specific label names.
   *
   * @see https://esbuild.github.io/api/#drop-labels
   */
  dropLabels?: string[] | null | undefined

  /**
   * Patterns matching modules to exclude from transformation.
   *
   * @see {@linkcode FilterPattern}
   */
  exclude?: FilterPattern | null | undefined

  /**
   * Patterns matching modules to transform.
   *
   * @see {@linkcode FilterPattern}
   *
   * @default /\.(?:(?:json)|(?:[cm]?[jt]s)|(?:[jt]sx?))$/
   */
  include?: FilterPattern | null | undefined

  /**
   * Tell esbuild what to do about JSX syntax.
   *
   * @see https://esbuild.github.io/api/#jsx
   * @see {@linkcode JsxTransform}
   */
  jsx?: JsxTransform | null | undefined

  /**
   * Tell esbuild to automatically inject the file name and source location into
   * each JSX element. Your JSX library can then use this information to help
   * with debugging.
   *
   * @see https://esbuild.github.io/api/#jsx-dev
   */
  jsxDev?: boolean | null | undefined

  /**
   * The function that is called for each JSX element.
   *
   * @see https://esbuild.github.io/api/#jsx-factory
   */
  jsxFactory?: string | null | undefined

  /**
   * The function that is called for each JSX fragment.
   *
   * @see https://esbuild.github.io/api/#jsx-fragment
   */
  jsxFragment?: string | null | undefined

  /**
   * The library to automatically import JSX helper functions from.
   *
   * @see https://esbuild.github.io/api/#jsx-import-source
   */
  jsxImportSource?: string | null | undefined

  /**
   * Mark JSX expressions as having side effects.
   *
   * @see https://esbuild.github.io/api/#jsx-side-effects
   */
  jsxSideEffects?: boolean | null | undefined

  /**
   * Preserve original `name` values in minified code.
   *
   * @see https://esbuild.github.io/api/#keep-names
   */
  keepNames?: boolean | null | undefined

  /**
   * Prevent esbuild from generating output files with really long lines, which
   * can help editing performance in poorly-implemented text editors.
   *
   * @see https://esbuild.github.io/api/#line-limit
   */
  lineLimit?: number | null | undefined

  /**
   * Loader map.
   *
   * @see https://esbuild.github.io/api/#loader
   * @see {@linkcode Ext}
   * @see {@linkcode Loader}
   */
  loader?: Partial<Record<EmptyString | Ext, Loader>> | null | undefined

  /**
   * Log overrides.
   *
   * @see https://esbuild.github.io/api/#log-override
   * @see {@linkcode LogLevel}
   */
  logOverride?: Record<string, LogLevel> | null | undefined

  /**
   * Customize what mangled properties are renamed to, and/or disable mangling
   * for individual properties.
   *
   * @see https://esbuild.github.io/api/#mangle-cache
   */
  mangleCache?: Record<string, string | false> | null | undefined

  /**
   * Regular expression matching properties that esbuild should automatically
   * rename.
   *
   * @see https://esbuild.github.io/api/#mangle-props
   */
  mangleProps?: RegExp | null | undefined

  /**
   * Mangle quoted properties.
   *
   * @see https://esbuild.github.io/api/#mangle-quoted
   */
  mangleQuoted?: boolean | null | undefined

  /**
   * Minify generated code by renaming local variables to be shorter, rewriting
   * syntax to be more compact, and removing whitespace.
   *
   * @see https://esbuild.github.io/api/#minify
   * @see {@linkcode minifyIdentifiers}
   * @see {@linkcode minifySyntax}
   * @see {@linkcode minifyWhitespace}
   */
  minify?: boolean | null | undefined

  /**
   * Minify generated code by renaming local variables to be shorter.
   *
   * @see https://esbuild.github.io/api/#minify
   */
  minifyIdentifiers?: boolean | null | undefined

  /**
   * Minify generated code by rewriting syntax to be more compact.
   *
   * @see https://esbuild.github.io/api/#minify
   */
  minifySyntax?: boolean | null | undefined

  /**
   * Minify generated code by removing whitespace.
   *
   * @see https://esbuild.github.io/api/#minify
   */
  minifyWhitespace?: boolean | null | undefined

  /**
   * Platform to generate code for.
   *
   * @see https://esbuild.github.io/api/#platform
   * @see {@linkcode Platform}
   *
   * @default 'node'
   */
  platform?: Platform | null | undefined

  /**
   * Regular expression matching properties to exclude from mangling.
   *
   * @see https://esbuild.github.io/api/#reserve-props
   */
  reserveProps?: RegExp | null | undefined

  /**
   * Customize esbuild's set of unsupported syntax features at the individual
   * syntax feature level.
   *
   * @see https://esbuild.github.io/api/#supported
   */
  supported?: Record<string, boolean> | null | undefined

  /**
   * Target environment for generated JavaScript and/or CSS code.
   *
   * @see https://esbuild.github.io/api/#target
   */
  target?: Set<string> | string[] | string | null | undefined

  /**
   * Raw tsconfig.
   *
   * @see https://esbuild.github.io/api/#tsconfig-raw
   * @see {@linkcode Tsconfig}
   */
  tsconfigRaw?: Tsconfig | string | null | undefined
}

export type { EsbuildOptions as default }
