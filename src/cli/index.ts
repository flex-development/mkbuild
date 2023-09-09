#!/usr/bin/env node

/**
 * @file Entry Point - CLI
 * @module mkbuild/cli
 */

import pkg from '#pkg' assert { type: 'json' }
import { ProgramFactory } from '@flex-development/nest-commander'
import { isFalsy } from '@flex-development/tutils'
import AppModule from './app.module'

// run program
await (
  await ProgramFactory.create(AppModule, {
    done: AppModule.done,
    error: AppModule.error,
    excess: !isFalsy(process.env.LINT_STAGED),
    exit: AppModule.exit,
    version: pkg.version
  })
).run()
