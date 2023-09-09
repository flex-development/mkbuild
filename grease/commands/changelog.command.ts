/**
 * @file Commands - ChangelogCommand
 * @module grease/commands/ChangelogCommand
 */

import * as mlly from '@flex-development/mlly'
import {
  CliUtilityService,
  Command,
  CommandRunner,
  Option
} from '@flex-development/nest-commander'
import type * as commander from '@flex-development/nest-commander/commander'
import type { PackageJson } from '@flex-development/pkg-types'
import {
  DOT,
  fallback,
  isNull,
  trim,
  type EmptyArray
} from '@flex-development/tutils'
import type { ChangelogOptions as Opts } from '../options'
import { ChangelogService } from '../providers'

/**
 * `changelog` command model.
 *
 * @class
 * @extends {CommandRunner}
 */
@Command({
  description: 'changelog generator',
  examples: ['', '-sw'],
  name: 'changelog'
})
class ChangelogCommand extends CommandRunner {
  /**
   * Creates a new `changelog` command runner.
   *
   * @param {ChangelogService} changelog - Changelog generator service
   * @param {CliUtilityService} util - Utilities service instance
   */
  constructor(
    protected readonly changelog: ChangelogService,
    protected readonly util: CliUtilityService
  ) {
    super()
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
    description: 'path to current working directory',
    fallback: { value: DOT },
    flags: '-c, --cwd <path>'
  })
  protected parseCwd(val: string): string {
    return trim(val)
  }

  /**
   * Parses the `--debug` flag.
   *
   * @see {@linkcode Opts.debug}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    description: 'enable verbose output',
    fallback: { value: false },
    flags: '-d, --debug',
    preset: 'true'
  })
  protected parseDebug(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--from` flag.
   *
   * @see {@linkcode Opts.from}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'beginning of commit revision range',
    fallback: { value: '' },
    flags: '-f, --from <commitish>'
  })
  protected parseFrom(val: string): string {
    return trim(val)
  }

  /**
   * Parses the `--infile` flag.
   *
   * @see {@linkcode Opts.infile}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'read CHANGELOG from this file',
    flags: '-i, --infile <path>'
  })
  protected parseInfile(val: string): string {
    return trim(val)
  }

  /**
   * Parses the `--outfile` flag.
   *
   * @see {@linkcode Opts.outfile}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'write content to this file',
    flags: '-o, --outfile <path>',
    implies: { write: true }
  })
  protected parseOutfile(val: string): string {
    return trim(val)
  }

  /**
   * Parses the `--pkg` flag.
   *
   * @see {@linkcode Opts.pkg}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {PackageJson} Parsed option value
   */
  @Option({
    description: 'module id of package directory or manifest',
    env: 'npm_package_json',
    fallback: { value: DOT },
    flags: '-p, --pkg <path>'
  })
  protected parsePkg(val: string): PackageJson {
    return fallback(
      mlly.readPackageJson(val.replace(/\/?package\.json$/, '')),
      {},
      isNull
    )
  }

  /**
   * Parses the `--releases` flag.
   *
   * @see {@linkcode Opts.releases}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {number} Parsed option value
   */
  @Option({
    description: 'number of releases to generate',
    fallback: { value: 1 },
    flags: '-r, --releases <count>'
  })
  protected parseReleases(val: string): number {
    return this.util.parseInt(val)
  }

  /**
   * Parses the `--samefile` flag.
   *
   * @see {@linkcode Opts.samefile}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    description: 'output content to infile',
    fallback: { value: false },
    flags: '-s, --samefile [option]',
    preset: 'true'
  })
  protected parseSamefile(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--tagprefix` flag.
   *
   * @see {@linkcode Opts.tagprefix}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'tag prefix to apply during git tag comparisons',
    fallback: { value: '' },
    flags: '-T, --tagprefix <prefix>'
  })
  protected parseTagPrefix(val: string): string {
    return trim(val)
  }

  /**
   * Parses the `--to` flag.
   *
   * @see {@linkcode Opts.to}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {string} Parsed option value
   */
  @Option({
    description: 'end of commit revision range',
    fallback: { value: 'HEAD' },
    flags: '-t, --to <commitish>'
  })
  protected parseTo(val: string): string {
    return trim(val)
  }

  /**
   * Parses the `--unstable` flag.
   *
   * @see {@linkcode Opts.unstable}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    description: 'include unstable releases',
    fallback: { value: true },
    flags: '-u, --unstable [option]',
    preset: 'true'
  })
  protected parseUnstable(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Parses the `--write` flag.
   *
   * @see {@linkcode Opts.write}
   *
   * @protected
   *
   * @param {string} val - Value to parse
   * @return {boolean} Parsed option value
   */
  @Option({
    description: 'write content to file',
    fallback: { value: false },
    flags: '-w, --write [option]',
    preset: 'true'
  })
  protected parseWrite(val: string): boolean {
    return this.util.parseBoolean(val)
  }

  /**
   * Command action handler.
   *
   * @see {@linkcode Opts}
   *
   * @public
   * @async
   *
   * @param {EmptyArray} _ - Parsed command arguments
   * @param {Opts} opts - Parsed command options
   * @return {Promise<void>} Nothing when complete
   */
  public async run(_: EmptyArray, opts: Opts): Promise<void> {
    return void (await this.changelog.generate(opts))
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

export default ChangelogCommand
