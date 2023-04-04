#!/usr/bin/env node

/**
 * @file Entry Point - CLI
 * @module mkbuild/cli
 */

import { CommandFactory } from 'nest-commander'
import AppModule from './app.module'
import { CLI_NAME } from './constants'

/**
 * CLI application runner.
 *
 * @async
 *
 * @return {Promise<void>} Nothing when complete
 */
async function main(): Promise<void> {
  return void (await CommandFactory.run(AppModule, {
    cliName: CLI_NAME,
    errorHandler: AppModule.errorHandler,
    logger: ['error', 'warn'],
    serviceErrorHandler: AppModule.serviceErrorHandler,
    usePlugins: false
  }))
}

// run application and exit
void (await main())
process.exit()
