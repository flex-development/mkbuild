/**
 * @file CLI Commands - MkbuildCommand
 * @module mkbuild/cli/commands/mkbuild
 */

import pkg from '#pkg' assert { type: 'json' }
import { CHOICES_BOOLEAN, CLI_NAME } from '#src/cli/constants'
import { HelpService, UtilityService } from '#src/cli/providers'
import type { Flags } from '#src/interfaces'
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
import type * as pathe from '@flex-development/pathe'
import { Inject } from '@nestjs/common'
import { Command } from 'commander'
import consola from 'consola'
import type * as esbuild from 'esbuild'
import {
  CommandRunner,
  Option,
  OptionChoiceFor,
  RootCommand
} from 'nest-commander'
import { set, shake } from 'radash'

/**
 * `mkbuild` command model.
 *
 * @class
 * @extends {CommandRunner}
 */
@RootCommand({ description: pkg.description, name: CLI_NAME })
class MkbuildCommand extends CommandRunner {
  /**
   * Creates a new `mkbuild` command instance.
   *
   * @param {HelpService} help - Help service instance
   * @param {UtilityService} util - CLI utilities service instance
   */
  constructor(
    @Inject(HelpService) protected readonly help: HelpService,
    @Inject(UtilityService) protected readonly util: UtilityService
  ) {
    super()
  }

  /**
   * Returns an array containing `--charset` flag choices.
   *
   * @see {@linkcode esbuild.Charset}
   *
   * @protected
   *
   * @return {esbuild.Charset[]} `--charset` flag choices
   */
  @OptionChoiceFor({ name: 'charset' })
  protected choicesCharset(): esbuild.Charset[] {
    return ['ascii', 'utf8']
  }

  /**
   * Returns an array containing `--ext` flag choices.
   *
   * @see {@linkcode OutputExtension}
   *
   * @protected
   *
   * @return {OutputExtension[]} `--ext` flag choices
   */
  @OptionChoiceFor({ name: 'ext' })
  protected choicesExt(): OutputExtension[] {
    return [
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
    ]
  }

  /**
   * Returns an array containing `--format` flag choices.
   *
   * @see {@linkcode esbuild.Format}
   *
   * @protected
   *
   * @return {esbuild.Format[]} `--format` flag choices
   */
  @OptionChoiceFor({ name: 'format' })
  protected choicesFormat(): esbuild.Format[] {
    return ['cjs', 'esm', 'iife']
  }

  /**
   * Returns an array containing `--jsx` flag choices.
   *
   * @see {@linkcode Jsx}
   *
   * @protected
   *
   * @return {Jsx[]} `--jsx` flag choices
   */
  @OptionChoiceFor({ name: 'jsx' })
  protected choicesJsx(): Jsx[] {
    return ['automatic', 'preserve', 'transform']
  }

  /**
   * Returns an array containing `--legal-comments` flag choices.
   *
   * @see {@linkcode LegalComments}
   *
   * @protected
   *
   * @return {LegalComments[]} `--legal-comments` flag choices
   */
  @OptionChoiceFor({ name: 'legalComments' })
  protected choicesLegalComments(): LegalComments[] {
    return ['eof', 'external', 'inline', 'linked', 'none']
  }

  /**
   * Returns an array containing `--log-level` flag choices.
   *
   * @see {@linkcode esbuild.LogLevel}
   *
   * @protected
   *
   * @return {esbuild.LogLevel[]} `--log-level` flag choices
   */
  @OptionChoiceFor({ name: 'logLevel' })
  protected choicesLogLevel(): esbuild.LogLevel[] {
    return ['debug', 'error', 'info', 'silent', 'verbose', 'warning']
  }

  /**
   * Returns an array containing `--platform` flag choices.
   *
   * @see {@linkcode esbuild.Platform}
   *
   * @protected
   *
   * @return {esbuild.Platform[]} `--platform` flag choices
   */
  @OptionChoiceFor({ name: 'platform' })
  protected choicesPlatform(): esbuild.Platform[] {
    return ['browser', 'neutral', 'node']
  }

