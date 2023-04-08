#!/usr/bin/env node

/**
 * @file Configuration - Changelog
 * @module config/changelog
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/git-raw-commits
 */

import { HelpService, UtilityService } from '#src/cli/providers'
import {
  Type,
  parserPreset,
  type Commit
} from '@flex-development/commitlint-config'
import pathe from '@flex-development/pathe'
import { CompareResult, isNIL } from '@flex-development/tutils'
import { Inject, Module } from '@nestjs/common'
import addStream from 'add-stream'
import { Command, CommanderError } from 'commander'
import consola from 'consola'
import conventionalChangelog from 'conventional-changelog'
import type { Options } from 'conventional-changelog-core'
import type {
  CommitGroup,
  GeneratedContext
} from 'conventional-changelog-writer'
import dateformat from 'dateformat'
import {
  CommandFactory,
  CommandRunner,
  Option,
  RootCommand
} from 'nest-commander'
import {
  createReadStream,
  createWriteStream,
  readFileSync,
  type ReadStream,
  type WriteStream
} from 'node:fs'
import type { Readable } from 'node:stream'
import semver from 'semver'
import tempfile from 'tempfile'
import pkg from '../package.json' assert { type: 'json' }

/**
 * Parsed commit with additional fields.
 *
 * @extends {Commit}
 */
interface CommitEnhanced extends Commit {
  raw: Commit
  version?: string
}

/**
 * CLI options.
 */
interface Flags {
  /**
   * Enable verbose output.
   *
   * @default false
   */
  debug?: boolean

  /**
   * Print help text.
   */
  help?: boolean

  /**
   * Read `CHANGELOG` from this file.
   */
  infile?: string

  /**
   * Write content to this file.
   *
   * **Note**: Requires {@linkcode write} to be `true`.
   */
  outfile?: string

  /**
   * Output unreleased changelog.
   *
   * To the set the current version, pass a string value.
   *
   * @example
   *  '1.0.0-alpha.7'
   * @example
   *  true
   *
   * @default true
   */
  outputUnreleased?: boolean | string

  /**
   * Number of releases to be generated.
   *
   * If `0`, the changelog will be regenerated and the output file will be
   * overwritten.
   *
   * @default 1
   */
  releaseCount?: number

  /**
   * Output content to {@linkcode infile}.
   *
   * @default false
   */
  samefile?: boolean

  /**
   * Write content to file instead of {@linkcode process.stdout}.
   *
   * @default false
   */
  write?: boolean
}

/**
 * `changelog` command model.
 *
 * @class
 * @extends {CommandRunner}
 */
