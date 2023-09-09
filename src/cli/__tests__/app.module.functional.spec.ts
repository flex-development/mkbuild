/**
 * @file Functional Tests - AppModule
 * @module mkbuild/cli/tests/functional/AppModule
 */

import type { Spy } from '#tests/interfaces'
import { ERR_MODULE_NOT_FOUND, type NodeError } from '@flex-development/errnode'
import * as mlly from '@flex-development/mlly'
import { CommanderError } from '@flex-development/nest-commander/commander'
import pathe from '@flex-development/pathe'
import { cast, template } from '@flex-development/tutils'
import consola from 'consola'
import type * as esbuild from 'esbuild'
import { fileURLToPath } from 'node:url'
import color from 'tinyrainbow'
import TestSubject from '../app.module'

vi.mock('esbuild')

describe('functional:cli/AppModule', () => {
  beforeAll(() => {
    consola.mockTypes(() => vi.fn())
  })

  describe('.done', () => {
    let args: string[]
    let exit: Spy<(typeof process)['exit']>

    beforeEach(() => {
      args = []
      exit = vi.spyOn(process, 'exit').mockImplementationOnce(vi.fn())
    })

    it('should not terminate process in serve mode', () => {
      // Act
      TestSubject.done(args, { serve: {} })

      // Expect
      expect(exit).not.toHaveBeenCalled()
    })

    it('should not terminate process in watch mode', () => {
      // Act
      TestSubject.done(args, { watch: true })

      // Expect
      expect(exit).not.toHaveBeenCalled()
    })

    it('should terminate process after static build', () => {
      // Act
      TestSubject.done(args, { bundle: true })

      // Expect
      expect(exit).toHaveBeenCalledOnce()
    })
  })

  describe('.error', () => {
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
      TestSubject.error(error)

      // Expect
      expect(process).to.have.property('exitCode', 1)
      expect(consola.log).toHaveBeenCalledOnce()
      expect(consola.log).toHaveBeenCalledWith(log)
    })

    it('should handle esbuild.BuildFailure', () => {
      // Act
      TestSubject.error(
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

  describe('.exit', () => {
    it('should handle error with exit code 0', () => {
      // Arrange
      const code: string = 'commander.helpDisplayed'
      const message: string = '(outputHelp)'
      const error: CommanderError = new CommanderError(0, code, message)

      // Act
      TestSubject.exit(error)

      // Expect
      expect(process).to.have.property('exitCode', error.exitCode)
      expect(consola.log).not.toHaveBeenCalled()
    })

    it('should handle error with exit code greater than 0', () => {
      // Arrange
      const code: string = 'commander.unknownOption'
      const message: string = 'error: unknown option \'--formatter\''
      const error: CommanderError = new CommanderError(1, code, message)
      const log: string = template('{0} {1} {2}', {
        0: color.red('✘'),
        1: color.bgRed('[ERROR]'),
        2: color.white(error.message)
      })

      // Act
      TestSubject.exit(error)

      // Expect
      expect(process).to.have.property('exitCode').equal(error.exitCode)
      expect(consola.log).toHaveBeenCalledOnce()
      expect(consola.log).toHaveBeenCalledWith(log)
    })
  })
})