  /**
   * Returns an array containing `--sourcemap` flag choices.
   *
   * @see {@linkcode esbuild.BuildOptions.sourcemap}
   *
   * @protected
   *
   * @return {(Sourcemap | 'false' | 'true')[]} `--sourcemap` flag choices
   */
  @OptionChoiceFor({ name: 'sourcemap' })
  protected choicesSourcemap(): (Sourcemap | 'false' | 'true')[] {
    return ['false', 'true', 'both', 'external', 'inline', 'linked']
  }

  /**
   * Parses the `--alias` flag.
   *
   * @see {@linkcode Flags.alias}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<string, string>} Parsed option value
   */
  @Option({
    defaultValue: {},
    description: 'https://esbuild.github.io/api/#alias',
    flags: '--alias <list>',
    name: 'alias'
  })
  protected parseAlias(val: string): Record<string, string> {
    return this.util.parseObject(val)
  }

  /**
   * Parses the `--asset-names` flag.
   *
   * @see {@linkcode Flags.assetNames}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    defaultValue: 'assets/[name]-[hash]',
    description: 'https://esbuild.github.io/api/#asset-names',
    flags: '--asset-names <template>',
    name: 'assetNames'
  })
  protected parseAssetNames(val: string): string {
    return val
  }

  /**
   * Parses the `--banner` flag.
   *
   * @see {@linkcode Flags.banner}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Partial<Record<GeneratedFileType, string>>} Parsed option value
   */
  @Option({
    defaultValue: {},
    description: 'https://esbuild.github.io/api/#banner',
    flags: '--banner <list>',
    name: 'banner'
  })
  protected parseBanner(val: string): { [K in GeneratedFileType]?: string } {
    return this.util.parseObject<GeneratedFileType>(val)
  }

  /**
   * Parses the `--bundle` flag.
   *
   * @see {@linkcode Flags.bundle}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#bundle',
    flags: '-b, --bundle [choice]',
    name: 'bundle'
  })
  protected parseBundle(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--charset` flag.
   *
   * @see {@linkcode Flags.charset}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {esbuild.Charset} Parsed option value
   */
  @Option({
    choices: true,
    description: 'https://esbuild.github.io/api/#charset',
    flags: '--charset <charset>',
    name: 'charset'
  })
  protected parseCharset(val: string): esbuild.Charset {
    return this.util.parseString<esbuild.Charset>(val)
  }

  /**
   * Parses the `--chunk-names` flag.
   *
   * @see {@linkcode Flags.chunkNames}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    defaultValue: 'chunks/[name]-[hash]',
    description: 'https://esbuild.github.io/api/#chunk-names',
    flags: '--chunk-names <template>',
    name: 'chunkNames'
  })
  protected parseChunkNames(val: string): string {
    return val
  }

  /**
   * Parses the `--clean` flag.
   *
   * @see {@linkcode Flags.clean}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: true,
    description: 'Remove output directories before starting build',
    flags: '-c, --clean [choice]',
    name: 'clean'
  })
  protected parseClean(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--color` flag.
   *
   * @see {@linkcode Flags.color}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: true,
    description: 'https://esbuild.github.io/api/#color',
    flags: '--color [choice]',
    name: 'color'
  })
  protected parseColor(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--conditions` flag.
   *
   * @see {@linkcode Flags.conditions}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Set<string>} Parsed option value
   */
  @Option({
    defaultValue: ['import', 'default'],
    description: 'https://esbuild.github.io/api/#conditions',
    flags: '--conditions <list>',
    name: 'conditions'
  })
  protected parseConditions(val: string): Set<string> {
    return this.util.parseList(val)
  }

