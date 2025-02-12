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
  EsModuleOption,
  ExperimentalOptions,
  ExportMode,
  FooterFn,
  Format,
  GeneratedCodeOption,
  Input,
  InteropOption,
  LogType,
  ModuleContextOption,
  ResolveOptions,
  SanitizeFileNameFn,
  SourcemapFileNamesFn,
  SourcemapIgnoreTest,
  SourcemapOption,
  SourcemapPathTransform,
  TreeshakeOption
} from '@flex-development/mkbuild'
import type { ModuleId } from '@flex-development/mlly'
import type { Tsconfig } from '@flex-development/tsconfig-types'
import type {
  HashCharacters,
  ImportAttributesKey,
  InputPluginOption,
  PreserveEntrySignaturesOption
} from 'rollup'

/**
 * Build task.
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
   * Enable bundling?
   */
  bundle?: boolean | null | undefined

  /**
   * Empty {@linkcode outdir} before build.
   *
   * > 👉 **Note**: Skipped if `outdir` resolves to {@linkcode root}.
   *
   * @default true
   */
  clean?: boolean | null | undefined

  /**
   * Minify the wrapper code generated by mkbuild (rollup).
   *
   * > 👉 **Note**: This does not affect code written by the user. This option
   * > is useful when bundling pre-minified code.
   *
   * @default false
   */
  compact?: boolean | null | undefined

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
   * Keep external dynamic imports as `import(…)` expressions in CommonJS
   * output. Set this to `false` to rewrite dynamic imports using `require(…)`
   * syntax.
   *
   * @default true
   */
  dynamicImportInCjs?: boolean | null | undefined

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
   * Whether to add `__esModule: true` when generating exports for non-ES
   * formats. This property signifies that the exported value is the namespace
   * of an ES module and that the default export of this module corresponds to
   * the `.default` property of the exported object.
   *
   * - `'if-default-prop'`: only add the property when using
   *   [named exports mode][exports] and there also is a default export. the
   *   subtle difference is that if there is no default export, consumers of the
   *   commonjs version of your library will get all named exports as the
   *   default export instead of an error or `undefined`
   * - `false`: never add the property (even if the default export would become
   *   `.default`)
   * - `true`: add the property when using [named exports mode][exports]
   *
   * > 👉 **Note**: The default value is `'if-default-prop'` because the
   * > `__esModule` property is not a standard followed by any JavaScript
   * > runtime and leads to many interop issues.
   *
   * [exports]: https://rollupjs.org/configuration-options/#output-exports
   *
   * @see {@linkcode EsModuleOption}
   *
   * @default 'if-default-prop'
   */
  esModule?: EsModuleOption | null | undefined

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
   * The export mode to use.
   *
   * @see {@linkcode ExportMode}
   *
   * @default 'auto'
   */
  exports?: ExportMode | null | undefined

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
   * Whether to add import attributes to external imports in the output if the
   * output {@linkcode format} is `esm` or `cjs`.
   *
   * By default, attributes are taken from the input files, but plugins can add
   * or remove attributes later.
   *
   * > 👉 **Note**: All imports of a module need to have consistent attributes,
   * > otherwise a warning is emitted.
   *
   * @default true
   */
  externalImportAttributes?: boolean | null | undefined

  /**
   * Whether to generate code to support live bindings for external imports.
   *
   * If `false`, it will be assumed that exports do not change over time. This
   * will enable mkbuild (rollup) to generate more optimized code. This can
   * cause issues when there are circular dependencies involving an external
   * dependency.
   *
   * @default true
   */
  externalLiveBindings?: boolean | null | undefined

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
   * Whether to `Object.freeze()` namespace import objects
   * (i.e. `import * as namespaceImportObject from...`) that are accessed
   * dynamically.
   *
   * @default true
   */
  freeze?: boolean | null | undefined

  /**
   * Whether to inline dynamic imports instead of creating new chunks to create
   * a single bundle. This is only possible if a single input is provided.
   *
   * > 👉 **Note**: This will not transpile any user code but only change the
   * > code mkbuild (rollup) uses in wrappers and helpers.
   *
   * @see {@linkcode GeneratedCodeOption}
   *
   * @default 'es5'
   */
  generatedCode?: GeneratedCodeOption | null | undefined

  /**
   * Use `.gitignore` file in {@linkcode root}. Patterns that are not negated
   * will be considered {@linkcode ignore} patterns.
   *
   * @default true
   */
  gitignore?: boolean | null | undefined

  /**
   * Whether to extend the global variable defined by {@linkcode globalName}.
   *
   * When `true`, the global variable will be defined as
   * `(global.name = global.name || {})`.\
   * Otherwise, the global defined by {@linkcode globalName} will be
   * overwritten: `(global.name = {})`.
   *
   * @default false
   */
  globalExtend?: boolean | null | undefined

  /**
   * Global variable name representing the bundle.
   *
   * > 👉 **Note**: This is necessary for `iife` / `umd` bundles that export
   * > values. Other scripts on the same page can use this variable name to
   * > access bundle exports.
   */
  globalName?: string | null | undefined

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
   * By default, when creating multiple chunks, transitive imports of entry
   * chunks will be added as empty imports to the entry chunks. Setting this
   * option to `false` will disable this behavior.
   *
   * @see https://rollupjs.org/faqs/#why-do-additional-imports-turn-up-in-my-entry-chunks-when-code-splitting
   *
   * > 👉 **Note**: This option is ignored when bundling is disabled; imports
   * > will never be hoisted.
   *
   * @default true
   */
  hoistTransitiveImports?: boolean | null | undefined

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
   * Determine the keyword set that mkbuild (rollup) will use for import
   * attributes.
   *
   * @see {@linkcode ImportAttributesKey}
   *
   * @default 'with'
   */
  importAttributesKey?: ImportAttributesKey | null | undefined

  /**
   * The indent string to use for formats that require code to be indented
   * (`iife`, `system`, `umd`). May also be a boolean to disable indentation or
   * use auto indentation.
   *
   * @default true
   */
  indent?: boolean | string | null | undefined

  /**
   * Whether to inline dynamic imports instead of creating new chunks to create
   * a single bundle. This is only possible if a single input is provided.
   *
   * > 👉 **Note**: Inlining dynamic imports will change the execution order: A
   * > module that is only imported dynamically will be executed immediately if
   * > the dynamic import is inlined.
   *
   * @default false
   */
  inlineDynamicImports?: boolean | null | undefined

  /**
   * Entry points.
   *
   * @see {@linkcode Input}
   */
  input?: Input | null | undefined

  /**
   * Control how mkbuild (rollup) handles default, namespace, and dynamic
   * imports from external dependencies in formats that do not natively support
   * these concepts.
   *
   * > 👉 **Note**: The default mode of `'default'` mimics NodeJS behavior and
   * > is different from TypeScript's `esModuleInterop`. To mimic TypeScript's
   * > behavior instead, pass `'auto'`.
   *
   * @see {@linkcode InteropOption}
   *
   * @default 'default'
   */
  interop?: InteropOption | null | undefined

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
   * Export internal variables as single letter variables to allow for better
   * minification.
   *
   * @default
   *  format === 'esm' || compact
   */
  minifyInternalExports?: boolean | null | undefined

  /**
   * Control module context.
   *
   * > 👉 **Note**: By default, the context of a module – i.e., the value of
   * > `this` at the top level – is `undefined`. In rare cases, this may need to
   * > be changed to something else, like `'window'`.
   *
   * @see {@linkcode ModuleContextOption}
   *
   * @default undefined
   */
  moduleContext?: ModuleContextOption | null | undefined

  /**
   * Whether to add an additional `noConflict` export to `umd` bundles.
   *
   * When called in an `iife` scenario, the `noConflict` method will return the
   * bundle exports while restoring the corresponding global variable to its
   * previous value.
   *
   * @default false
   */
  noConflict?: boolean | null | undefined

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
   * Control how mkbuild (rollup) tries to ensure that entry chunks have the
   * same exports as the underlying entry module.
   *
   * @see {@linkcode PreserveEntrySignaturesOption}
   *
   * @default 'exports-only'
   */
  preserveEntrySignatures?: PreserveEntrySignaturesOption | null | undefined

  /**
   * Whether to reexport `__proto__` from external modules.
   *
   * For maximum compatibility, this is done by default. However, for common use
   * cases, it is strongly recommended to disable this as it effectively reduces
   * output size.
   *
   * > 👉 **Note**: This option is only effective when {@linkcode format} is set
   * > to one `cjs`, `iife`, or `umd` and {@linkcode externalLiveBindings} is
   * > disabled.
   *
   * @see {@linkcode EsModuleOption}
   *
   * @default true
   */
  reexportProtoFromExternal?: boolean | null | undefined

  /**
   * Module resolution options.
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
   * Do not fail bundling if bindings are imported from a file that does not
   * define these bindings. Instead, create new variables for these bindings
   * with the value `undefined`.
   *
   * @default false
   */
  shimMissingExports?: boolean | null | undefined

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
   * Whether to include the 'use strict' pragma at the top of generated non-ES
   * bundles.
   *
   * > 👉 **Note**: ES modules are *always* in strict mode, so this shouldn't
   * > be disabled without good reason.
   *
   * @default true
   */
  strict?: boolean | null | undefined

  /**
   * Throw an error instead of showing a warning when a deprecated feature is
   * used.
   *
   * @default true
   */
  strictDeprecations?: boolean | null | undefined

  /**
   * Whether to replace empty setter functions with `null` when outputting the
   * `system` module format.
   *
   * > 👉 **Note**: This is incompatible with SystemJS before `v6.3.3`.
   * > Deactivate this option to output empty functions instead that older
   * > SystemJS versions support.
   *
   * @default true
   */
  systemNullSetters?: boolean | null | undefined

  /**
   * Whether to apply tree-shaking and to fine-tune the tree-shaking process.
   *
   * > 👉 **Note**: Setting this option to `false` will produce bigger bundles,
   * > but may improve build performance.
   *
   * @see {@linkcode TreeshakeOption}
   *
   * @default true
   */
  treeshake?: TreeshakeOption | null | undefined

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
