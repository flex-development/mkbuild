/**
 * @file Internal - createContext
 * @module mkbuild/internal/createContext
 */

import type { Context, SourceFile, Task } from '#src/interfaces'
import * as mkp from '#src/plugins'
import type { FileSystemAdapter } from '#src/types'
import fsa from '#src/utils/fs'
import IGNORE_PATTERNS from '#src/utils/ignore-patterns'
import loaders from '#src/utils/loaders'
import { EXT_DTS_REGEX } from '@flex-development/ext-regex'
import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import { isString, isUndefined } from '@flex-development/tutils'
import * as esbuild from 'esbuild'
import regexp from 'escape-string-regexp'
import fg from 'fast-glob'
import { get, omit, shake, sift } from 'radash'
import gitignore from './gitignore'

/**
 * Creates a build context for the given build `task`.
 *
 * @todo throw if `absWorkingDir` is not a directory
 * @todo throw if `task.ext` is not a valid `OutputExtension`
 * @todo throw if `task.outdir` is not a directory
 * @todo throw if `task.source` is not a directory when not bundling
 * @todo throw if `task.source` is not a file when bundling
 *
 * @internal
 * @async
 *
 * @param {Partial<Task & { write?: boolean }>} task - Build task object
 * @param {PackageJson?} [pkg={}] - Relevant `package.json` object
 * @param {Partial<FileSystemAdapter>} [fs=fsa] - Custom file system methods
 * @return {Promise<Context>} Build context for `task`
 */
async function createContext(
  task: Partial<Task & { write?: boolean }>,
  pkg: PackageJson = {},
  fs: Partial<FileSystemAdapter> = fsa
): Promise<Context> {
  const {
    assetNames = 'assets/[name]-[hash]',
    banner = {},
    bundle = false,
    chunkNames = 'chunks/[name]-[hash]',
    clean = true,
    color = true,
    conditions = ['import', 'default'],
    cwd = '.',
    drop,
    dts = await (async () => {
      try {
        await mlly.resolveModule(
          pathe.resolve(cwd, 'node_modules', 'typescript', 'package.json')
        )
        return true
      } catch {
        return false
      }
    })(),
    external = bundle ? Object.keys(get(pkg, 'peerDependencies', {})!) : [],
    footer = {},
    format = 'esm',
    ignore = IGNORE_PATTERNS,
    inject,
    loader = {},
    logLimit = 10,
    logOverride = {},
    mainFields = ['module', 'main'],
    name = '[name]',
    outExtension = {},
    outdir = 'dist',
    pattern = '**',
    pure,
    platform = 'neutral',
    plugins = [],
    resolveExtensions = mlly.RESOLVE_EXTENSIONS,
    source = bundle ? 'src/index' : 'src',
    target,
    tsconfig,
    write = false,
    createRequire = bundle && format === 'esm' && platform === 'node',
    ext = format === 'cjs' ? '.cjs' : format === 'esm' ? '.mjs' : '.js',
    outbase = bundle ? pathe.dirname(source) : source,
    ...options
  } = task

  /**
   * Absolute path to current working directory.
   *
   * @const {string} absWorkingDir
   */
  const absWorkingDir: string = pathe.resolve(cwd)

  /**
   * Relative paths to source files.
   *
   * **Note**: Files are relative to {@linkcode source} when {@linkcode bundle}
   * is `false`. When enabled, files are relative to {@linkcode absWorkingDir}.
   *
   * @const {string[]} files
   */
  const files: string[] = await fg(
    bundle
      ? (!pathe.extname(source) && source + '.*') || /* c8 ignore next */ source
      : isString(pattern)
      ? pattern
      : [...new Set<string>(pattern)],
    {
      absolute: false,
      braceExpansion: true,
      caseSensitiveMatch: true,
      cwd: pathe.join(absWorkingDir, bundle ? '' : source),
      dot: true,
      extglob: true,
      fs: omit(fs, ['readdir']),
      globstar: true,
      ignore: [
        ...IGNORE_PATTERNS,
        ...new Set([...(await gitignore(absWorkingDir)), ...ignore])
      ],
      objectMode: false,
      onlyFiles: true,
      stats: false,
      throwErrorOnBrokenSymbolicLink: false,
      unique: true
    }
  )

  /**
   * Boolean indicating if module specifiers should be fully specified.
   *
   * @const {boolean} fill
   */
  const fill: boolean =
    format === 'esm' || ['.cjs', '.mjs'].some(e => ext.endsWith(e))

  // remove unsupported options that are not overridden
  Reflect.deleteProperty(options, 'incremental')
  Reflect.deleteProperty(options, 'outfile')
  Reflect.deleteProperty(options, 'stdin')
  Reflect.deleteProperty(options, 'watch')

  return esbuild.context(
    shake({
      ...options,
      absWorkingDir,
      allowOverwrite: false,
      assetNames,
      banner,
      bundle,
      chunkNames,
      color,
      conditions: [...new Set(conditions)],
      drop: [...new Set(drop)],
      entryNames: `[dir]/${name}`,
      entryPoints: files
        .map((file: string): SourceFile => {
          return {
            ext: pathe.extname(file) as pathe.Ext,
            file:
              bundle && outbase !== '.'
                ? // outbase support for bundles (esbuild only uses outbase for
                  // multiple entries); https://esbuild.github.io/api/#outbase
                  file
                    .replace(new RegExp(`^${regexp(outbase)}`), '')
                    .replace(/^\//, '')
                : file,
            path: pathe.join(absWorkingDir, source, bundle ? '' : file)
          }
        })
        .map((sourcefile: SourceFile): string => {
          return pathe.join(bundle ? outbase : source, sourcefile.file)
        }),
      external: bundle
        ? [
            ...new Set([
              ...Object.keys(get(pkg, 'peerDependencies', {})!),
              ...external
            ])
          ]
        : [],
      footer,
      format,
      inject: [...new Set(inject)],
      loader: { ...loaders(format, bundle), ...loader },
      logLimit,
      logOverride,
      mainFields: [...new Set(mainFields)],
      metafile: true,
      outExtension: { ...outExtension, '.js': pathe.formatExt(ext) },
      outbase,
      outdir,
      platform,
      plugins: sift([
        mkp.pkgtype(pkg),
        clean && mkp.clean(fs),
        createRequire && mkp.createRequire(),
        dts !== false && mkp.dts(),
        !!tsconfig && mkp.decorators(),
        !!tsconfig && mkp.tsconfigPaths(),
        fill && mkp.fullySpecified(),
        ...plugins,
        mkp.filter(dts === 'only' ? EXT_DTS_REGEX : undefined),
        write && mkp.write(fs)
      ]) as esbuild.Plugin[],
      pure: [...new Set(pure)],
      resolveExtensions: [...new Set(resolveExtensions)].map(ext => {
        return pathe.formatExt(ext)
      }),
      target: isUndefined(target)
        ? undefined
        : isString(target)
        ? target
        : [...new Set(target)],
      tsconfig,
      write: false
    })
  )
}

export default createContext