  /**
   * Parses the `--create-require` flag.
   *
   * @see {@linkcode Flags.createRequire}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    description: 'Insert `require` function definition',
    flags: '--create-require [choice]',
    name: 'createRequire'
  })
  protected parseCreateRequire(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--cwd` flag.
   *
   * @see {@linkcode Flags.cwd}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    defaultValue: '.',
    description: 'Current working directory',
    flags: '--cwd <directory>',
    name: 'cwd'
  })
  protected parseCwd(val: string): string {
    return val
  }

  /**
   * Parses the `--define` flag.
   *
   * @see {@linkcode Flags.define}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<string, string>} Parsed option value
   */
  @Option({
    defaultValue: {},
    description: 'https://esbuild.github.io/api/#define',
    flags: '--define <list>',
    name: 'define'
  })
  protected parseDefine(val: string): Record<string, string> {
    return this.util.parseObject(val)
  }

  /**
   * Parses the `--drop` flag.
   *
   * @see {@linkcode Flags.drop}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string[]} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#drop',
    flags: '--drop <list>',
    name: 'drop'
  })
  protected parseDrop(val: string): string[] {
    return [...this.util.parseList(val)]
  }

  /**
   * Parses the `--dts` flag.
   *
   * @see {@linkcode Flags.dts}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean | 'only'} Parsed option value
   */
  @Option({
    choices: ['only', ...CHOICES_BOOLEAN],
    description: 'Generate TypeScript declaration files',
    flags: '-d, --dts [choice]',
    name: 'dts'
  })
  protected parseDts(val: string): boolean | 'only' {
    return val === 'only' ? val : this.util.parseBoolean(val)
  }

  /**
   * Parses the `--ext` flag.
   *
   * @see {@linkcode Flags.ext}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {OutputExtension} Parsed option value
   * @throws {Error}
   */
  @Option({
    choices: true,
    description: 'Output file extension',
    flags: '-e, --ext <ext>',
    name: 'ext'
  })
  protected parseExt(val: string): OutputExtension {
    return this.util.parseString<OutputExtension>(val)
  }

  /**
   * Parses the `--external` flag.
   *
   * @see {@linkcode Flags.external}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string[]} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#external',
    flags: '--external <list>',
    name: 'external'
  })
  protected parseExternal(val: string): string[] {
    return [...this.util.parseList(val)]
  }

  /**
   * Parses the `--footer` flag.
   *
   * @see {@linkcode Flags.footer}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Partial<Record<GeneratedFileType, string>>} Parsed option value
   */
  @Option({
    defaultValue: {},
    description: 'https://esbuild.github.io/api/#footer',
    flags: '--footer <list>',
    name: 'footer'
  })
  protected parseFooter(val: string): { [K in GeneratedFileType]?: string } {
    return this.util.parseObject<GeneratedFileType>(val)
  }

  /**
   * Parses the `--format` flag.
   *
   * @see {@linkcode Flags.format}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {esbuild.Format} Parsed option value
   * @throws {Error}
   */
  @Option({
    choices: true,
    defaultValue: 'esm',
    description: 'Output file format',
    flags: '-f, --format <format>',
    name: 'format'
  })
  protected parseFormat(val: string): esbuild.Format {
    return this.util.parseString<esbuild.Format>(val)
  }

  /**
   * Parses the `--global-name` flag.
   *
   * @see {@linkcode Flags.globalName}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#global-name',
    flags: '--global-name <name>',
    name: 'globalName'
  })
  protected parseGlobalName(val: string): string {
    return val
  }

  /**
   * Parses the `--help` flag.
   *
   * @see {@linkcode Flags.help}
   *
   * @protected
   *
   * @return {true} Option value
   */
  @Option({
    description: 'Display this message',
    flags: '-h, --help',
    name: 'help'
  })
  protected parseHelp(): true {
    return true
  }

  /**
   * Parses the `--ignore` flag.
   *
   * @see {@linkcode Flags.ignore}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Set<string>} Parsed option value
   */
  @Option({
    defaultValue: [...IGNORE_PATTERNS],
    description: 'Glob patterns to exclude matches in --pattern',
    flags: '-i, --ignore <list>',
    name: 'ignore'
  })
  protected parseIgnore(val: string): Set<string> {
    return this.util.parseList(val)
  }