@RootCommand({ description: 'Changelog CLI' })
class ChangelogCommand extends CommandRunner {
  /**
   * Creates a new `changelog` command instance.
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
   * Parses the `--debug` flag.
   *
   * @see {@linkcode Flags.debug}
   *
   * @protected
   *
   * @return {true} Option value
   */
  @Option({
    defaultValue: false,
    description: 'Enable verbose output',
    flags: '-d, --debug',
    name: 'debug'
  })
  protected parseDebug(): true {
    return true
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
   * Parses the `--infile` flag.
   *
   * @see {@linkcode Flags.infile}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'Read CHANGELOG from this file',
    flags: '-i, --infile <path>',
    name: 'infile'
  })
  protected parseInfile(val: string): string {
    return val
  }

  /**
   * Parses the `--outfile` flag.
   *
   * @see {@linkcode Flags.outfile}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'Write content to this file (requires --write)',
    flags: '-o, --outfile <path>',
    name: 'outfile'
  })
  protected parseOutfile(val: string): string {
    return val
  }

  /**
   * Parses the `--output-unreleased` flag.
   *
   * @see {@linkcode Flags.outputUnreleased}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean | string} Parsed option value
   */
  @Option({
    defaultValue: true,
    description: 'Output unreleased changelog',
    flags: '-u, --output-unreleased [option]',
    name: 'outputUnreleased'
  })
  protected parseOutputUnreleased(val: string): boolean | string {
    try {
      return this.util.parseBoolean(val)
    } catch {
      return val
    }
  }

  /**
   * Parses the `--release-count` flag.
   *
   * @see {@linkcode Flags.releaseCount}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {number} Parsed option value
   */
  @Option({
    defaultValue: 1,
    description: 'Number of releases to be generated',
    flags: '-r, --release-count <count>',
    name: 'releaseCount'
  })
  protected parseReleaseCount(val: string): number {
    return this.util.parseInt(val)
  }

  /**
   * Parses the `--samefile` flag.
   *
   * @see {@linkcode Flags.samefile}
   *
   * @protected
   *
   * @return {true} Option value
   */
  @Option({
    defaultValue: false,
    description: 'Output content to infile',
    flags: '-s, --samefile',
    name: 'samefile'
  })
  protected parseSamefile(): true {
    return true
  }

  /**
   * Parses the `--write` flag.
   *
   * @see {@linkcode Flags.write}
   *
   * @protected
   *
   * @return {true} Option value
   */
  @Option({
    defaultValue: false,
    description: 'Write content to file',
    flags: '-w, --write',
    name: 'write'
  })
  protected parseWrite(): true {
    return true
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
    const { debug, help, outputUnreleased, releaseCount, write } = flags
    let { infile, outfile, samefile } = flags

    // print help text and exit
    if (help) return void consola.log(this.help.formatHelp(this.command))

    /**
     * Regex used to extract a release version from a string containing
     * Git tags.
     *
     * @const {RegExp} vgx
     */
    const vgx: RegExp = pkg.tagPrefix
      ? new RegExp(`tag:\\s*[=]?${pkg.tagPrefix}(.+?)[,)]`, 'gi')
      : /tag:\s*[=v]?(.+?)[),]/gi

    /**
     * Changelog content stream.
     *
     * @const {Readable} changelog
     */
    // @ts-expect-error type definitions are incorrect
    const changelog: Readable = conventionalChangelog<Commit>(
      {
        append: false,
        debug: debug ? consola.log.bind(consola) : undefined,
        outputUnreleased:
          typeof outputUnreleased === 'boolean'
            ? outputUnreleased
            : typeof outputUnreleased === 'string'
            ? !!outputUnreleased.trim()
            : false,
        pkg: { path: pathe.resolve('package.json') },
        preset: {
          header: '',
          name: parserPreset.name,
          releaseCommitMessageFormat: 'release: {{currentTag}}',
          types: [
            { section: ':package: Build', type: Type.BUILD },
            { section: ':house_with_garden: Housekeeping', type: Type.CHORE },
            { section: ':robot: Continuous Integration', type: Type.CI },
            { section: ':pencil: Documentation', type: Type.DOCS },
            { section: ':sparkles: Features', type: Type.FEAT },
            { section: ':bug: Fixes', type: Type.FIX },
            { section: ':fire: Performance Improvements', type: Type.PERF },
            { section: ':mechanical_arm: Refactors', type: Type.REFACTOR },
            { section: ':wastebasket: Reverts', type: Type.REVERT },
            { hidden: true, type: Type.STYLE },
            { section: ':white_check_mark: Testing', type: Type.TEST },
            { hidden: true, type: Type.WIP }
          ]
        },
        releaseCount,
        skipUnstable: false,
        tagPrefix: pkg.tagPrefix,
        /**
         * Raw commit transformer.
         *
         * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core#transform-1
         * @see https://github.com/conventional-changelog/conventional-changelog/issues/415
         *
         * @param {Commit} commit - Commit object
         * @param {Options.Transform.Callback} apply - Commit handler
         * @return {void} Nothing when complete
         */
        transform(commit: Commit, apply: Options.Transform.Callback): void {
          return void apply(null, {
            ...commit,
            committerDate: dateformat(commit.committerDate, 'yyyy-mm-dd', true),
            mentions: commit.mentions.filter(m => m !== 'flexdevelopment'),
            // @ts-expect-error ts(2322)
            raw: commit,
            references: commit.references.filter(ref => ref.action !== null),
            version: commit.gitTags ? vgx.exec(commit.gitTags)?.[1] : undefined
          })
        },
        warn: parserPreset.parserOpts.warn
      },
      {},
      {
        debug: debug ? parserPreset.parserOpts.warn : undefined,
        format:
          '%B%n-hash-%n%H%n-shortHash-%n%h%n-gitTags-%n%d%n-committerDate-%n%ci%n'
      },
      parserPreset.parserOpts,
      {
        /**
         * Sorts commit groups in descending order by group title.
         *
         * GitHub emojis in titles will be ignored.
         *
         * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#commitgroupssort
         *
         * @param {CommitGroup} a - Commit group object
         * @param {CommitGroup} b - Commit group object to compare to `a`
         * @return {number} Compare result
         */
        commitGroupsSort(a: CommitGroup, b: CommitGroup): number {
          if (a.title === false) return CompareResult.GREATER_THAN
          if (b.title === false) return CompareResult.LESS_THAN

          /**
           * Regex used to extract commit group titles without GitHub emojis.
           *
           * @const {RegExp} tgx - Regex used to extract commit group title
           */
          const tgx: RegExp = /([A-Z])\w+/

          return tgx.exec(a.title)![0]!.localeCompare(tgx.exec(b.title)![0]!)
        },
        /**
         * Sorts commits in descending order by commit header and date.
         *
         * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#commitssort
         *
         * @param {Commit} a - Commit object
         * @param {Commit} b - Commit object to compare to `b`
         * @return {number} Compare result
         */
        commitsSort(a: Commit, b: Commit): number {
          /**
           * Compare result for {@linkcode b.committerDate} and
           * {@linkcode a.committerDate}.
           *
           * @const {number} by_date
           */
          const by_date: number =
            new Date(b.committerDate).getTime() -
            new Date(a.committerDate).getTime()

          return a.header && b.header
            ? a.header.localeCompare(b.header) || by_date
            : by_date
        },
        /**
         * Modifies `context` before the changelog is generated.
         *
         * This includes:
         *
         * - Setting the current and previous release tags
         * - Setting the release date
         * - Determining patch release state
         * - Determining if compare links should be generated
         *
         * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core#finalizecontext
         * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#finalizecontext
         *
         * @param {GeneratedContext} context - Generated changelog context
         * @param {Options} options - `conventional-changelog-core` options
         * @param {CommitEnhanced[]} commits - Commits for release
         * @param {CommitEnhanced?} key - Release commit
         * @return {GeneratedContext} Final changelog context
         */
        finalizeContext(
          context: GeneratedContext,
          options: Options,
          commits: CommitEnhanced[],
          key?: CommitEnhanced
        ): GeneratedContext {
          const { gitSemverTags = [], isPatch, linkCompare, version } = context
          let { currentTag, previousTag } = context

          /**
           * First commit in release.
           *
           * @const {CommitEnhanced?} first_commit
           */
          const first_commit: CommitEnhanced | undefined = commits.at(0)

          /**
           * Last commit in release.
           *
           * @const {CommitEnhanced?} last_commit
           */
          const last_commit: CommitEnhanced | undefined = commits.at(-1)

          // set current and previous tags
          if (key && (!currentTag || !previousTag)) {
            currentTag = key.version ?? undefined

            // try setting previous tag based on current tag
            if (gitSemverTags.includes(currentTag ?? '')) {
              const { version = '' } = key
              previousTag = gitSemverTags[gitSemverTags.indexOf(version) + 1]
              if (!previousTag) previousTag = last_commit?.hash ?? undefined
            }
          } else {
            currentTag = /^unreleased$/i.test(version ?? '')
              ? currentTag ??
                (typeof outputUnreleased === 'string' && outputUnreleased
                  ? outputUnreleased
                  : first_commit?.hash ?? undefined)
              : !currentTag && version
              ? pkg.tagPrefix + version
              : currentTag ?? version
            previousTag = previousTag ?? gitSemverTags[0]
          }

          // set release date
          context.date =
            key?.committerDate ??
            dateformat(new Date().toLocaleDateString(), 'yyyy-mm-dd', true)

          // determine patch release state
          if (version && semver.valid(version)) {
            context.isPatch = isPatch ?? semver.patch(version) !== 0
          }

          // @ts-expect-error ts(2322)
          return {
            ...context,
            currentTag,
            linkCompare: isNIL(linkCompare) && !!currentTag && !!previousTag,
            previousTag,
            repoUrl: pkg.repository.slice(0, -4)
          }
        },
        headerPartial: readFileSync(
          'config/templates/changelog/header.hbs',
          'utf8'
        ),
        ignoreReverted: false
      }
    ).on('error', err => consola.error(err.stack))

    // override samefile if infile and outfile are the same file
    if (infile && infile === outfile) samefile = true

    // reset outfile if changelog should be output to infile
    if (samefile) outfile = infile = infile ?? 'CHANGELOG.md'

    /**
     * Creates a file writer.
     *
     * If writing to file is disabled, {@linkcode process.stdout} will be used
     * to write content to the terminal.
     *
     * Otherwise, {@linkcode createWriteStream} will be used to create a stream
     * for {@linkcode outfile}.
     *
     * @see {@linkcode NodeJS.WriteStream}
     * @see {@linkcode WriteStream}
     * @see {@linkcode createWriteStream}
     *
     * @return {WriteStream | (NodeJS.WriteStream & { fd: 1 })} File writer
     */
    const writer = (): WriteStream | (NodeJS.WriteStream & { fd: 1 }) => {
      return write && outfile ? createWriteStream(outfile) : process.stdout
    }

    // write changelog to infile, outfile, or stdout
    switch (true) {
      case infile && releaseCount !== 0:
        /**
         * Changelog file stream.
         *
         * @const {ReadStream} rs
         */
        const rs: ReadStream = createReadStream(infile!).on('error', () => {
          if (debug) consola.error('infile does not exist.')
          if (samefile) changelog.pipe(writer())
        })

        // write changelog to infile or stdout
        if (samefile) {
          /**
           * Absolute path to random temporary file.
           *
           * @const {string} tmp
           */
          const tmp: string = tempfile()

          changelog
            .pipe(addStream(rs))
            .pipe(createWriteStream(tmp))
            .on('finish', () => createReadStream(tmp).pipe(writer()))
        } else {
          changelog.pipe(addStream(rs)).pipe(writer())
        }

        break
      default:
        changelog.pipe(writer())
        break
    }

    return void 0
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
    cmd.allowExcessArguments(false)
    cmd.allowUnknownOption(false)
    cmd.createHelp = () => this.help
    cmd.combineFlagAndOptionalValue(false)
    cmd.enablePositionalOptions()
    cmd.helpOption(false)
    cmd.showHelpAfterError()
    cmd.showSuggestionAfterError()
    this.command = cmd
    return this
  }
}

