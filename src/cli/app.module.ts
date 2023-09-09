/**
 * @file CLI - AppModule
 * @module mkbuild/cli/AppModule
 */

import type * as commander from '@flex-development/nest-commander/commander'
import { cast, isArray, isObject, template } from '@flex-development/tutils'
import { Module } from '@nestjs/common'
import consola from 'consola'
import type * as esbuild from 'esbuild'
import color from 'tinyrainbow'
import { MkbuildCommand } from './commands'
import type { Opts } from './interfaces'

/**
 * CLI application module.
 *
 * @class
 */
@Module({ providers: [MkbuildCommand] })
class AppModule {
  /**
   * Callback ran after command-line arguments are parsed and the CLI program
   * has run successfully.
   *
   * @public
   * @static
   *
   * @param {string[]} args - Parsed command arguments
   * @param {Partial<Opts>} opts - Parsed command options
   * @return {void} Nothing when complete
   */
  public static done(args: string[], opts: Partial<Opts>): void {
    return void (!isObject(opts.serve) && !opts.watch && process.exit())
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
  public static error(error: Error): void {
    const { errors, warnings } = cast<esbuild.BuildFailure>(error)

    // format and log non-esbuild error
    if (!isArray(errors) && !isArray(warnings)) {
      consola.log(
        template('{{0} {1} {2}', {
          0: color.red('✘'),
          1: color.bgRed('[ERROR]'),
          2: color.white(error.message)
        })
      )
    }

    return void (process.exitCode = 1)
  }

  /**
   * Commander error handler.
   *
   * @see {@linkcode commander.Command.exitOverride}
   * @see {@linkcode commander.CommanderError}
   * @see https://github.com/jmcdo29/nest-commander/blob/nest-commander%403.6.1/packages/nest-commander/src/command-runner.service.ts#L49-L51
   *
   * @public
   * @static
   *
   * @param {commander.CommanderError} error - Error to handle
   * @return {void} Nothing when complete
   */
  public static exit(error: commander.CommanderError): void {
    if (error.exitCode) {
      consola.log(
        template('{{0} {1} {2}', {
          0: color.red('✘'),
          1: color.bgRed('[ERROR]'),
          2: color.white(error.message)
        })
      )
    }

    return void (process.exitCode = error.exitCode)
  }
}

export default AppModule