  /**
   * Parses the `--ignore-annotations` flag.
   *
   * @see {@linkcode Flags.ignoreAnnotations}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#ignore-annotations',
    flags: '--ignore-annotations [choice]',
    name: 'ignoreAnnotations'
  })
  protected parseIgnoreAnnotations(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--inject` flag.
   *
   * @see {@linkcode Flags.inject}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string[]} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#inject',
    flags: '--inject <list>',
    name: 'inject'
  })
  protected parseInject(val: string): string[] {
    return [...this.util.parseList(val)]
  }

  /**
   * Parses the `--jsx` flag.
   *
   * @see {@linkcode Flags.jsx}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Jsx} Parsed option value
   */
  @Option({
    choices: true,
    description: 'https://esbuild.github.io/api/#jsx',
    flags: '--jsx <mode>',
    name: 'jsx'
  })
  protected parseJsx(val: string): Jsx {
    return this.util.parseString<Jsx>(val)
  }

  /**
   * Parses the `--jsx-dev` flag.
   *
   * @see {@linkcode Flags.jsxDev}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    description: 'https://esbuild.github.io/api/#jsx-dev',
    flags: '--jsx-dev [choice]',
    name: 'jsxDev'
  })
  protected parseJsxDev(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--jsx-factory` flag.
   *
   * @see {@linkcode Flags.jsxFactory}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#jsx-factory',
    flags: '--jsx-factory <factory>',
    name: 'jsxFactory'
  })
  protected parseJsxFactory(val: string): string {
    return val
  }

  /**
   * Parses the `--jsx-fragment` flag.
   *
   * @see {@linkcode Flags.jsxFragment}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#jsx-fragment',
    flags: '--jsx-fragment <fragment>',
    name: 'jsxFragment'
  })
  protected parseJsxFragment(val: string): string {
    return val
  }

  /**
   * Parses the `--jsx-import-source` flag.
   *
   * @see {@linkcode Flags.jsxImportSource}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    defaultValue: 'react',
    description: 'https://esbuild.github.io/api/#jsx-import-source',
    flags: '--jsx-import-source <source>',
    name: 'jsxImportSource'
  })
  protected parseJsxImportSource(val: string): string {
    return val
  }

  /**
   * Parses the `--jsx-side-effects` flag.
   *
   * @see {@linkcode Flags.jsxSideEffects}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    description: 'https://esbuild.github.io/api/#jsx-side-effects',
    flags: '--jsx-side-effects [choice]',
    name: 'jsxSideEffects'
  })
  protected parseJsxSideEffects(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--keep-names` flag.
   *
   * @see {@linkcode Flags.keepNames}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#keep-names',
    flags: '--keep-names [choice]',
    name: 'keepNames'
  })
  protected parseKeepNames(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--legal-comments` flag.
   *
   * @see {@linkcode Flags.legalComments}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {LegalComments} Parsed option value
   */
  @Option({
    choices: true,
    description: 'https://esbuild.github.io/api/#legal-comments',
    flags: '--legal-comments <choice>',
    name: 'legalComments'
  })
  protected parseLegalComments(val: string): LegalComments {
    return this.util.parseString<LegalComments>(val)
  }

  /**
   * Parses the `--loader` flag.
   *
   * @see {@linkcode Flags.loader}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<pathe.Ext, esbuild.Loader>} Parsed option value
   */
  @Option({
    defaultValue: loaders(),
    description: 'https://esbuild.github.io/api/#loader',
    flags: '--loader <list>',
    name: 'loader'
  })
  protected parseLoader(val: string): Record<pathe.Ext, esbuild.Loader> {
    return this.util.parseObject<pathe.Ext, esbuild.Loader>(val)
  }

  /**
   * Parses the `--log-level` flag.
   *
   * @see {@linkcode Flags.logLevel}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {esbuild.LogLevel} Parsed option value
   */
  @Option({
    choices: true,
    defaultValue: 'info',
    description: 'https://esbuild.github.io/api/#log-level',
    flags: '--log-level <level>',
    name: 'logLevel'
  })
  protected parseLogLevel(val: string): esbuild.LogLevel {
    return this.util.parseString<esbuild.LogLevel>(val)
  }

