/**
 * @file Models - Formatter
 * @module grease/models/Formatter
 */

import {
  cast,
  get,
  ifelse,
  iterate,
  template,
  trim
} from '@flex-development/tutils'
import type { Commit, Context, Entry } from '../interfaces'
import type { BreakingChange, CommitGroup } from '../types'
import Grammar from './grammar.model'

/**
 * Data model encapsulating changelog formatting.
 *
 * @class
 */
class Formatter {
  /**
   * Create a new changelog formatter.
   *
   * @param {Grammar} [grammar=new Grammar()] - Changelog grammar instance
   */
  constructor(protected readonly grammar: Grammar = new Grammar()) {}

  /**
   * Format breaking change notes.
   *
   * @see {@linkcode Entry}
   *
   * @public
   *
   * @param {Entry} entry - Changelog entry object
   * @return {string} Formatted breaking change notes
   */
  public formatBreakingChanges(entry: Entry): string {
    /**
     * Breaking changes.
     *
     * @const {BreakingChange[]} changes
     */
    const changes: BreakingChange[] = iterate(
      entry.groups.length,
      [],
      (acc: BreakingChange[], i: number): typeof acc => [
        ...acc,
        ...get(entry.groups, `${i}.commits`)!.flatMap(commit => {
          return commit.breaking_changes
        })
      ]
    )

    return this.section(
      '### ⚠ BREAKING CHANGES',
      template('{changes}\n\n', {
        changes: iterate(changes.length, '', (acc, i) => {
          const [brk] = cast<[BreakingChange]>(changes.slice(i))
          return template('{acc}{newline}- {change}', {
            acc,
            change: brk.scope
              ? template('**{scope}:** {subject}', brk)
              : brk.subject,
            newline: ifelse(acc, '\n', acc)
          })
        })
      })
    )
  }

  /**
   * Format a commit message.
   *
   * @see {@linkcode Commit}
   * @see {@linkcode Context}
   *
   * @public
   *
   * @param {Commit} commit - Parsed commit
   * @param {Context} context - Changelog context
   * @return {string} Formatted commit message
   */
  public formatCommit(commit: Commit, context: Context): string {
    return template('- {scope}{subject} ([{hash}]({url}))', {
      hash: commit.hash,
      scope: commit.scope ? `**${commit.scope}:** ` : '',
      subject: commit.subject.replace(`#${commit.pr}`, () => {
        return template('[#{pr}]({url})', {
          pr: commit.pr,
          url: this.formatPullRequestUrl(commit, context)
        })
      }),
      url: this.formatCommitUrl(commit, context)
    }).replaceAll(this.grammar.mention, (_, mention, user) => {
      return template('[{mention}]({host}/{user})', {
        host: this.formatRepositoryHost(context),
        mention,
        user
      })
    })
  }

  /**
   * Format a commit group.
   *
   * @see {@linkcode Commit}
   * @see {@linkcode Context}
   *
   * @public
   *
   * @param {CommitGroup} group - Parsed commit group
   * @param {Context} context - Changelog context
   * @return {string} Formatted commit group
   */
  public formatCommitGroup(group: CommitGroup, context: Context): string {
    return this.section(
      template('### {section}', { section: group.section }),
      template('{commits}\n', {
        commits: group.hidden
          ? ''
          : iterate(group.commits.length, '', (acc, i) => {
            return template('{acc}{newline}{commit}', {
              acc,
              commit: this.formatCommit(group.commits[i]!, context),
              newline: ifelse(acc, '\n', acc)
            })
          })
      })
    )
  }

  /**
   * Format a commit URL.
   *
   * @see {@linkcode Commit}
   * @see {@linkcode Context}
   *
   * @public
   *
   * @param {Commit} commit - Parsed commit
   * @param {Context} context - Changelog context
   * @return {string} Formatted commit URL
   */
  public formatCommitUrl(commit: Commit, context: Context): string {
    return template('{repository}/{keyword}/{sha}', {
      keyword: context.keywords.commit,
      repository: this.formatRepository(context),
      sha: commit.sha
    })
  }

  /**
   * Format a repository compare url.
   *
   * @see {@linkcode Context}
   * @see {@linkcode Entry}
   *
   * @public
   *
   * @param {Entry} entry - Changelog entry object
   * @param {Context} context - Changelog context
   * @return {string} Formatted compare url
   */
  public formatCompareUrl(entry: Entry, context: Context): string {
    return template('{repository}/compare/{last_version}...{version}', {
      last_version: entry.last_version,
      repository: this.formatRepository(context),
      version: entry.key.version || entry.key.sha
    })
  }

  /**
   * Format a changelog entry.
   *
   * @see {@linkcode Context}
   *
   * @public
   *
   * @param {Entry} entry - Changelog entry object
   * @param {Context} context - Changelog context
   * @return {string} Formatted changelog entry
   */
  public formatEntry(entry: Entry, context: Context): string {
    return this.section(
      this.formatEntryTitle(entry, context),
      template('{breaking_changes}{groups}\n', {
        breaking_changes: this.formatBreakingChanges(entry),
        groups: iterate(entry.groups.length, '', (acc, i) => {
          return template('{acc}{newline}{group}', {
            acc,
            group: this.formatCommitGroup(entry.groups[i]!, context),
            newline: ifelse(acc, '\n', acc)
          })
        })
      })
    )
  }

  /**
   * Format a changelog entry title.
   *
   * @see {@linkcode Context}
   * @see {@linkcode Entry}
   *
   * @public
   *
   * @param {Entry} entry - Changelog entry object
   * @param {Context} context - Changelog context
   * @return {string} Formatted changelog entry title
   */
  public formatEntryTitle(entry: Entry, context: Context): string {
    return template(
      template('## {header} ({date})', {
        date: entry.date,
        header: entry.last_version ? '[{version}]({compare})' : '{version}'
      }),
      {
        compare: this.formatCompareUrl(entry, context),
        version: entry.version
      }
    )
  }

  /**
   * Format a pull request URL.
   *
   * @see {@linkcode Commit}
   * @see {@linkcode Context}
   *
   * @public
   *
   * @param {Commit} commit - Parsed commit
   * @param {Context} context - Changelog context
   * @return {string} Formatted pull request URL
   */
  public formatPullRequestUrl(commit: Commit, context: Context): string {
    return template('{repository}/{keyword}/{pr}', {
      keyword: context.keywords.pr,
      pr: commit.pr,
      repository: this.formatRepository(context)
    })
  }

  /**
   * Format a repository URL.
   *
   * @public
   *
   * @param {Context} context - Changelog context
   * @return {string} Formatted repository url
   */
  public formatRepository(context: Context): string {
    return template('{host}/{owner}/{repo}', {
      host: this.formatRepositoryHost(context),
      owner: context.owner,
      repo: context.repo
    })
  }

  /**
   * Format a repository host URL.
   *
   * @public
   *
   * @param {Context} context - Changelog context
   * @return {string} Formatted repository host url
   */
  public formatRepositoryHost(context: Context): string {
    return template('https://{host}', { host: context.host })
  }

  /**
   * Create a changelog section.
   *
   * @protected
   *
   * @param {string} title - Section title
   * @param {string} text - Section content
   * @return {string} Formatted changelog section
   */
  protected section(title: string, text: string): string {
    return ifelse(
      trim(text),
      template('{title}\n\n{text}', { text, title }),
      ''
    )
  }
}

export default Formatter
