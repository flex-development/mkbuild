/**
 * @file Options - ChangelogOptions
 * @module grease/options/ChangelogOptions
 */

import { Type } from '@flex-development/commitlint-config'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import {
  CompareResult,
  cast,
  constant,
  defaults,
  fallback,
  identity,
  isNull,
  type EmptyArray,
  type EmptyString,
  type Fn,
  type Omit,
  type Optional,
  type Times
} from '@flex-development/tutils'
import * as emoji from 'node-emoji'
import { RepoProvider } from '../enums'
import type { Commit } from '../interfaces'
import { Formatter } from '../models'
import type { CommitGroup, CommitTransformer } from '../types'

/**
 * Changelog generation options.
 *
 * @class
 */
class ChangelogOptions {
  /**
   * Path to current working directory.
   *
   * @default process.cwd()
   *
   * @public
   * @instance
   * @member {string} cwd
   */
  public cwd: string

  /**
   * Enable verbose output.
   *
   * @default false
   *
   * @public
   * @instance
   * @member {boolean} debug
   */
  public debug: boolean

  /**
   * Changelog formatter.
   *
   * @default
   *  new Formatter()
   *
   * @public
   * @instance
   * @member {Formatter} formatter
   */
  public formatter: Formatter

  /**
   * Revision range start.
   *
   * @default
   *  based on `options.releases`
   *
   * @public
   * @instance
   * @member {string} from
   */
  public from: string

  /**
   * Commit grouping function.
   *
   * @default commit=>commit.type
   *
   * @public
   * @instance
   * @member {Fn<[Commit], string>} groupby
   */
  public groupby: Fn<[commit: Commit], string>

  /**
   * An array of commit group objects representing explicitly supported commit
   * message types, and whether they should show up in generated changelog.
   *
   * @default
   *  [
   *   { section: ':sparkles: Features', type: Type.FEAT },
   *   { section: ':bug: Fixes', type: Type.FIX },
   *   { section: ':mechanical_arm: Refactors', type: Type.REFACTOR },
   *   { section: ':fire: Performance Improvements', type: Type.PERF },
   *   { section: ':wastebasket: Reverts', type: Type.REVERT },
   *   { section: ':pencil: Documentation', type: Type.DOCS },
   *   { section: ':white_check_mark: Testing', type: Type.TEST },
   *   { section: ':package: Build', type: Type.BUILD },
   *   { section: ':robot: Continuous Integration', type: Type.CI },
   *   { section: ':house_with_garden: Housekeeping', type: Type.CHORE },
   *   { hidden: true, type: Type.RELEASE },
   *   { hidden: true, type: Type.STYLE },
   *   { hidden: true, type: Type.WIP },
   *  ]
   *
   * @public
   * @instance
   * @member {Omit<CommitGroup, 'commits'>[]} groups
   */
  public groups: Omit<CommitGroup, 'commits'>[]

  /**
   * Commit group sorting function.
   *
   * @public
   * @instance
   * @member {Fn<Times<2, CommitGroup>, CompareResult>} groupsort
   */
  public groupsort: Fn<Times<2, CommitGroup>, CompareResult>

  /**
   * Read `CHANGELOG` from this file.
   *
   * @public
   * @instance
   * @member {Optional<string>} infile
   */
  public infile?: Optional<string>

  /**
   * Write changelog entries to this file.
   *
   * @public
   * @instance
   * @member {Optional<string>} outfile
   */
  public outfile?: Optional<string>

  /**
   * Package context.
   *
   * @default {}
   *
   * @public
   * @instance
   * @member {PackageJson} pkg
   */
  public pkg: PackageJson

  /**
   * Number of releases to generate.
   *
   * To regenerate the entire changelog, pass `0`.
   *
   * @default 1
   *
   * @public
   * @instance
   * @member {number} releases
   */
  public releases: number

  /**
   * Repository provider.
   *
   * @default RepoProvider.GITHUB
   *
   * @public
   * @instance
   * @member {RepoProvider} repo
   */
  public repo: RepoProvider

  /**
   * Output content to {@linkcode infile}.
   *
   * @default false
   *
   * @public
   * @instance
   * @member {boolean} samefile
   */
  public samefile: boolean

