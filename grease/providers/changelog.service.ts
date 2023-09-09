/**
 * @file changelog - ChangelogService
 * @module config/changelog/providers/ChangelogService
 */

import {
  at,
  cast,
  construct,
  entries,
  fallback,
  fork,
  get,
  group,
  includes,
  isNaN,
  join,
  ksort,
  noop,
  objectify,
  pick,
  select,
  sift,
  sort,
  split,
  template,
  timeiso,
  trim,
  type Construct,
  type Nullable,
  type Pick
} from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import consola from 'consola'
import dateformat, { masks } from 'dateformat'
import { exec, execFile, execSync } from 'node:child_process'
import {
  ReadStream,
  createReadStream,
  createWriteStream,
  type WriteStream
} from 'node:fs'
import { Readable } from 'node:stream'
import util from 'node:util'
import semver from 'semver'
import { RepoProvider } from '../enums'
import type { Commit, Context, Entry } from '../interfaces'
import { Grammar } from '../models'
import {
  ChangelogOptions,
  type CommitOptions,
  type SemverTagOptions
} from '../options'
import type {
  BreakingChange,
  CommitGroup,
  RawCommitField,
  RepoProviderMap,
  Trailer
} from '../types'

/**
 * Encapsulates logic for generating changelogs.
 *
 * @class
 */
@Injectable()
class ChangelogService {
  /**
   * Format string passed to `git log`.
   *
   * @see https://git-scm.com/docs/git-log#_pretty_formats
   *
   * @public
   * @static
   * @readonly
   * @member {string} GIT_LOG_FORMAT
   */
  public static readonly GIT_LOG_FORMAT: string = join(
    [
      '%s%n',
      'author.email',
      '%n%ae%n',
      'author.name',
      '%n%an%n',
      'body',
      '%n%b%n',
      'date',
      '%n%cI%n',
      'hash',
      '%n%h%n',
      'sha',
      '%n%H%n',
      'tags',
      '%n%D%n',
      'trailers',
      '%n%(trailers)%n'
    ],
    '-'
  )

  /**
   * Repository provider configuration map.
   *
   * @public
   * @static
   * @readonly
   * @member {RepoProviderMap} PROVIDERS
   */
  public static readonly PROVIDERS: RepoProviderMap = {
    [RepoProvider.BITBUCKET]: {
      host: `${RepoProvider.BITBUCKET}.org`,
      keywords: { commit: 'commit', issue: 'issues', pr: 'pull-requests' }
    },
    [RepoProvider.GITHUB]: {
      host: `${RepoProvider.GITHUB}.com`,
      keywords: { commit: 'commit', issue: 'issues', pr: 'pull' }
    },
    [RepoProvider.GITLAB]: {
      host: `${RepoProvider.GITLAB}.com`,
      keywords: { commit: 'commit', issue: 'issues', pr: 'merge_requests' }
    }
  }

  /**
   * Create a new changelog service.
   *
   * @param {Grammar} grammar - Changelog grammar instance
   */
  constructor(protected readonly grammar: Grammar) {}

