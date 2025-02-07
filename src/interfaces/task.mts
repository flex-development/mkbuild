/**
 * @file Interfaces - Task
 * @module mkbuild/interfaces/Task
 */

import type {
  AssetFileNamesFn,
  BannerFn,
  DTSOption,
  EntryFileNamesFn,
  EsbuildOptions,
  ExperimentalOptions,
  FooterFn,
  Format,
  Input,
  LogType,
  ResolveOptions,
  SanitizeFileNameFn,
  SourcemapFileNamesFn,
  SourcemapIgnoreTest,
  SourcemapOption,
  SourcemapPathTransform
} from '@flex-development/mkbuild'
import type { ModuleId } from '@flex-development/mlly'
import type { Tsconfig } from '@flex-development/tsconfig-types'
import type {
  HashCharacters,
  InputPluginOption
} from 'rollup'

/**
 * Build task.
 *
 * @todo bundle mode support
 */
interface Task {
  /**
   * Pattern to use for naming custom emitted assets, or a function that is
   * called per asset that returns such a pattern.
   *
   * Patterns support the following placeholders:
   *
   * - `[ext]`: file extension of the asset, without leading dot (e.g. `css`)
   * - `[extname]`: normalized file extension of the asset (e.g. `.css`)
   * - `[format]`: normalized rendering format (e.g. `es`, `cjs`)
   * - `[hash]`: hash based on content of the asset. the hash length can also be
   *   specified by appending a colon and length: `[hash:13]`
   * - `[name]`: file name of the asset excluding any extension
   *
   * Forward slashes `/` can be used to place files in sub-directories.
   *
   * @see {@linkcode AssetFileNamesFn}
   *
   * @default 'assets/[name][extname]'
   */
  assetFileNames?: AssetFileNamesFn | string | null | undefined

  /**
   * A string to prepend to output chunk contents, or a function that returns
   * such a string.
   *
   * @see {@linkcode BannerFn}
   */
  banner?: BannerFn | string | null | undefined

  /**
   * Empty {@linkcode outdir} before build.
   *
   * > 👉 **Note**: Skipped if `outdir` resolves to {@linkcode root}.
   *
   * @default true
   */
  clean?: boolean | null | undefined

  /**
   * Generate TypeScript declaration (`*.d.cts`, `*.d.mts`, or `*.d.ts`) files.
   *
   * Pass `'only'` to only write declaration files.
   *
   * Defaults to `true` if `'typescript'` is detected in production or
   * development dependencies.
   *
   * @see {@linkcode DTSOption}
   *
   * @default
   *  Object.keys({ ...pkg.devDependencies }).includes('typescript')
   */
  dts?: DTSOption | null | undefined

  /**
   * Pattern to use for naming chunks created from entry points, or a function
   * that is called per entry chunk that returns such a pattern.
   *
   * Patterns support the following placeholders:
   *
   * - `{extname}`: normalized output file extension (e.g. `.mjs`, `.cjs`),
   *   supported by `mkbuild` only
   * - `[format]`: normalized rendering format (e.g. `es`, `cjs`)
   * - `[hash]`: hash based only on the content of the final generated chunk,
   *   including transformations in [`renderChunk`][render-chunk] and any
   *   referenced file hashes. the hash length can also be specified by
   *   appending a colon and length: `[hash:13]`
   * - `[name]`: file name (without extension) of the entry point, unless the
   *   object form of input was used to define a different name
   *
   * Forward slashes `/` can be used to place files in sub-directories.
   *
   * [render-chunk]: https://rollupjs.org/plugin-development/#renderchunk
   *
   * @see {@linkcode EntryFileNamesFn}
   *
   * @default '[name]{extname}'
   */
  entryFileNames?: EntryFileNamesFn | string | null | undefined

  /**
   * Transform options to pass to `esbuild`.
   *
   * @see {@linkcode EsbuildOptions}
   * @see https://esbuild.github.io/api/#transform
   */
  esbuild?: EsbuildOptions | false | null | undefined

  /**
   * Experimental options.
   *
   * @see {@linkcode ExperimentalOptions}
   */
  experimental?: ExperimentalOptions | null | undefined

  /**
   * Output file extension.
   *
   * > 👉 **Note**: Only applied to output chunks.
   *
   * @default
   *  format === 'esm' ? '.mjs' : format === 'cjs' ? '.cjs' : '.js'
   */
  ext?: string | null | undefined

  /**
   * A string to prepend to output chunk contents, or a function that returns
   * such a string.
   *
   * @see {@linkcode FooterFn}
   */
  footer?: FooterFn | string | null | undefined

  /**
   * Output file format.
   *
   * @see {@linkcode Format}
   *
   * @default
   *  pkg.type === 'module' ? 'esm' : 'cjs'
   */
  format?: Format | null | undefined

  /**
   * Use `.gitignore` file in {@linkcode root}. Patterns that are not negated
   * will be considered {@linkcode ignore} patterns.
   *
   * @default true
   */
  gitignore?: boolean | null | undefined

  /**
   * Character set that mkbuild (rollup) is allowed to use in file hashes.
   *
   * - `'base64'`: url-safe base-64 hashes with potential characters
   *   `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.
   * - `'base36'`: lower-case letters and numbers
   *   `abcdefghijklmnopqrstuvwxyz0123456789`.
   * - `'hex'`: hexadecimal hashes with the characters `abcdef0123456789`.
   *
   * @see {@linkcode HashCharacters}
   *
   * @default 'base64'
   */
  hashCharacters?: HashCharacters | null | undefined

  /**
   * Glob patterns to exclude matches in {@linkcode pattern}.
   *
   * If a `.gitignore` file is found, patterns from the ignore file (that are
   * not negated) will be added to the default set of ignore patterns.
   *
   * @default IGNORE_PATTERNS
   */
  ignore?: Set<string> | readonly string[] | string | null | undefined

