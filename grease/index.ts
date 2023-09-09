#!/usr/bin/env node

/**
 * @file grease
 * @module grease
 */

import { Program, ProgramFactory } from '@flex-development/nest-commander'
import { Module } from '@nestjs/common'
import { ChangelogCommand } from './commands'
import { Grammar } from './models'
import { ChangelogService } from './providers'

/**
 * CLI application module.
 *
 * @class
 */
@Module({
  providers: [ChangelogCommand, ChangelogService, Grammar]
})
class ProgramModule {
  /**
   * Creates a new CLI application module.
   *
   * @param {Program} program - CLI program instance
   */
  constructor(protected readonly program: Program) {
    program.name('grease')
  }
}

await (await ProgramFactory.create(ProgramModule)).run()
