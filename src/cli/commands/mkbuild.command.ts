/**
 * @file CLI Commands - MkbuildCommand
 * @module mkbuild/cli/commands/mkbuild
 */

import pkg from '#pkg' assert { type: 'json' }
import type { Opts } from '#src/cli/interfaces'
import make from '#src/make'
import type {
  GeneratedFileType,
  Jsx,
  LegalComments,
  OutputExtension,
  Sourcemap
} from '#src/types'
import { IGNORE_PATTERNS, loaders } from '#src/utils'
import * as mlly from '@flex-development/mlly'
import {
  CliUtilityService,
  Command,
  CommandRunner,
  HelpService,
  Option
} from '@flex-development/nest-commander'
import type * as commander from '@flex-development/nest-commander/commander'
import * as pathe from '@flex-development/pathe'
import {
  DOT,
  cast,
  construct,
  entries,
  ifelse,
  isBooleanish,
  join,
  keys,
  set,
  type EmptyObject
} from '@flex-development/tutils'
import type * as esbuild from 'esbuild'

/**
 * `mkbuild` command model.
 *
 * @todo `--allow-overwrite`
 * @todo `--serve.onrequest`
 *
 * @class
 * @extends {CommandRunner}
 */
@Command({
  description: pkg.description,
  examples: [],
  name: pkg.name.replace(/.*\//, ''),
  root: true
})
class MkbuildCommand extends CommandRunner {
  /**
   * Creates a new `mkbuild` command instance.
   *
   * @param {HelpService} help - Help service instance
   * @param {CliUtilityService} util - Utilities service instance
   */
  constructor(
    protected readonly help: HelpService,
    protected readonly util: CliUtilityService
  ) {
    super()
  }

  /**
   * Parses the `--alias` flag.
   *
   * @see {@linkcode Opts.alias}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<string, string>} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#alias',
    flags: '--alias <list>'
  })
  protected parseAlias(val: string): Record<string, string> {
    return this.util.parseObject(val)
  }

  /**
   * Parses the `--asset-names` flag.
   *
   * @see {@linkcode Opts.assetNames}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#asset-names',
    fallback: { value: 'assets/[name]-[hash]' },
    flags: '--asset-names <template>'
  })
  protected parseAssetNames(val: string): string {
    return val
  }

  /**
   * Parses the `--banner` flag.
   *
   * @see {@linkcode Opts.banner}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {EmptyObject | Record<GeneratedFileType, string>} Parsed option
   * value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#banner',
    flags: '--banner <list>'
  })
  protected parseBanner(
    val: string
  ): EmptyObject | { [K in GeneratedFileType]: string } {
    return this.util.parseObject<GeneratedFileType, string>(val)
  }

  /**
   * Parses the `--bundle` flag.
   *
   * @see {@linkcode Opts.bundle}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#bundle',
    fallback: { value: false },
    flags: '-b, --bundle [choice]',
    preset: 'true'
  })
  protected parseBundle(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--charset` flag.
   *
   * @see {@linkcode Opts.charset}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {esbuild.Charset} Parsed option value
   */
  @Option({
    choices: ['ascii', 'utf8'],
    description: 'https://esbuild.github.io/api/#charset',
    flags: '--charset <charset>'
  })
  protected parseCharset(val: string): esbuild.Charset {
    return cast<esbuild.Charset>(val)
  }

  /**
   * Parses the `--chunk-names` flag.
   *
   * @see {@linkcode Opts.chunkNames}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#chunk-names',
    fallback: { value: 'chunks/[name]-[hash]' },
    flags: '--chunk-names <template>'
  })
  protected parseChunkNames(val: string): string {
    return val
  }

  /**
   * Parses the `--clean` flag.
   *
   * @see {@linkcode Opts.clean}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'Remove output directories before starting build',
    fallback: { value: true },
    flags: '-c, --clean [choice]',
    preset: 'true'
  })
  protected parseClean(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--color` flag.
   *
   * @see {@linkcode Opts.color}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#color',
    env: 'NO_COLOR',
    fallback: { value: true },
    flags: '--color [choice]',
    preset: 'true'
  })
  protected parseColor(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--conditions` flag.
   *
   * @see {@linkcode Opts.conditions}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Set<string>} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#conditions',
    fallback: { description: 'import,default', value: ['import', 'default'] },
    flags: '--conditions <list>'
  })
  protected parseConditions(val: string): Set<string> {
    return this.util.parseList(val)
  }

  /**
   * Parses the `--create-require` flag.
   *
   * @see {@linkcode Opts.createRequire}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'Insert `require` function definition',
    flags: '--create-require [choice]',
    preset: 'true'
  })
  protected parseCreateRequire(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--cwd` flag.
   *
   * @see {@linkcode Opts.cwd}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'Current working directory',
    fallback: { value: DOT },
    flags: '--cwd <directory>'
  })
  protected parseCwd(val: string): string {
    return val
  }

  /**
   * Parses the `--define` flag.
   *
   * @see {@linkcode Opts.define}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<string, string>} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#define',
    flags: '--define <list>'
  })
  protected parseDefine(val: string): Record<string, string> {
    return this.util.parseObject(val)
  }

  /**
   * Parses the `--drop` flag.
   *
   * @see {@linkcode Opts.drop}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string[]} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#drop',
    flags: '--drop <list>'
  })
  protected parseDrop(val: string): string[] {
    return [...this.util.parseList(val)]
  }

  /**
   * Parses the `--dts` flag.
   *
   * @see {@linkcode Opts.dts}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean | 'only'} Parsed option value
   */
  @Option({
    choices: ['only', ...CliUtilityService.BOOLEAN_CHOICES],
    description: 'Generate TypeScript declaration files',
    flags: '-d, --dts [choice]',
    preset: 'true'
  })
  protected parseDts(val: string): boolean | 'only' {
    return val === 'only' ? val : this.util.parseBoolean(val)
  }

  /**
   * Parses the `--ext` flag.
   *
   * @see {@linkcode Opts.ext}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {OutputExtension} Parsed option value
   * @throws {Error}
   */
  @Option({
    choices: [
      '.cjs',
      '.js',
      '.mjs',
      '.min.cjs',
      '.min.js',
      '.min.mjs',
      'cjs',
      'js',
      'mjs',
      'min.cjs',
      'min.js',
      'min.mjs'
    ],
    description: 'Output file extension',
    flags: '-e, --ext <ext>'
  })
  protected parseExt(val: string): OutputExtension {
    return cast<OutputExtension>(val)
  }

  /**
   * Parses the `--external` flag.
   *
   * @see {@linkcode Opts.external}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string[]} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#external',
    flags: '--external <list>'
  })
  protected parseExternal(val: string): string[] {
    return [...this.util.parseList(val)]
  }

  /**
   * Parses the `--footer` flag.
   *
   * @see {@linkcode Opts.footer}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {EmptyObject | Record<GeneratedFileType, string>} Parsed option
   * value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#footer',
    flags: '--footer <list>'
  })
  protected parseFooter(
    val: string
  ): EmptyObject | { [K in GeneratedFileType]: string } {
    return this.util.parseObject<GeneratedFileType, string>(val)
  }

  /**
   * Parses the `--format` flag.
   *
   * @see {@linkcode Opts.format}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {esbuild.Format} Parsed option value
   * @throws {Error}
   */
  @Option({
    choices: ['cjs', 'esm', 'iife'],
    description: 'Output file format',
    fallback: { value: 'esm' },
    flags: '-f, --format <format>'
  })
  protected parseFormat(val: string): esbuild.Format {
    return cast<esbuild.Format>(val)
  }

  /**
   * Parses the `--global-name` flag.
   *
   * @see {@linkcode Opts.globalName}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#global-name',
    flags: '--global-name <name>'
  })
  protected parseGlobalName(val: string): string {
    return val
  }

  /**
   * Parses the `--ignore` flag.
   *
   * @see {@linkcode Opts.ignore}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Set<string>} Parsed option value
   */
  @Option({
    description: 'Glob patterns to exclude matches in --pattern',
    fallback: {
      description: JSON.stringify(join([...IGNORE_PATTERNS], ', ')),
      value: [...IGNORE_PATTERNS]
    },
    flags: '-i, --ignore <list>'
  })
  protected parseIgnore(val: string): Set<string> {
    return this.util.parseList(val)
  }

  /**
   * Parses the `--ignore-annotations` flag.
   *
   * @see {@linkcode Opts.ignoreAnnotations}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#ignore-annotations',
    fallback: { value: false },
    flags: '--ignore-annotations [choice]',
    preset: 'true'
  })
  protected parseIgnoreAnnotations(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--inject` flag.
   *
   * @see {@linkcode Opts.inject}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string[]} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#inject',
    flags: '--inject <list>'
  })
  protected parseInject(val: string): string[] {
    return [...this.util.parseList(val)]
  }

  /**
   * Parses the `--jsx` flag.
   *
   * @see {@linkcode Opts.jsx}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Jsx} Parsed option value
   */
  @Option({
    choices: ['automatic', 'preserve', 'transform'],
    description: 'https://esbuild.github.io/api/#jsx',
    flags: '--jsx <mode>'
  })
  protected parseJsx(val: string): Jsx {
    return cast<Jsx>(val)
  }

  /**
   * Parses the `--jsx-dev` flag.
   *
   * @see {@linkcode Opts.jsxDev}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#jsx-dev',
    fallback: { value: false },
    flags: '--jsx-dev [choice]',
    implies: { jsx: 'automatic' },
    preset: 'true'
  })
  protected parseJsxDev(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--jsx-factory` flag.
   *
   * @see {@linkcode Opts.jsxFactory}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#jsx-factory',
    flags: '--jsx-factory <factory>'
  })
  protected parseJsxFactory(val: string): string {
    return val
  }

  /**
   * Parses the `--jsx-fragment` flag.
   *
   * @see {@linkcode Opts.jsxFragment}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#jsx-fragment',
    flags: '--jsx-fragment <fragment>'
  })
  protected parseJsxFragment(val: string): string {
    return val
  }

  /**
   * Parses the `--jsx-import-source` flag.
   *
   * @see {@linkcode Opts.jsxImportSource}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#jsx-import-source',
    fallback: { value: 'react' },
    flags: '--jsx-import-source <source>'
  })
  protected parseJsxImportSource(val: string): string {
    return val
  }

  /**
   * Parses the `--jsx-side-effects` flag.
   *
   * @see {@linkcode Opts.jsxSideEffects}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#jsx-side-effects',
    fallback: { value: false },
    flags: '--jsx-side-effects [choice]',
    preset: 'true'
  })
  protected parseJsxSideEffects(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--keep-names` flag.
   *
   * @see {@linkcode Opts.keepNames}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#keep-names',
    fallback: { value: false },
    flags: '--keep-names [choice]',
    preset: 'true'
  })
  protected parseKeepNames(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--legal-comments` flag.
   *
   * @see {@linkcode Opts.legalComments}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {LegalComments} Parsed option value
   */
  @Option({
    choices: ['eof', 'external', 'inline', 'linked', 'none'],
    description: 'https://esbuild.github.io/api/#legal-comments',
    flags: '--legal-comments <choice>'
  })
  protected parseLegalComments(val: string): LegalComments {
    return cast<LegalComments>(val)
  }

  /**
   * Parses the `--loader` flag.
   *
   * @see {@linkcode Opts.loader}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<pathe.Ext, esbuild.Loader>} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#loader',
    fallback: {
      description: JSON.stringify(
        join(
          entries(loaders()).map(([ext, loader]): string => {
            return `${ext}${pathe.delimiter}${loader}`
          }),
          ', '
        )
      ),
      value: loaders()
    },
    flags: '--loader <list>'
  })
  protected parseLoader(val: string): Record<pathe.Ext, esbuild.Loader> {
    return this.util.parseObject<pathe.Ext, esbuild.Loader>(val)
  }

  /**
   * Parses the `--log-level` flag.
   *
   * @see {@linkcode Opts.logLevel}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {esbuild.LogLevel} Parsed option value
   */
  @Option({
    choices: ['debug', 'error', 'info', 'silent', 'verbose', 'warning'],
    description: 'https://esbuild.github.io/api/#log-level',
    fallback: { value: 'info' },
    flags: '--log-level <level>'
  })
  protected parseLogLevel(val: string): esbuild.LogLevel {
    return cast<esbuild.LogLevel>(val)
  }

  /**
   * Parses the `--log-limit` flag.
   *
   * @see {@linkcode Opts.logLimit}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {number} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#log-limit',
    fallback: { value: 10 },
    flags: '--log-limit <limit>'
  })
  protected parseLogLimit(val: string): number {
    return this.util.parseInt(val)
  }

  /**
   * Parses the `--log-override` flag.
   *
   * @see {@linkcode Opts.logOverride}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<string, esbuild.LogLevel>} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#log-override',
    flags: '--log-override <list>'
  })
  protected parseLogOverride(val: string): Record<string, esbuild.LogLevel> {
    return this.util.parseObject<string, esbuild.LogLevel>(val)
  }

  /**
   * Parses the `--main-fields` flag.
   *
   * @see {@linkcode Opts.mainFields}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Set<string>} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#main-fields',
    fallback: { description: 'module,main', value: ['module', 'main'] },
    flags: '--main-fields <list>'
  })
  protected parseMainFields(val: string): Set<string> {
    return this.util.parseList(val)
  }

  /**
   * Parses the `--mangle-cache` flag.
   *
   * @see {@linkcode Opts.mangleCache}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<string, string | false>} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#mangle-cache',
    flags: '--mangle-cache <list>'
  })
  protected parseMangleCache(val: string): Record<string, string | false> {
    return this.util.parseObject<string, string | false>(val)
  }

  /**
   * Parses the `--mangle-props` flag.
   *
   * @see {@linkcode Opts.mangleProps}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {RegExp} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#mangle-props',
    flags: '--mangle-props <regex>'
  })
  protected parseMangleProps(val: string): RegExp {
    return this.util.parseRegExp(val)
  }

  /**
   * Parses the `--mangle-quoted` flag.
   *
   * @see {@linkcode Opts.mangleQuoted}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#mangle-quoted',
    fallback: { value: false },
    flags: '--mangle-quoted [choice]',
    preset: 'true'
  })
  protected parseMangleQuoted(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--minify` flag.
   *
   * @see {@linkcode Opts.minify}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#minify',
    fallback: { value: false },
    flags: '--minify [choice]',
    preset: 'true'
  })
  protected parseMinify(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--minify-identifiers` flag.
   *
   * @see {@linkcode Opts.minifyIdentifiers}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#minify-identifiers',
    fallback: { value: false },
    flags: '--minify-identifiers [choice]',
    preset: 'true'
  })
  protected parseMinifyIdentifiers(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--minify-syntax` flag.
   *
   * @see {@linkcode Opts.minifySyntax}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#minify-syntax',
    fallback: { value: false },
    flags: '--minify-syntax [choice]',
    preset: 'true'
  })
  protected parseMinifySyntax(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--minify-whitespace` flag.
   *
   * @see {@linkcode Opts.minifyWhitespace}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#minify-whitespace',
    fallback: { value: false },
    flags: '--minify-whitespace [choice]',
    preset: 'true'
  })
  protected parseMinifyWhitespace(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--name` flag.
   *
   * @see {@linkcode Opts.name}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'Bundle output file name',
    fallback: { value: '[name]' },
    flags: '-n, --name <name>'
  })
  protected parseName(val: string): string {
    return val
  }

  /**
   * Parses the `--out-extension` flag.
   *
   * @see {@linkcode Opts.outExtension}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<pathe.Ext, pathe.Ext>} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#out-extension',
    flags: '--out-extension <list>'
  })
  protected parseOutExtension(val: string): Record<pathe.Ext, pathe.Ext> {
    return this.util.parseObject<pathe.Ext, pathe.Ext>(val)
  }

  /**
   * Parses the `--outbase` flag.
   *
   * @see {@linkcode Opts.outbase}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#outbase',
    flags: '--outbase <directory>'
  })
  protected parseOutbase(val: string): string {
    return val
  }

  /**
   * Parses the `--outdir` flag.
   *
   * @see {@linkcode Opts.outdir}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'Output directory',
    fallback: { value: 'dist' },
    flags: '-o, --outdir <directory>'
  })
  protected parseOutdir(val: string): string {
    return val
  }

  /**
   * Parses the `--packages` flag.
   *
   * @see {@linkcode Opts.packages}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    choices: ['external'],
    description: 'https://esbuild.github.io/api/#packages',
    flags: '--packages <choice>'
  })
  protected parsePackages(val: string): string {
    return val
  }

  /**
   * Parses the `--pattern` flag.
   *
   * @see {@linkcode Opts.pattern}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Set<string>} Parsed option value
   */
  @Option({
    description: 'Glob patterns matching source files',
    fallback: { value: '**' },
    flags: '-p, --pattern <list>'
  })
  protected parsePattern(val: string): Set<string> {
    return this.util.parseList(val)
  }

  /**
   * Parses the `--platform` flag.
   *
   * @see {@linkcode Opts.platform}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {esbuild.Platform} Parsed option value
   */
  @Option({
    choices: ['browser', 'neutral', 'node'],
    description: 'https://esbuild.github.io/api/#platform',
    fallback: { value: 'neutral' },
    flags: '--platform <platform>'
  })
  protected parsePlatform(val: string): esbuild.Platform {
    return cast<esbuild.Platform>(val)
  }

  /**
   * Parses the `--preserve-symlinks` flag.
   *
   * @see {@linkcode Opts.preserveSymlinks}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#preserve-symlinks',
    fallback: { value: false },
    flags: '--preserve-symlinks [choice]',
    preset: 'true'
  })
  protected parsePreserveSymlinks(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--public-path` flag.
   *
   * @see {@linkcode Opts.publicPath}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#public-path',
    flags: '--public-path <path>'
  })
  protected parsePublicPath(val: string): string {
    return val
  }

  /**
   * Parses the `--pure` flag.
   *
   * @see {@linkcode Opts.pure}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string[]} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#pure',
    flags: '--pure <list>'
  })
  protected parsePure(val: string): string[] {
    return [...this.util.parseList(val)]
  }

  /**
   * Parses the `--reserve-props` flag.
   *
   * @see {@linkcode Opts.reserveProps}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {RegExp} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#reserve-props',
    flags: '--reserve-props <regex>'
  })
  protected parseReserveProps(val: string): RegExp {
    return this.util.parseRegExp(val)
  }

  /**
   * Parses the `--resolve-extensions` flag.
   *
   * @see {@linkcode Opts.resolveExtensions}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Set<string>} Parsed option value
   */
  @Option({
    description: 'Resolvable file extensions',
    fallback: {
      description: JSON.stringify(join([...mlly.RESOLVE_EXTENSIONS])),
      value: [...mlly.RESOLVE_EXTENSIONS]
    },
    flags: '--resolve-extensions <list>'
  })
  protected parseResolveExtensions(val: string): Set<string> {
    return this.util.parseList(val)
  }

  /**
   * Parses the `--serve` flag.
   *
   * @see {@linkcode Opts.serve}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {esbuild.ServeOptions | false} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#serve',
    fallback: { value: false },
    flags: '-S, --serve [choice]',
    implies: { logLevel: 'info' },
    preset: 'true'
  })
  protected parseServe(val: string): esbuild.ServeOptions | false {
    return this.util.parseBoolean(val) && {}
  }

  /**
   * Parses the `--serve.certfile` flag.
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#serve-arguments',
    flags: '--serve.certfile <path>',
    implies: { logLevel: 'info', serve: {} }
  })
  protected parseServeCertfile(val: string): string {
    return val
  }

  /**
   * Parses the `--serve.servedir` flag.
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#serve-arguments',
    flags: '--serve.servedir <directory>',
    implies: { logLevel: 'info', serve: {} }
  })
  protected parseServeDir(val: string): string {
    return val
  }

  /**
   * Parses the `--serve.host` flag.
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#serve-arguments',
    fallback: { value: '0.0.0.0' },
    flags: '--serve.host <host>',
    implies: { logLevel: 'info', serve: {} }
  })
  protected parseServeHost(val: string): string {
    return val
  }

  /**
   * Parses the `--serve.keyfile` flag.
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#serve-arguments',
    flags: '--serve.keyfile <path>',
    implies: { logLevel: 'info', serve: {} }
  })
  protected parseServeKeyfile(val: string): string {
    return val
  }

  /**
   * Parses the `--serve.port` flag.
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {number} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#serve-arguments',
    flags: '--serve.port <port>',
    implies: { logLevel: 'info', serve: {} }
  })
  protected parseServePort(val: string): number {
    return this.util.parseInt(val)
  }

  /**
   * Parses the `--source` flag.
   *
   * @see {@linkcode Opts.source}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description:
      'Directory containing source files or relative path to bundle input',
    flags: '-s, --source <path>'
  })
  protected parseSource(val: string): string {
    return val
  }

  /**
   * Parses the `--source-root` flag.
   *
   * @see {@linkcode Opts.sourceRoot}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#source-root',
    flags: '--source-root <root>'
  })
  protected parseSourceRoot(val: string): string {
    return val
  }

  /**
   * Parses the `--sourcemap` flag.
   *
   * @see {@linkcode Opts.sourcemap}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Sourcemap | boolean} Parsed option value
   */
  @Option({
    choices: ['false', 'true', 'both', 'external', 'inline', 'linked'],
    description: 'https://esbuild.github.io/api/#sourcemap',
    fallback: { value: false },
    flags: '--sourcemap [choice]',
    preset: 'true'
  })
  protected parseSourcemap(val: string): Sourcemap | boolean {
    return ifelse(
      isBooleanish(val),
      this.util.parseBoolean(val),
      cast<Sourcemap>(val)
    )
  }

  /**
   * Parses the `--sources-content` flag.
   *
   * @see {@linkcode Opts.sourcesContent}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#sources-content',
    fallback: { value: false },
    flags: '--sources-content [choice]',
    preset: 'true'
  })
  protected parseSourcesContent(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--splitting` flag.
   *
   * @see {@linkcode Opts.splitting}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#splitting',
    fallback: { value: false },
    flags: '--splitting [choice]',
    preset: 'true'
  })
  protected parseSplitting(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--supported` flag.
   *
   * @see {@linkcode Opts.supported}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<string, boolean>} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#supported',
    flags: '--supported <list>'
  })
  protected parseSupported(val: string): Record<string, boolean> {
    return this.util.parseObject<string, boolean>(val)
  }

  /**
   * Parses the `--target` flag.
   *
   * @see {@linkcode Opts.target}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string[]} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#target',
    flags: '--target <list>'
  })
  protected parseTarget(val: string): string[] {
    return [...this.util.parseList(val)]
  }

  /**
   * Parses the `--tree-shaking` flag.
   *
   * @see {@linkcode Opts.treeShaking}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'https://esbuild.github.io/api/#tree-shaking',
    flags: '--tree-shaking [choice]',
    preset: 'true'
  })
  protected parseTreeShaking(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--tsconfig` flag.
   *
   * @see {@linkcode Opts.tsconfig}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#tsconfig',
    flags: '--tsconfig <tsconfig>'
  })
  protected parseTsconfig(val: string): string {
    return val
  }

  /**
   * Parses the `--watch` flag.
   *
   * @see {@linkcode Opts.watch}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CliUtilityService.BOOLEAN_CHOICES,
    description: 'Watch files',
    fallback: { value: false },
    flags: '-w, --watch [choice]',
    preset: 'true'
  })
  protected parseWatch(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Command runner.
   *
   * @public
   * @async
   *
   * @param {string[]} args - Parsed command arguments
   * @param {Opts} opts - Parsed command options
   * @return {Promise<void>} Nothing when complete
   */
  public async run(args: string[], opts: Opts): Promise<void> {
    // remove defaults to prevent accidental config file option override
    for (const key of keys<Opts>(opts)) {
      if (this.command.getOptionValueSource(key) !== 'default') continue
      Reflect.deleteProperty(opts, key)
    }

    // run make
    return void (await make(cast(construct(set(opts, 'write', true)))))
  }

  /**
   * Set the current command.
   *
   * @see {@linkcode command}
   *
   * @public
   * @override
   *
   * @param {commander.Command} cmd - New command instance
   * @return {this} `this` command runner
   */
  public override setCommand(cmd: commander.Command): this {
    cmd.showHelpAfterError()
    return super.setCommand(cmd)
  }
}

export default MkbuildCommand