  /**
   * Entry points.
   *
   * @see {@linkcode Input}
   */
  input?: Input | null | undefined

  /**
   * Log level.
   *
   * @see {@linkcode LogType}
   *
   * @default 'info'
   */
  logLevel?: LogType | 'silent' | null | undefined

  /**
   * Limit the number of files that can be opened in parallel when reading
   * modules or writing chunks. Without a limit or with a high enough value,
   * builds can fail with an `"EMFILE: too many open files"`. This depends on
   * how many open file handles the operating system allows.
   *
   * @default 20
   */
  maxParallelFileOps?: number | null | undefined

  /**
   * Directory relative from {@linkcode root} where build output will be placed.
   *
   * @default 'dist'
   */
  outdir?: string | null | undefined

  /**
   * List of plugins to use.
   *
   * @see {@linkcode InputPluginOption}
   */
  plugins?: InputPluginOption[] | null | undefined

  /**
   * Module resolver options.
   *
   * Specifiers are resolved according to the [ESM Resolver algorithm][esm],
   * mostly 😉.
   *
   * Support is added for:
   *
   * - Changing file extensions
   * - Directory index resolution
   * - Extensionless file resolution
   * - Path alias resolution
   * - Scopeless `@types/*` resolution (i.e. `unist` -> `@types/unist`)
   *
   * [esm]: https://nodejs.org/api/esm.html#esm_resolver_algorithm
   *
   * @see {@linkcode ResolveOptions}
   */
  resolve?: ResolveOptions | null | undefined

  /**
   * Project root directory.
   *
   * Can be a `file:` URL, absolute path, or a path relative to the current
   * working directory.
   *
   * @see {@linkcode ModuleId}
   *
   * @default
   *  pathe.cwd() + pathe.sep
   */
  root?: ModuleId | null | undefined

  /**
   * Boolean enabling or disabling default chunk name sanitization (removal of
   * `\0`, `?`, and `*` characters), or function to customize chunk name
   * sanitization.
   *
   * @see {@linkcode SanitizeFileNameFn}
   *
   * @default true
   */
  sanitizeFileName?: SanitizeFileNameFn | boolean | null | undefined

  /**
   * Generate production source maps.
   *
   * - `true`: separate sourcemap files will be created
   * - `'hidden'`: works like `true`, but sourcemap comments in corresponding
   *   output files are suppressed
   * - `'inline'`: sourcemaps will be appended to output files as data URIs
   *
   * @see {@linkcode SourcemapOption}
   *
   * @default undefined
   */
  sourcemap?: SourcemapOption | null | undefined

  /**
   * Base URL to use in source maps.
   *
   * @see {@linkcode ModuleId}
   */
  sourcemapBaseUrl?: ModuleId | null | undefined

  /**
   * Do not add the actual code of the sources to sourcemaps, thus making them
   * considerably smaller.
   *
   * @default undefined
   */
  sourcemapExcludeSources?: boolean | null | undefined

  /**
   * Pattern to use for for naming sourcemaps, or a function that is called per
   * sourcemap that returns such a pattern.
   *
   * Patterns support the following placeholders:
   *
   * - `[chunkhash]`: the same hash as the one used for for the corresponding
   *   generated chunk (if any)
   * - `[format]`: normalized rendering format (e.g. `es`, `cjs`)
   * - `[hash]`: hash based only on the content of the final generated
   *   sourcemap. the hash length can also be specified: `[hash:13]`
   * - `[name]`: file name (without extension) of the entry point, unless the
   *   object form of input was used to define a different name
   *
   * Forward slashes `/` can be used to place files in sub-directories.
   *
   * @see {@linkcode SourcemapFileNamesFn}
   */
  sourcemapFileNames?: SourcemapFileNamesFn | string | null | undefined

  /**
   * A predicate to decide whether or not to ignore-list source files in a
   * sourcemap, `true` to enable default ignore listing, or `false` to turn off
   * ignore-listing completely.
   *
   * @see {@linkcode SourcemapIgnoreTest}
   */
  sourcemapIgnoreList?: SourcemapIgnoreTest | boolean | null | undefined

  /**
   * A transformation to apply to each path in a sourcemap.
   *
   * @see {@linkcode SourcemapPathTransform}
   */
  sourcemapPathTransform?: SourcemapPathTransform | null | undefined

  /**
   * Throw an error instead of showing a warning when a deprecated feature is
   * used.
   *
   * @default true
   */
  strictDeprecations?: boolean | null | undefined

  /**
   * Module id of tsconfig file.
   *
   * @see {@linkcode ModuleId}
   */
  tsconfig?: ModuleId | null | undefined

  /**
   * Raw tsconfig.
   *
   * @see https://esbuild.github.io/api/#tsconfig-raw
   * @see {@linkcode Tsconfig}
   */
  tsconfigRaw?: Tsconfig | string | null | undefined

  /**
   * Path to TypeScript module directory.
   *
   * @default pathe.resolve('node_modules/typescript')
   */
  typescriptPath?: string | null | undefined

  /**
   * Re-parse each generated chunk to detect if the generated code is valid
   * JavaScript. This can be useful to debug output generated by plugins that
   * use the [`renderChunk`][render-chunk] hook to transform code.
   *
   * [render-chunk]: https://rollupjs.org/plugin-development/#renderchunk
   *
   * @default false
   */
  validate?: boolean | null | undefined

  /**
   * Directory name for "virtual" files that might be emitted by plugins.
   */
  virtualDirname?: string | null | undefined

  /**
   * Write build outputs to disk.
   *
   * @default false
   */
  write?: boolean | null | undefined
}

export type { Task as default }
