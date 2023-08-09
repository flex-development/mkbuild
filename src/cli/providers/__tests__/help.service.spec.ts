/**
 * @file Unit Tests - HelpService
 * @module mkbuild/cli/providers/tests/unit/HelpService
 */

import { CLI_NAME } from '#src/cli/constants'
import { cast, set } from '@flex-development/tutils'
import * as commander from 'commander'
import { Command } from 'commander'
import TestSubject from '../help.service'

describe('unit:cli/providers/HelpService', () => {
  let cmd: Command
  let subject: TestSubject

  beforeAll(() => {
    cmd = new Command(CLI_NAME)
      .usage('[options]')
      .description('An esbuild based file-to-file transformer and bundler')
      .option('--sourcemap [choice]', 'Generate sourcemaps')
      .option('-b, --bundle [choice]', 'Bundle files', false)
      .option('-c, --clean [choice]', 'Remove output directories', true)
      .option('-d, --dts [choice]', 'Generate TypeScript declaration files')
      .option('-e, --ext <ext>', 'Output file extension')
      .option('-f, --format <format>', 'Output file format', 'esm')
      .option('-n, --name <name>', 'Bundle output file name', '[name]')
      .option('-o, --outdir <directory>', 'Output directory', 'dist')
      .option('-s, --source <path>', 'Source directory or bundle input path')
      .option('-w, --watch [choice]', 'Watch files', false)
      .option('-h, --help', 'Display this message')
      .option('-v, --version', 'Display version number')
    subject = new TestSubject()
  })

  describe('constructor', () => {
    it('should set #helpWidth', () => {
      expect(subject.helpWidth).to.equal(process.stdout.columns)
    })

    it('should set #sortOptions', () => {
      expect(subject.sortOptions).to.be.true
    })
  })

  describe('#formatHelp', () => {
    it('should return formatted help text', () => {
      expect(set(subject, 'helpWidth', 100).formatHelp(cmd)).toMatchSnapshot()
    })
  })

  describe('#optionTermByName', () => {
    it('should return option term', () => {
      // Arrange
      const term: string = '-f, --format <format>'

      // Expect
      expect(subject.optionTermByName('format', cmd)).to.equal(term)
    })

    it('should throw if option with name was not found', () => {
      // Arrange
      const name: string = 'foo'
      const message: string = `error: unknown option '${name}'`
      let error!: commander.CommanderError

      // Act
      try {
        subject.optionTermByName(name, cmd)
      } catch (e: unknown) {
        error = cast(e)
      }

      // Expect
      expect(error).to.be.instanceof(commander.CommanderError)
      expect(error).to.have.property('code', 'commander.unknownOption')
      expect(error).to.have.property('exitCode', 1)
      expect(error).to.have.property('message', message)
    })
  })
})
