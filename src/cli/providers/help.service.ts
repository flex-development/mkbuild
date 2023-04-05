/**
 * @file CLI Providers - HelpService
 * @module mkbuild/cli/providers/HelpService
 */

import { Injectable } from '@nestjs/common'
import * as commander from 'commander'
import { flat, fork } from 'radash'
import { dedent } from 'ts-dedent'

/**
 * Help flag (`-h, --help`) behavior provider.
 *
 * @see https://github.com/tj/commander.js#more-configuration-2
 *
 * @class
 * @extends {commander.Help}
 */
@Injectable()
class HelpService extends commander.Help {
  /**
   * Maximum text length.
   *
   * @public
   * @override
   * @instance
   * @member {number} helpWidth
   */
  public override helpWidth: number

  /**
   * Creates a new help service instance.
   *
   */
  constructor() {
    super()
    this.helpWidth = process.stdout.columns
    this.sortOptions = true
  }

  /**
   * Help text formatter.
   *
   * @public
   * @override
   *
   * @param {commander.Command} cmd - Command to evaluate
   * @return {string} Formatted help text
   */
  public override formatHelp(cmd: commander.Command): string {
    /**
     * Indentation size.
     *
     * @const {number} indent
     */
    const indent: number = 2

    /**
     * Amount of space between the end of an {@linkcode Option} term and
     * beginning of an {@linkcode Option} description.
     *
     * @see {@linkcode Help.optionDescription}
     * @see {@linkcode Help.optionTerm}
     *
     * @const {number} padwidth
     */
    const padwidth: number = this.padWidth(cmd, this) + indent

    /**
     * Visible command options.
     *
     * @see {@linkcode Help.visibleOptions}
     *
     * @const {commander.Option[]} options
     */
    const options: commander.Option[] = flat(
      fork(
        this.visibleOptions(cmd),
        option => option.name() !== 'help' && option.name() !== 'version'
      )
    )

    return dedent`
      Description
        ${this.wrap(this.commandDescription(cmd), this.helpWidth, 0)}

      Usage
        $ ${this.commandUsage(cmd)}

      Options
      ${options.reduce((acc: string, option: commander.Option): string => {
        /**
         * Number of spaces to add to the end of {@linkcode option} term.
         *
         * @const {number} padend
         */
        const padend: number = padwidth + (option.short ? indent * 2 : 0)

        /**
         * String representation of {@linkcode option}.
         *
         * @const {string} str
         */
        const str: string =
          ' '.repeat(indent) +
          (option.short ? '' : ' '.repeat(indent * 2)) +
          this.optionTerm(option).padEnd(padend) +
          this.optionDescription(option)

        return (acc += `${this.wrap(str, this.helpWidth - indent, padwidth)}\n`)
      }, '')}
    `
  }

  /**
   * Retrieves an option term by `name`.
   *
   * @see {@linkcode Help.optionTerm}
   *
   * @public
   *
   * @param {string} name - Option name
   * @param {commander.Command} cmd - Command to evaluate
   * @return {string} Option flags for `name`
   * @throws {commander.CommanderError}
   */
  public optionTermByName(name: string, cmd: commander.Command): string {
    /**
     * Visible command options.
     *
     * @see {@linkcode Help.visibleOptions}
     *
     * @const {commander.Option[]} options
     */
    const options: commander.Option[] = this.visibleOptions(cmd)

    /**
     * Option in {@linkcode options} with the name {@linkcode name}, if any.
     *
     * @const {commander.Option | undefined} option
     */
    const option: commander.Option | undefined = options.find(option => {
      return option.name() === name
    })

    // throw if option was not found
    if (!option) {
      throw new commander.CommanderError(
        1,
        'commander.unknownOption',
        `error: unknown option '${name}'`
      )
    }

    return this.optionTerm(option)
  }
}

export default HelpService