  /**
   * Tag prefix to apply during git tag comparisons.
   *
   * @default ''
   *
   * @public
   * @instance
   * @member {string} tagprefix
   */
  public tagprefix: string

  /**
   * Revision range end.
   *
   * @default 'HEAD'
   *
   * @public
   * @instance
   * @member {string} to
   */
  public to: string

  /**
   * Parsed commit transformer.
   *
   * @see {@linkcode CommitTransformer}
   *
   * @public
   * @instance
   * @member {CommitTransformer} transform
   */
  public transform: CommitTransformer

  /**
   * Include unstable releases.
   *
   * @default true
   *
   * @public
   * @instance
   * @member {boolean} unstable
   */
  public unstable: boolean

  /**
   * Write content to {@linkcode outfile} instead of {@linkcode process.stdout}.
   *
   * @default false
   *
   * @public
   * @instance
   * @member {boolean} write
   */
  public write: boolean

  /**
   * Create a new changelog options object.
   *
   * @param {Partial<ChangelogOptions>} [opts] - Changelog options
   */
  constructor(opts?: Partial<ChangelogOptions>) {
    const {
      cwd,
      debug,
      formatter,
      from,
      groupby,
      groups,
      groupsort,
      infile,
      outfile,
      pkg,
      releases,
      repo,
      samefile,
      tagprefix,
      to,
      transform,
      unstable,
      write
    } = defaults(fallback(opts, {}), {
      cwd: process.cwd(),
      debug: false,
      formatter: new Formatter(),
      from: '',
      groupby: (commit: Commit): string => fallback(commit.type, '', isNull),
      groups: [
        { section: ':sparkles: Features', type: Type.FEAT },
        { section: ':bug: Fixes', type: Type.FIX },
        { section: ':mechanical_arm: Refactors', type: Type.REFACTOR },
        { section: ':fire: Performance Improvements', type: Type.PERF },
        { section: ':wastebasket: Reverts', type: Type.REVERT },
        { section: ':pencil: Documentation', type: Type.DOCS },
        { section: ':white_check_mark: Testing', type: Type.TEST },
        { section: ':package: Build', type: Type.BUILD },
        { section: ':robot: Continuous Integration', type: Type.CI },
        { section: ':house_with_garden: Housekeeping', type: Type.CHORE },
        { hidden: true as const, type: Type.RELEASE },
        { hidden: true as const, type: Type.STYLE },
        { hidden: true as const, type: Type.WIP }
      ],
      groupsort: (a: CommitGroup, b: CommitGroup): CompareResult => {
        /**
         * Function used to remove emojis from commit group titles.
         *
         * @const {Fn<EmptyArray, EmptyString>} format
         */
        const format: Fn<EmptyArray, EmptyString> = constant('')

        return a.hidden
          ? CompareResult.GREATER_THAN
          : b.hidden
          ? CompareResult.LESS_THAN
          : emoji
            .emojify(a.section, { format })
            .localeCompare(emoji.emojify(b.section, { format }))
      },
      infile: undefined,
      outfile: undefined,
      pkg: {},
      releases: 1,
      repo: RepoProvider.GITHUB,
      samefile: false,
      tagprefix: '',
      to: 'HEAD',
      transform: identity,
      unstable: true,
      write: false
    })

    this.cwd = pathe.resolve(cwd)
    this.debug = debug
    this.formatter = formatter
    this.from = releases === 0 ? '' : from
    this.groupby = groupby
    this.groups = groups
    this.groupsort = groupsort
    this.infile = infile
    this.outfile = outfile
    this.pkg = pkg
    this.releases = releases
    this.repo = repo
    this.samefile = infile && infile === outfile ? true : samefile
    this.tagprefix = tagprefix
    this.to = to || 'HEAD'
    this.transform = cast(transform)
    this.unstable = unstable
    this.write = write

    // reset samefile if changelog is being overwritten
    if (this.write && !this.releases) this.samefile = true

    // reset outfile if changelog should be output to infile
    if (this.samefile) {
      this.outfile = this.infile = this.infile ?? 'CHANGELOG.md'
    }
  }
}

export default ChangelogOptions