  /**
   * Parses the `--log-limit` flag.
   *
   * @see {@linkcode Flags.logLimit}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {number} Parsed option value
   */
  @Option({
    defaultValue: 10,
    description: 'https://esbuild.github.io/api/#log-limit',
    flags: '--log-limit <limit>',
    name: 'logLimit'
  })
  protected parseLogLimit(val: string): number {
    return this.util.parseInt(val)
  }

  /**
   * Parses the `--log-override` flag.
   *
   * @see {@linkcode Flags.logOverride}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<string, esbuild.LogLevel>} Parsed option value
   */
  @Option({
    defaultValue: {},
    description: 'https://esbuild.github.io/api/#log-override',
    flags: '--log-override <list>',
    name: 'logOverride'
  })
  protected parseLogOverride(val: string): Record<string, esbuild.LogLevel> {
    return this.util.parseObject<string, esbuild.LogLevel>(val)
  }

  /**
   * Parses the `--main-fields` flag.
   *
   * @see {@linkcode Flags.mainFields}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Set<string>} Parsed option value
   */
  @Option({
    defaultValue: ['module', 'main'],
    description: 'https://esbuild.github.io/api/#main-field',
    flags: '--main-fields <list>',
    name: 'mainFields'
  })
  protected parseMainFields(val: string): Set<string> {
    return this.util.parseList(val)
  }

  /**
   * Parses the `--mangle-cache` flag.
   *
   * @see {@linkcode Flags.mangleCache}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<string, string | false>} Parsed option value
   */
  @Option({
    defaultValue: {},
    description: 'https://esbuild.github.io/api/#mangle-cache',
    flags: '--mangle-cache <list>',
    name: 'mangleCache'
  })
  protected parseMangleCache(val: string): Record<string, string | false> {
    return this.util.parseObject<string, string | false>(val)
  }

  /**
   * Parses the `--mangle-props` flag.
   *
   * @see {@linkcode Flags.mangleProps}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {RegExp} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#mangle-props',
    flags: '--mangle-props <regex>',
    name: 'mangleProps'
  })
  protected parseMangleProps(val: string): RegExp {
    return this.util.parseRegExp(val)
  }

  /**
   * Parses the `--mangle-quoted` flag.
   *
   * @see {@linkcode Flags.mangleQuoted}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#mangle-quoted',
    flags: '--mangle-quoted [choice]',
    name: 'mangleQuoted'
  })
  protected parseMangleQuoted(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--minify` flag.
   *
   * @see {@linkcode Flags.minify}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#minify',
    flags: '--minify [choice]',
    name: 'minify'
  })
  protected parseMinify(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--minify-identifiers` flag.
   *
   * @see {@linkcode Flags.minifyIdentifiers}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#minify-identifiers',
    flags: '--minify-identifiers [choice]',
    name: 'minifyIdentifiers'
  })
  protected parseMinifyIdentifiers(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--minify-syntax` flag.
   *
   * @see {@linkcode Flags.minifySyntax}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#minify-syntax',
    flags: '--minify-syntax [choice]',
    name: 'minifySyntax'
  })
  protected parseMinifySyntax(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--minify-whitespace` flag.
   *
   * @see {@linkcode Flags.minifyWhitespace}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#minify-whitespace',
    flags: '--minify-whitespace [choice]',
    name: 'minifyWhitespace'
  })
  protected parseMinifyWhitespace(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--name` flag.
   *
   * @see {@linkcode Flags.name}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    defaultValue: '[name]',
    description: 'Bundle output file name',
    flags: '-n, --name <name>',
    name: 'name'
  })
  protected parseName(val: string): string {
    return val
  }

  /**
   * Parses the `--out-extension` flag.
   *
   * @see {@linkcode Flags.outExtension}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<pathe.Ext, pathe.Ext>} Parsed option value
   */
  @Option({
    defaultValue: {},
    description: 'https://esbuild.github.io/api/#out-extension',
    flags: '--out-extension <list>',
    name: 'outExtension'
  })
  protected parseOutExtension(val: string): Record<pathe.Ext, pathe.Ext> {
    return this.util.parseObject<pathe.Ext, pathe.Ext>(val)
  }