  /**
   * Get an array of parsed commits.
   *
   * @see {@linkcode CommitOptions}
   *
   * @template T - Transformed commit type
   *
   * @public
   * @async
   *
   * @param {CommitOptions} opts - Commit retrieval and parsing options
   * @return {Promise<T[]>} Parsed commit array
   */
  public async commits<T extends Commit = Commit>(
    opts: CommitOptions
  ): Promise<T[]> {
    /**
     * String used to separate commit logs.
     *
     * @const {string} LOG_DELIMITER
     */
    const LOG_DELIMITER: string = '--$--'

    /**
     * Git command arguments.
     *
     * @const {string[]} args
     */
    const args: string[] = sift([
      'log',
      `--format=${ChangelogService.GIT_LOG_FORMAT}%n${LOG_DELIMITER}`,
      '--decorate-refs=refs/tags',
      '--decorate=short',
      join(sift([opts.from, opts.to || 'HEAD']), '..')
    ])

    // filter commits by directory
    if (opts.cwd !== process.cwd()) args.push(`-- ${opts.cwd}`)

    // debug git log command
    if (opts.debug) consola.info('git', ...args)

    /**
     * Git command output.
     *
     * @const {{ stderr: string; stdout: string }} gitlog
     */
    const gitlog: {
      stderr: string
      stdout: string
    } = await util.promisify(execFile)('git', args, {
      cwd: opts.cwd,
      maxBuffer: Number.POSITIVE_INFINITY
    })

    /**
     * Array containing parsed commits.
     *
     * @const {T[]} commits
     */
    const commits: T[] = []

    // parse raw commits
    for (let chunk of split(gitlog.stdout, LOG_DELIMITER + '\n')) {
      if (!(chunk = trim(chunk))) continue

      // get commit header and raw fields
      const [[header = ''], raw_fields]: [string[], string[]] = fork(
        split(chunk, /^(?=-.*?-\n*$)/gm),
        raw => !this.grammar.field.test(raw)
      )

      // extract commit header data
      const {
        groups: {
          breaking = null,
          pr = 'null',
          scope = null,
          subject = '',
          type = ''
        } = {}
      } = pick(this.grammar.header.exec(header)!, ['groups'])

      /**
       * Commit fields object.
       *
       * @const {Construct<Record<RawCommitField, string>>} fields
       */
      const fields: Construct<Record<RawCommitField, string>> = construct(
        cast<Record<RawCommitField, string>>(
          objectify(
            raw_fields,
            raw => get(this.grammar.field.exec(raw)!.groups, 'field', ''),
            raw => trim(raw.replace(this.grammar.field, ''))
          )
        )
      )

      /**
       * Tags associated with commit.
       *
       * @const {string[]} tags
       */
      const tags: string[] = select(
        split(fields.tags, ','),
        tag => !!trim(tag),
        tag => trim(tag.replace(/^tag: */, ''))
      )

      /**
       * Commit message trailers.
       *
       * @const {Trailer[]} trailers
       */
      const trailers: Trailer[] = select(
        split(fields.trailers, '\n'),
        trailer => !!trim(trailer),
        trailer => {
          const { token, value } = this.grammar.trailer.exec(trailer)!.groups!
          return { token: token!, value: trim(value!) }
        }
      )

      /**
       * Breaking changes noted in commit subject and trailers.
       *
       * @const {BreakingChange[]} breaking_changes
       */
      const breaking_changes: BreakingChange[] = select(
        trailers,
        trailer => /^BREAKING[ -]CHANGE/.test(trailer.token),
        trailer => ({ scope: null, subject: trailer.value, type })
      )

      // add subject to breaking changes if breaking change is in subject
      if (breaking && !includes(breaking_changes, subject)) {
        breaking_changes.unshift({ scope, subject, type })
      }

      /**
       * Parsed commit object.
       *
       * @var {T} commit
       */
      let commit: T = cast({
        ...fields,
        body: fields.body.replace(fields.trailers, ''),
        breaking: !!breaking_changes.length,
        breaking_changes,
        header: header.replace(/\n$/, ''),
        mentions: select(
          [...chunk.matchAll(this.grammar.mention)],
          null,
          match => get(match, 'groups.user')!
        ),
        pr: fallback(+pr, null, isNaN),
        references: select(
          [...chunk.matchAll(this.grammar.reference)],
          null,
          match => ({
            action: get(match, 'groups.action', null),
            number: +get(match, 'groups.number', ''),
            owner: get(match, 'groups.owner', null),
            ref: get(match, 'groups.ref', ''),
            repo: get(match, 'groups.repo', null)
          })
        ),
        scope,
        subject,
        tags,
        trailers,
        type,
        version: at(tags, 0, null)
      })

      // transform commit
      if (opts.transform) commit = await opts.transform(commit, chunk)

      // add parsed commit
      commits.push(ksort(commit, { deep: true }))
    }

    return commits
  }

