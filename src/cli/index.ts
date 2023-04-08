#!/usr/bin/env node

/**
 * @file Entry Point - CLI
 * @module mkbuild/cli
 */

import mri from 'mri'
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

// run application
void (await main())

// check if watch mode is enabled
const { watch } = mri<{ watch: boolean }>(process.argv.slice(2), {
  alias: { watch: 'w' },
  boolean: ['watch'],
  default: { write: false }
})

// exit if watch mode is not enabled
!watch && process.exit()