/**
 * CLI application module.
 *
 * @class
 */
@Module({ providers: [ChangelogCommand, HelpService, UtilityService] })
class AppModule {
  /**
   * Commander error handler.
   *
   * @see {@linkcode Command.exitOverride}
   * @see {@linkcode CommanderError}
   * @see https://github.com/jmcdo29/nest-commander/blob/nest-commander%403.6.1/packages/nest-commander/src/command-runner.service.ts#L49-L51
   *
   * @public
   * @static
   *
   * @param {CommanderError} error - Error to handle
   * @return {void} Nothing when complete
   */
  public static errorHandler(error: CommanderError): void {
    if (error.exitCode) consola.error(error)
    return void process.exit(error.exitCode)
  }

  /**
   * CLI command error handler.
   *
   * @public
   * @static
   *
   * @param {Error} error - Error to handle
   * @return {void} Nothing when complete
   */
  public static serviceErrorHandler(error: Error): void {
    consola.error(error)
    return void process.exit(1)
  }
}

/**
 * CLI application runner.
 *
 * @async
 *
 * @return {Promise<void>} Nothing when complete
 */
async function main(): Promise<void> {
  return void (await CommandFactory.run(AppModule, {
    errorHandler: AppModule.errorHandler,
    logger: ['error', 'warn'],
    serviceErrorHandler: AppModule.serviceErrorHandler
  }))
}

// run application and exit
void (await main())
