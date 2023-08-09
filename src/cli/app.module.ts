/**
 * @file CLI - AppModule
 * @module mkbuild/cli/AppModule
 */

import { cast, isArray, template } from '@flex-development/tutils'
import { Module } from '@nestjs/common'
import type * as commander from 'commander'
import consola from 'consola'
import type * as esbuild from 'esbuild'
import color from 'tinyrainbow'
import { MkbuildCommand } from './commands'
import { HelpService, UtilityService } from './providers'

/**
 * CLI application module.
 *
 * @class
 */
@Module({ providers: [MkbuildCommand, HelpService, UtilityService] })
class AppModule {
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
  public static errorHandler(error: commander.CommanderError): void {
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
}

export default AppModule
