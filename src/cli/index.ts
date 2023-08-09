#!/usr/bin/env node

/**
 * @file Entry Point - CLI
 * @module mkbuild/cli
 */

import type { Optional } from '@flex-development/tutils'
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

// check if serve or watch mode is enabled
const {
  'serve.certfile': certfile = '',
  'serve.host': host = '',
  'serve.keyfile': keyfile = '',
  'serve.port': port,
  'serve.servedir': servedir = '',
  serve = !!(certfile || host || keyfile || port !== undefined || servedir),
  watch
} = mri<{
  'serve.certfile'?: string
  'serve.host'?: string
  'serve.keyfile'?: string
  'serve.port'?: number
  'serve.servedir'?: string
  serve?: Optional<boolean>
  watch?: boolean
}>(process.argv.slice(2), {
  alias: { serve: 'S', watch: 'w' },
  boolean: ['serve', 'watch'],
  default: { write: false },
  string: ['serve.certfile', 'serve.host', 'serve.keyfile', 'serve.servedir']
})

// exit process after static build
!serve && !watch && process.exit()
