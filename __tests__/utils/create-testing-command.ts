/**
 * @file Test Utilities - createTestingCommand
 * @module tests/utils/createTestingCommand
 */

import AppModule from '#src/cli/app.module'
import { CLI_NAME } from '#src/cli/constants'
import type { Omit } from '@flex-development/tutils'
import { Module } from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'
import { CommandRunnerModule } from 'nest-commander'
import {
  CommandTestFactory,
  type CommandModuleMetadata
} from 'nest-commander-testing'

/**
 * Creates a CLI command testing module.
 *
 * @see https://nest-commander.jaymcdoniel.dev/testing/factory
 *
 * @async
 *
 * @param {Omit<CommandModuleMetadata, 'imports'>} metadata - Module metadata
 * @return {Promise<TestingModule>} CLI command testing module
 */
const createTestingCommand = async (
  metadata: Omit<CommandModuleMetadata, 'imports'>
): Promise<TestingModule> => {
  /**
   * Test CLI application module.
   *
   * @class
   */
  @Module(metadata)
  class TestAppModule {}

  return CommandTestFactory.createTestingCommand({
    imports: [
      CommandRunnerModule.forModule(undefined, {
        cliName: CLI_NAME,
        enablePositionalOptions: true,
        errorHandler: AppModule.errorHandler,
        pluginsAvailable: false,
        serviceErrorHandler: AppModule.serviceErrorHandler,
        usePlugins: false
      }),
      TestAppModule
    ]
  }).compile()
}

export default createTestingCommand