  /**
   * Get an array of changelog entry objects.
   *
   * @public
   *
   * @param {Commit[]} commits - Parsed commit array
   * @param {string[]} tags - Semver tags
   * @param {ChangelogOptions} opts - Changelog options
   * @return {Entry[]} Changelog entry object array
   */
  public entries(
    commits: Commit[],
    tags: string[],
    opts: ChangelogOptions
  ): Entry[] {
    return select(
      entries(
        group(commits, commit => {
          if (commit.version) return commit.version

          /**
           * Git command used to get tag containing {@linkcode commit}.
           *
           * @see https://git-scm.com/docs/git-describe
           *
           * @const {string} cmd
           */
          const cmd: string = join(
            [
              'git',
              'describe',
              '--candidates=1',
              '--contains',
              template('--match="{tagprefix}*"', { tagprefix: opts.tagprefix }),
              commit.sha
            ],
            ' '
          )

          // get tag containing commit
          try {
            return trim(
              execSync(cmd, {
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
              })
            ).replace(/~\d+$/, '')
          } catch {
            const [tag] = tags
            return tag?.replace(opts.tagprefix, '') === opts.pkg.version
              ? template('{tag}+{sha}', { sha: get(commits, '0.sha'), tag })
              : opts.pkg.version!
          }
        })
      ),
      null,
      ([version, commits]) => {
        const { groupby, groups, groupsort } = opts

        /**
         * Key commit.
         *
         * @const {Nullable<Commit>} key
         */
        const key: Nullable<Commit> = fallback(
          commits!.find(commit => commit.version === version),
          null
        )

        /**
         * Grouped commits map.
         *
         * @const {Record<string, Commit[]>} map
         */
        const map: Record<string, Commit[]> = cast(group(commits!, groupby))

        return {
          date: dateformat(key?.date ?? timeiso(), masks.isoDate),
          groups: sort(
            entries(map).reduce<CommitGroup[]>((acc, [type, commits]) => {
              const [group] = select(groups, group => group.type === type)
              return group && !group.hidden
                ? [
                    ...acc,
                    {
                      ...group,
                      commits: sort(commits, (a, b) => {
                        return a.header.localeCompare(b.header)
                      })
                    }
                  ]
                : acc
            }, []),
            groupsort
          ),
          key: key ?? at(commits, 0)!,
          last_version: fallback(tags[tags.indexOf(version) + 1], null),
          patch: !!semver.patch(version),
          prerelease: !!semver.prerelease(version),
          version
        }
      }
    )
  }

  /**
   * Generate a changelog.
   *
   * @public
   * @async
   *
   * @param {ChangelogOptions} [opts] - Changelog options
   * @return {Promise<void>} Nothing when complete
   */
  public async generate(opts?: ChangelogOptions): Promise<void> {
    opts = new ChangelogOptions(opts)

    /**
     * Git semver tags.
     *
     * @const {string[]} tags
     */
    const tags: string[] = await this.tags(opts)

    // set revision start range based on release count
    if (opts.releases && opts.to === 'HEAD' && !includes(tags, opts.from)) {
      opts.from = fallback(tags[opts.releases - 1], '')
    }

    /**
     * Parsed commits.
     *
     * @const {Commit[]} commits
     */
    const commits: Commit[] = await this.commits(opts)

    return void (await this.write(this.entries(commits, tags, opts), opts))
  }

  /**
   * Get the owner and name of the current repository.
   *
   * @public
   * @async
   *
   * @param {RepoProvider} provider - Repository provider
   * @return {Promise<Pick<Context, 'owner' | 'repo'>>} Repository owner + name
   */
  public async repository(
    provider: RepoProvider
  ): Promise<Pick<Context, 'owner' | 'repo'>> {
    // get repository url
    let { stdout } = await util.promisify(exec)('git remote get-url origin')

    // remove repository host from remote url
    stdout = stdout.replace(
      new RegExp(`https://${ChangelogService.PROVIDERS[provider].host}/`),
      ''
    )

    return cast<Pick<Context, 'owner' | 'repo'>>(
      get(/(?<owner>\S+)\/(?<repo>\S+)(?=\.git)/.exec(stdout)!, 'groups')
    )
  }