  /**
   * Parses the `--outbase` flag.
   *
   * @see {@linkcode Flags.outbase}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#outbase',
    flags: '--outbase <directory>',
    name: 'outbase'
  })
  protected parseOutbase(val: string): string {
    return val
  }

  /**
   * Parses the `--outdir` flag.
   *
   * @see {@linkcode Flags.outdir}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    defaultValue: 'dist',
    description: 'Output directory',
    flags: '-o, --outdir <directory>',
    name: 'outdir'
  })
  protected parseOutdir(val: string): string {
    return val
  }

  /**
   * Parses the `--packages` flag.
   *
   * @see {@linkcode Flags.packages}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    choices: ['external'],
    description: 'https://esbuild.github.io/api/#packages',
    flags: '--packages <choice>',
    name: 'packages'
  })
  protected parsePackages(val: string): string {
    return val
  }

  /**
   * Parses the `--pattern` flag.
   *
   * @see {@linkcode Flags.pattern}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Set<string>} Parsed option value
   */
  @Option({
    defaultValue: '**',
    description: 'Glob patterns matching source files',
    flags: '-p, --pattern <list>',
    name: 'pattern'
  })
  protected parsePattern(val: string): Set<string> {
    return this.util.parseList(val)
  }

  /**
   * Parses the `--platform` flag.
   *
   * @see {@linkcode Flags.platform}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {esbuild.Platform} Parsed option value
   */
  @Option({
    choices: true,
    defaultValue: 'neutral',
    description: 'https://esbuild.github.io/api/#platform',
    flags: '--platform <platform>',
    name: 'platform'
  })
  protected parsePlatform(val: string): esbuild.Platform {
    return this.util.parseString<esbuild.Platform>(val)
  }

  /**
   * Parses the `--preserve-symlinks` flag.
   *
   * @see {@linkcode Flags.preserveSymlinks}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#preserve-symlinks',
    flags: '--preserve-symlinks [choice]',
    name: 'preserveSymlinks'
  })
  protected parsePreserveSymlinks(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--public-path` flag.
   *
   * @see {@linkcode Flags.publicPath}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#public-path',
    flags: '--public-path <path>',
    name: 'publicPath'
  })
  protected parsePublicPath(val: string): string {
    return val
  }

  /**
   * Parses the `--pure` flag.
   *
   * @see {@linkcode Flags.pure}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string[]} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#pure',
    flags: '--pure <list>',
    name: 'pure'
  })
  protected parsePure(val: string): string[] {
    return [...this.util.parseList(val)]
  }

  /**
   * Parses the `--reserve-props` flag.
   *
   * @see {@linkcode Flags.reserveProps}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {RegExp} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#reserve-props',
    flags: '--reserve-props <regex>',
    name: 'reserveProps'
  })
  protected parseReserveProps(val: string): RegExp {
    return this.util.parseRegExp(val)
  }

  /**
   * Parses the `--resolve-extensions` flag.
   *
   * @see {@linkcode Flags.resolveExtensions}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Set<string>} Parsed option value
   */
  @Option({
    defaultValue: [...mlly.RESOLVE_EXTENSIONS],
    description: 'Resolvable file extensions',
    flags: '--resolve-extensions <list>',
    name: 'resolveExtensions'
  })
  protected parseResolveExtensions(val: string): Set<string> {
    return this.util.parseList(val)
  }

  /**
   * Parses the `--source` flag.
   *
   * @see {@linkcode Flags.source}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description:
      'Directory containing source files or relative path to bundle input',
    flags: '-s, --source <path>',
    name: 'source'
  })
  protected parseSource(val: string): string {
    return val
  }

  /**
   * Parses the `--source-root` flag.
   *
   * @see {@linkcode Flags.sourceRoot}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#source-root',
    flags: '--source-root <root>',
    name: 'sourceRoot'
  })
  protected parseSourceRoot(val: string): string {
    return val
  }

  /**
   * Parses the `--sourcemap` flag.
   *
   * @see {@linkcode Flags.sourcemap}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Sourcemap | boolean} Parsed option value
   */
  @Option({
    choices: true,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#sourcemap',
    flags: '--sourcemap [choice]',
    name: 'sourcemap'
  })
  protected parseSourcemap(val: string): Sourcemap | boolean {
    try {
      return this.util.parseBoolean(val)
    } catch {
      return this.util.parseString<Sourcemap>(val)
    }
  }

