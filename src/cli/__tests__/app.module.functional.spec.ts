/**
 * @file Functional Tests - AppModule
 * @module mkbuild/cli/tests/functional/AppModule
 */

import { ERR_MODULE_NOT_FOUND, type NodeError } from '@flex-development/errnode'
import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import { cast, template } from '@flex-development/tutils'
import * as color from 'colorette'
import { CommanderError } from 'commander'
import consola from 'consola'
import * as esbuild from 'esbuild'
import { fileURLToPath } from 'node:url'
import TestSubject from '../app.module'

vi.mock('esbuild')

describe('functional:cli/AppModule', () => {
  beforeAll(() => {
    consola.mockTypes(() => vi.fn())
  })

  describe('.errorHandler', () => {
    it('should handle error with exit code 0', () => {
      // Arrange
      const code: string = 'commander.helpDisplayed'
      const message: string = '(outputHelp)'
      const error: CommanderError = new CommanderError(0, code, message)

      // Act
      TestSubject.errorHandler(error)

      // Expect
      expect(process).to.have.property('exitCode', error.exitCode)
      expect(consola.log).not.toHaveBeenCalled()
    })

    it('should handle error with exit code greater than 0', () => {
      // Arrange
      const code: string = 'commander.unknownOption'
      const message: string = "error: unknown option '--formatter'"
      const error: CommanderError = new CommanderError(1, code, message)
      const log: string = template('{0} {1} {2}', {
        0: color.red('✘'),
        1: color.bgRed('[ERROR]'),
        2: color.white(error.message)
      })

      // Act
      TestSubject.errorHandler(error)

      // Expect
      expect(process).to.have.property('exitCode').equal(error.exitCode)
      expect(consola.log).toHaveBeenCalledOnce()
      expect(consola.log).toHaveBeenCalledWith(log)
    })
  })

  describe('.serviceErrorHandler', () => {
    it('should handle Error', () => {
      // Arrange
      const error: NodeError = new ERR_MODULE_NOT_FOUND(
        pathe.join('__fixtures__/pkg/no-package-json', 'package.json'),
        fileURLToPath(mlly.toURL('dist/make.mjs')),
        'module'
      )
      const log: string = template('{0} {1} {2}', {
        0: color.red('✘'),
        1: color.bgRed('[ERROR]'),
        2: color.white(error.message)
      })

      // Act
      TestSubject.serviceErrorHandler(error)

      // Expect
      expect(process).to.have.property('exitCode', 1)
      expect(consola.log).toHaveBeenCalledOnce()
      expect(consola.log).toHaveBeenCalledWith(log)
    })

    it('should handle esbuild.BuildFailure', () => {
      // Act
      TestSubject.serviceErrorHandler(
        cast<esbuild.BuildFailure>({
          ...new Error('Cannot use "external" without "bundle"'),
          errors: [],
          warnings: []
        })
      )

      // Expect
      expect(process).to.have.property('exitCode', 1)
      expect(consola.log).not.toHaveBeenCalled()
    })
  })
})