  /**
   * Get an array containing all git semver tags in reverse chronological order.
   *
   * @see {@linkcode SemverTagOptions}
   *
   * @public
   * @async
   *
   * @param {SemverTagOptions} opts - Tag retrieval options
   * @return {Promise<string[]>} Semver tags array
   */
  public async tags(opts: SemverTagOptions): Promise<string[]> {
    const { tagprefix, unstable } = new ChangelogOptions(opts)

    /**
     * Git command arguments.
     *
     * @const {string[]} args
     */
    const args: string[] = [
      'log',
      '--decorate-refs=refs/tags',
      '--decorate=short',
      '--format=%D'
    ]

    /**
     * Git command output.
     *
     * @const {{ stderr: string; stdout: string }} gitlog
     */
    const gitlog: {
      stderr: string
      stdout: string
    } = await util.promisify(execFile)('git', args, {
      cwd: process.cwd(),
      maxBuffer: Number.POSITIVE_INFINITY
    })

    return select(
      select(
        split(gitlog.stdout, '\n'),
        tag => !!trim(tag),
        tag => trim(tag).replace(/^tag: */, '')
      ),
      tag => {
        return (
          tag.startsWith(tagprefix) &&
          !!semver.valid((tag = tag.replace(tagprefix, ''))) &&
          (!unstable ? !semver.parse(tag)!.prerelease.length : true)
        )
      }
    )
  }

  /**
   * Write changelog entries.
   *
   * @public
   * @async
   *
   * @param {Entry[]} entries - Changelog entry objects
   * @param {ChangelogOptions} opts - Changelog options
   * @return {Promise<void>} Nothing when complete
   */
  public async write(entries: Entry[], opts: ChangelogOptions): Promise<void> {
    /**
     * Changelog context.
     *
     * @const {Context} context
     */
    const context: Context = ksort({
      ...ChangelogService.PROVIDERS[opts.repo],
      ...(await this.repository(opts.repo))
    })

    /**
     * File writer.
     *
     * If writing to file is disabled, {@linkcode process.stdout} will be used
     * to write changelog entries. A write stream will be used otherwise.
     *
     * @see {@linkcode NodeJS.WriteStream}
     * @see {@linkcode WriteStream}
     * @see {@linkcode createWriteStream}
     *
     * @const {WriteStream | (NodeJS.WriteStream & { fd: 1 })} writer
     */
    const writer: WriteStream | (NodeJS.WriteStream & { fd: 1 }) =
      opts.write && opts.outfile
        ? createWriteStream(opts.outfile)
        : process.stdout

    /**
     * Readable changelog.
     *
     * @const {Readable} changelog
     */
    const changelog: Readable = new Readable({ read: noop })

    // add error handler to readable changelog
    changelog.on('error', consola.error.bind({}))

    // add newline chunk if writing changelog to stdout in debug mode
    if (opts.debug && !opts.write) changelog.push('\n')

    // add changelog entry chunks to readable changelog
    for (const entry of entries) {
      changelog.push(opts.formatter.formatEntry(entry, context))
    }

    // output changelog if infile should not be added to readable changelog
    if (!(opts.infile && opts.releases)) return void changelog.pipe(writer)

    /**
     * Readable {@linkcode opts.infile} stream.
     *
     * @const {ReadStream} infile
     */
    const infile: ReadStream = createReadStream(opts.infile)

    // add error handler to infile stream
    infile.on('error', () => {
      if (opts.debug) consola.error('infile does not exist.')
      if (opts.samefile) changelog.pipe(writer)
    })

    // add infile to readable changelog
    for await (const chunk of infile) changelog.push(chunk)

    // write changelog to infile, outfile, or stdout
    return void changelog.pipe(writer)
  }
}

export default ChangelogService