  /**
   * Parses the `--sources-content` flag.
   *
   * @see {@linkcode Flags.sourcesContent}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#sources-content',
    flags: '--sources-content [choice]',
    name: 'sourcesContent'
  })
  protected parseSourcesContent(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--splitting` flag.
   *
   * @see {@linkcode Flags.splitting}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'https://esbuild.github.io/api/#splitting',
    flags: '--splitting [choice]',
    name: 'splitting'
  })
  protected parseSplitting(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--supported` flag.
   *
   * @see {@linkcode Flags.supported}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {Record<string, boolean>} Parsed option value
   */
  @Option({
    defaultValue: {},
    description: 'https://esbuild.github.io/api/#supported',
    flags: '--supported <list>',
    name: 'supported'
  })
  protected parseSupported(val: string): Record<string, boolean> {
    return this.util.parseObject<string, boolean>(val)
  }

  /**
   * Parses the `--target` flag.
   *
   * @see {@linkcode Flags.target}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string[]} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#target',
    flags: '--target <list>',
    name: 'target'
  })
  protected parseTarget(val: string): string[] {
    return [...this.util.parseList(val)]
  }

  /**
   * Parses the `--tree-shaking` flag.
   *
   * @see {@linkcode Flags.treeShaking}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    description: 'https://esbuild.github.io/api/#tree-shaking',
    flags: '--tree-shaking [choice]',
    name: 'treeShaking'
  })
  protected parseTreeShaking(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--tsconfig` flag.
   *
   * @see {@linkcode Flags.tsconfig}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'https://esbuild.github.io/api/#tsconfig',
    flags: '--tsconfig <tsconfig>',
    name: 'tsconfig'
  })
  protected parseTsconfig(val: string): string {
    return val
  }

  /**
   * Parses the `--version` flag.
   *
   * @see {@linkcode Flags.version}
   *
   * @protected
   *
   * @return {true} Option value
   */
  @Option({
    description: 'Print version number',
    flags: '-v, --version',
    name: 'version'
  })
  protected parseVersion(): true {
    return true
  }

  /**
   * Parses the `--watch` flag.
   *
   * @see {@linkcode Flags.watch}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    choices: CHOICES_BOOLEAN,
    defaultValue: false,
    description: 'Watch files',
    flags: '-w, --watch [choice]',
    name: 'watch'
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
   * @param {string[]} _ - Command arguments
   * @param {Flags} [flags={}] - Command options
   * @return {Promise<void>} Nothing when complete
   */
  public async run(_: string[], flags: Flags = {}): Promise<void> {
    // remove defaults to prevent accidental config file option override
    for (const key of Object.keys(flags)) {
      if (this.command.getOptionValueSource(key) !== 'default') continue
      Reflect.deleteProperty(flags, key)
    }

    // print help text and exit
    if (flags.help) return void consola.log(this.help.formatHelp(this.command))

    // print version number and exit
    if (flags.version) return void consola.log(pkg.version)

    // run make
    return void (await make(shake(set(flags, 'write', true))))
  }

  /**
   * Sets {@linkcode command}.
   *
   * @protected
   * @override
   *
   * @param {Command} cmd - CLI command instance
   * @return {this} `this`
   */
  public override setCommand(cmd: Command): this {
    cmd.addHelpCommand(false)
    cmd.allowExcessArguments()
    cmd.allowUnknownOption(false)
    cmd.createHelp = /* c8 ignore next */ () => this.help
    cmd.enablePositionalOptions()
    cmd.helpOption(false)
    cmd.showHelpAfterError()
    cmd.showSuggestionAfterError()
    this.command = cmd
    return this
  }
}

export default MkbuildCommand
