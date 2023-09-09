/**
 * @file Functional Tests - MkbuildCommand
 * @module mkbuild/cli/commands/tests/functional/MkbuildCommand
 */

import type { Opts } from '#src/cli/interfaces'
import make from '#src/make'
import type { Jsx, LegalComments, OutputExtension, Sourcemap } from '#src/types'
import type { Spy } from '#tests/interfaces'
import * as mlly from '@flex-development/mlly'
import {
  CliUtilityService,
  HelpService
} from '@flex-development/nest-commander'
import { CommandTestFactory } from '@flex-development/nest-commander/testing'
import { cast, descriptor } from '@flex-development/tutils'
import type { TestingModule } from '@nestjs/testing'
import consola from 'consola'
import type * as esbuild from 'esbuild'
import TestSubject from '../mkbuild.command'

vi.mock('#src/make')
vi.mock('#src/plugins/clean/plugin')
vi.mock('#src/plugins/write/plugin')

describe('functional:cli/commands/MkbuildCommand', () => {
  let command: TestingModule
  let util: CliUtilityService
  let write: boolean

  beforeAll(() => {
    consola.mockTypes(() => vi.fn())
    write = true
  })

  beforeEach(async () => {
    command = await CommandTestFactory.createTestingCommand({
      done: vi.fn().mockName('done'),
      error: vi.fn().mockName('error'),
      exit: vi.fn().mockName('exit'),
      providers: [TestSubject]
    })

    util = command.get(CliUtilityService)
  })

  describe('--alias <list>', () => {
    it('should call make with flags.alias', async () => {
      // Arrange
      const alias: string = 'oldpkg:newpkg'

      // Act
      await CommandTestFactory.run(command, [`--alias=${alias}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        alias: util.parseObject(alias),
        write
      })
    })
  })

  describe('--asset-names <template>', () => {
    it('should call make with flags.assetNames', async () => {
      // Arrange
      const assetNames: string = 'assets/[name]-[hash]'

      // Act
      await CommandTestFactory.run(command, [`--asset-names=${assetNames}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        assetNames,
        write
      })
    })
  })

  describe('--banner <list>', () => {
    it('should call make with flags.banner', async () => {
      // Arrange
      const banner: string = 'css:/*comment:*/,js://comment'

      // Act
      await CommandTestFactory.run(command, [`--banner=${banner}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        banner: util.parseObject(banner),
        write
      })
    })
  })

  describe('--bundle, -b [choice]', () => {
    let bundle: boolean

    beforeAll(() => {
      bundle = true
    })

    it('should call make with flags.bundle', async () => {
      // Act
      await CommandTestFactory.run(command, [`--bundle=${bundle}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        bundle,
        write
      })
    })

    it('should call make with flags.bundle given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-b'])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        bundle,
        write
      })
    })
  })

  describe('--charset <charset>', () => {
    it('should call make with flags.charset', async () => {
      // Arrange
      const charset: esbuild.Charset = 'utf8'

      // Act
      await CommandTestFactory.run(command, [`--charset=${charset}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        charset,
        write
      })
    })
  })

  describe('--chunk-names <template>', () => {
    it('should call make with flags.chunkNames', async () => {
      // Arrange
      const chunkNames: string = 'chunks/[name]-[hash]'

      // Act
      await CommandTestFactory.run(command, [`--chunk-names=${chunkNames}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        chunkNames,
        write
      })
    })
  })

  describe('--clean, -c [choice]', () => {
    let clean: boolean

    beforeAll(() => {
      clean = true
    })

    it('should call make with flags.clean', async () => {
      // Act
      await CommandTestFactory.run(command, [`--clean=${clean}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        clean,
        write
      })
    })

    it('should call make with flags.clean given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-c'])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        clean,
        write
      })
    })
  })

  describe('--color [choice]', () => {
    it('should call make with flags.color', async () => {
      // Arrange
      const color: boolean = true

      // Act
      await CommandTestFactory.run(command, [`--color=${color}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({ color, write })
    })
  })

  describe('--conditions <list>', () => {
    it('should call make with flags.conditions', async () => {
      // Arrange
      const conditions: string = 'import,default'

      // Act
      await CommandTestFactory.run(command, [`--conditions=${conditions}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        conditions: util.parseList(conditions),
        write
      })
    })
  })

  describe('--create-require [choice]', () => {
    it('should call make with flags.createRequire', async () => {
      // Arrange
      const createRequire: boolean = true

      // Act
      await CommandTestFactory.run(command, [
        `--create-require=${createRequire}`
      ])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        createRequire,
        write
      })
    })
  })

  describe('--cwd <directory>', () => {
    it('should call make with flags.cwd', async () => {
      // Arrange
      const cwd: string = '.'

      // Act
      await CommandTestFactory.run(command, [`--cwd=${cwd}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        cwd,
        write
      })
    })
  })

  describe('--define <list>', () => {
    it('should call make with flags.define', async () => {
      // Arrange
      const define: string = 'id:text,str:"text"'

      // Act
      await CommandTestFactory.run(command, [`--define=${define}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        define: util.parseObject(define),
        write
      })
    })
  })

  describe('--drop <list>', () => {
    it('should call make with flags.drop', async () => {
      // Arrange
      const drop: string = 'debugger'

      // Act
      await CommandTestFactory.run(command, [`--drop=${drop}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        drop: [...util.parseList(drop)],
        write
      })
    })
  })

  describe('--dts, -d [choice]', () => {
    it('should call make with flags.dts', async () => {
      // Arrange
      const dts: boolean = true

      // Act
      await CommandTestFactory.run(command, [`--dts=${dts}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({ dts, write })
    })

    it('should call make with flags.dts given short flag', async () => {
      // Arrange
      const dts: NonNullable<Exclude<Opts['dts'], boolean>> = 'only'

      // Act
      await CommandTestFactory.run(command, ['-d', dts])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({ dts, write })
    })
  })

  describe('--ext, -e <ext>', () => {
    let ext: OutputExtension

    beforeAll(() => {
      ext = '.mjs'
    })

    it('should call make with flags.ext', async () => {
      // Act
      await CommandTestFactory.run(command, [`--ext=${ext}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({ ext, write })
    })

    it('should call make with flags.ext given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-e', ext])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({ ext, write })
    })
  })

  describe('--external <list>', () => {
    it('should call make with flags.external', async () => {
      // Arrange
      const external: string =
        '@nestjs/microservices,@nestjs/platform-express,@nestjs/websockets/socket-module,cache-manager,class-transformer,node-fetch'

      // Act
      await CommandTestFactory.run(command, [`--external=${external}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        external: [...util.parseList(external)],
        write
      })
    })
  })

  describe('--footer <list>', () => {
    it('should call make with flags.footer', async () => {
      // Arrange
      const footer: string = 'css:/*comment:*/,js://comment'

      // Act
      await CommandTestFactory.run(command, [`--footer=${footer}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        footer: util.parseObject(footer),
        write
      })
    })
  })

  describe('--format, -f <format>', () => {
    let format: esbuild.Format

    beforeAll(() => {
      format = 'esm'
    })

    it('should call make with flags.format', async () => {
      // Act
      await CommandTestFactory.run(command, [`--format=${format}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        format,
        write
      })
    })

    it('should call make with flags.format given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-f', format])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        format,
        write
      })
    })
  })

  describe('--global-name <name>', () => {
    it('should call make with flags.globalName', async () => {
      // Arrange
      const globalName: string = 'mlly'

      // Act
      await CommandTestFactory.run(command, [`--global-name=${globalName}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        globalName,
        write
      })
    })
  })

  describe.todo('--help, -h', () => {
    let formatHelp: Spy<HelpService['formatHelp']>
    let subject: TestSubject

    beforeEach(() => {
      formatHelp = cast(vi.spyOn(command.get(HelpService), 'formatHelp'))
      subject = command.get(TestSubject)
    })

    it('should print help text', async () => {
      // Act
      await CommandTestFactory.run(command, ['--help'])

      // Expect
      expect(formatHelp).toHaveBeenCalledOnce()
      expect(formatHelp).toBeCalledWith(descriptor(subject, 'command').value)
      expect(consola.log).toHaveBeenCalledOnce()
      expect(make).not.toHaveBeenCalled()
    })

    it('should print help text given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-h'])

      // Expect
      expect(formatHelp).toHaveBeenCalledOnce()
      expect(formatHelp).toBeCalledWith(descriptor(subject, 'command').value)
      expect(consola.log).toHaveBeenCalledOnce()
      expect(make).not.toHaveBeenCalled()
    })
  })

  describe('--ignore, -i <list>', () => {
    let ignore: string
    let parsed: Set<string>

    beforeAll(() => {
      ignore = 'bin.ts,cli/**'
      parsed = util.parseList(ignore)
    })

    it('should call make with flags.ignore', async () => {
      // Act
      await CommandTestFactory.run(command, [`--ignore=${ignore}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        ignore: parsed,
        write
      })
    })

    it('should call make with flags.ignore given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-i', ignore])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        ignore: parsed,
        write
      })
    })
  })

  describe('--ignore-annotations [choice]', () => {
    it('should call make with flags.ignoreAnnotations', async () => {
      // Arrange
      const ignoreAnnotations: boolean = true

      // Act
      await CommandTestFactory.run(command, [
        `--ignore-annotations=${ignoreAnnotations}`
      ])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        ignoreAnnotations,
        write
      })
    })
  })

  describe('--inject <list>', () => {
    it('should call make with flags.inject', async () => {
      // Arrange
      const inject: string = './process-cwd-shim.mjs'

      // Act
      await CommandTestFactory.run(command, [`--inject=${inject}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        inject: [...util.parseList(inject)],
        write
      })
    })
  })

  describe('--jsx <mode>', () => {
    it('should call make with flags.jsx', async () => {
      // Arrange
      const jsx: Jsx = 'automatic'

      // Act
      await CommandTestFactory.run(command, [`--jsx=${jsx}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        jsx,
        write
      })
    })
  })

  describe('--jsx-dev [choice]', () => {
    it('should call make with flags.jsxDev', async () => {
      // Arrange
      const jsxDev: boolean = true

      // Act
      await CommandTestFactory.run(command, [`--jsx-dev=${jsxDev}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        jsx: 'automatic',
        jsxDev,
        write
      })
    })
  })

  describe('--jsx-factory <factory>', () => {
    it('should call make with flags.jsxFactory', async () => {
      // Arrange
      const jsxFactory: string = 'h'

      // Act
      await CommandTestFactory.run(command, [`--jsx-factory=${jsxFactory}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        jsxFactory,
        write
      })
    })
  })

  describe('--jsx-fragment <fragment>', () => {
    it('should call make with flags.jsxFragment', async () => {
      // Arrange
      const jsxFragment: string = 'Fragment'

      // Act
      await CommandTestFactory.run(command, [`--jsx-fragment=${jsxFragment}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        jsxFragment,
        write
      })
    })
  })

  describe('--jsx-import-source <source>', () => {
    it('should call make with flags.jsxImportSource', async () => {
      // Arrange
      const jsxImportSource: string = 'react'

      // Act
      await CommandTestFactory.run(command, [
        `--jsx-import-source=${jsxImportSource}`
      ])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        jsxImportSource,
        write
      })
    })
  })

  describe('--jsx-side-effects [choice]', () => {
    it('should call make with flags.jsxSideEffects', async () => {
      // Arrange
      const jsxSideEffects: boolean = true

      // Act
      await CommandTestFactory.run(command, [
        `--jsx-side-effects=${jsxSideEffects}`
      ])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        jsxSideEffects,
        write
      })
    })
  })

  describe('--keep-names [choice]', () => {
    it('should call make with flags.keepNames', async () => {
      // Arrange
      const keepNames: boolean = true

      // Act
      await CommandTestFactory.run(command, [`--keep-names=${keepNames}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        keepNames,
        write
      })
    })
  })

  describe('--legal-comments <choice>', () => {
    it('should call make with flags.legalComments', async () => {
      // Arrange
      const legalComments: LegalComments = 'eof'

      // Act
      await CommandTestFactory.run(command, [
        `--legal-comments=${legalComments}`
      ])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        legalComments,
        write
      })
    })
  })

  describe('--loader <list>', () => {
    it('should call make with flags.loader', async () => {
      // Arrange
      const loader: string = '.css:css,.ts:ts,.tsx:tsx'

      // Act
      await CommandTestFactory.run(command, [`--loader=${loader}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        loader: util.parseObject(loader),
        write
      })
    })
  })

  describe('--log-level <level>', () => {
    it('should call make with flags.logLevel', async () => {
      // Arrange
      const logLevel: esbuild.LogLevel = 'debug'

      // Act
      await CommandTestFactory.run(command, [`--log-level=${logLevel}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        logLevel,
        write
      })
    })
  })

  describe('--log-override <list>', () => {
    it('should call make with flags.logOverride', async () => {
      // Arrange
      const logOverride: string =
        'unsupported-dynamic-import:warning,unsupported-jsx-comment:warning'

      // Act
      await CommandTestFactory.run(command, [`--log-override=${logOverride}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        logOverride: util.parseObject(logOverride),
        write
      })
    })
  })

  describe('--log-limit <limit>', () => {
    it('should call make with flags.logLimit', async () => {
      // Arrange
      const logLimit: number = faker.number.int({ max: 13, min: 1 })

      // Act
      await CommandTestFactory.run(command, [`--log-limit=${logLimit}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        logLimit,
        write
      })
    })
  })

  describe('--main-fields <list>', () => {
    it('should call make with flags.mainFields', async () => {
      // Arrange
      const mainFields: string = 'module,main'

      // Act
      await CommandTestFactory.run(command, [`--main-fields=${mainFields}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        mainFields: util.parseList(mainFields),
        write
      })
    })
  })

  describe('--mangle-cache <list>', () => {
    it('should call make with flags.mangleCache', async () => {
      // Arrange
      const mangleCache: string =
        'customRenaming_:"cR_",disabledRenaming_:false'

      // Act
      await CommandTestFactory.run(command, [`--mangle-cache=${mangleCache}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        mangleCache: util.parseObject(mangleCache),
        write
      })
    })
  })

  describe('--mangle-props <regex>', () => {
    it('should call make with flags.mangleProps', async () => {
      // Arrange
      const mangleProps: string = '/_$/'

      // Act
      await CommandTestFactory.run(command, [`--mangle-props=${mangleProps}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        mangleProps: util.parseRegExp(mangleProps),
        write
      })
    })
  })

  describe('--mangle-quoted [choice]', () => {
    it('should call make with flags.mangleQuoted', async () => {
      // Arrange
      const mangleQuoted: boolean = true

      // Act
      await CommandTestFactory.run(command, [`--mangle-quoted=${mangleQuoted}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        mangleQuoted,
        write
      })
    })
  })

  describe('--minify [choice]', () => {
    it('should call make with flags.minify', async () => {
      // Arrange
      const minify: boolean = true

      // Act
      await CommandTestFactory.run(command, [`--minify=${minify}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        minify,
        write
      })
    })
  })

  describe('--minify-identifiers [choice]', () => {
    it('should call make with flags.minifyIdentifiers', async () => {
      // Arrange
      const minifyIdentifiers: boolean = true

      // Act
      await CommandTestFactory.run(command, [
        `--minify-identifiers=${minifyIdentifiers}`
      ])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        minifyIdentifiers,
        write
      })
    })
  })

  describe('--minify-syntax [choice]', () => {
    it('should call make with flags.minifySyntax', async () => {
      // Arrange
      const minifySyntax: boolean = true

      // Act
      await CommandTestFactory.run(command, [`--minify-syntax=${minifySyntax}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        minifySyntax,
        write
      })
    })
  })

  describe('--minify-whitespace [choice]', () => {
    it('should call make with flags.minifyWhitespace', async () => {
      // Arrange
      const minifyWhitespace: boolean = true

      // Act
      await CommandTestFactory.run(command, [
        `--minify-whitespace=${minifyWhitespace}`
      ])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        minifyWhitespace,
        write
      })
    })
  })

  describe('--name, -n <name>', () => {
    let name: string

    beforeAll(() => {
      name = 'cli'
    })

    it('should call make with flags.name', async () => {
      // Act
      await CommandTestFactory.run(command, [`--name=${name}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        name,
        write
      })
    })

    it('should call make with flags.name given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-n', name])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        name,
        write
      })
    })
  })

  describe('--out-extension <list>', () => {
    it('should call make with flags.outExtension', async () => {
      // Arrange
      const outExtension: string = '.sass:.scss'

      // Act
      await CommandTestFactory.run(command, [`--out-extension=${outExtension}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        outExtension: util.parseObject(outExtension),
        write
      })
    })
  })

  describe('--outbase <directory>', () => {
    it('should call make with flags.outbase', async () => {
      // Arrange
      const outbase: string = 'src'

      // Act
      await CommandTestFactory.run(command, [`--outbase=${outbase}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        outbase,
        write
      })
    })
  })

  describe('--outdir, -o <directory>', () => {
    let outdir: string

    beforeAll(() => {
      outdir = 'dist'
    })

    it('should call make with flags.outdir', async () => {
      // Act
      await CommandTestFactory.run(command, [`--outdir=${outdir}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        outdir,
        write
      })
    })

    it('should call make with flags.outdir given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-o', outdir])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        outdir,
        write
      })
    })
  })

  describe('--packages <choice>', () => {
    it('should call make with flags.packages', async () => {
      // Arrange
      const packages: string = 'external'

      // Act
      await CommandTestFactory.run(command, [`--packages=${packages}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        packages,
        write
      })
    })
  })

  describe('--pattern, -p <list>', () => {
    let pattern: string
    let parsed: Set<string>

    beforeAll(() => {
      pattern = '**/index.ts,enums/*,internal/*,utils/*'
      parsed = util.parseList(pattern)
    })

    it('should call make with flags.pattern', async () => {
      // Act
      await CommandTestFactory.run(command, [`--pattern=${pattern}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        pattern: parsed,
        write
      })
    })

    it('should call make with flags.pattern given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-p', pattern])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        pattern: parsed,
        write
      })
    })
  })

  describe('--platform <platform>', () => {
    it('should call make with flags.platform', async () => {
      // Arrange
      const platform: esbuild.Platform = 'node'

      // Act
      await CommandTestFactory.run(command, [`--platform=${platform}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        platform,
        write
      })
    })
  })

  describe('--preserve-symlinks [choice]', () => {
    it('should call make with flags.preserveSymlinks', async () => {
      // Arrange
      const preserveSymlinks: boolean = true

      // Act
      await CommandTestFactory.run(command, [
        `--preserve-symlinks=${preserveSymlinks}`
      ])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        preserveSymlinks,
        write
      })
    })
  })

  describe('--public-path <path>', () => {
    it('should call make with flags.publicPath', async () => {
      // Arrange
      const publicPath: string = faker.internet.url({ protocol: 'https' })

      // Act
      await CommandTestFactory.run(command, [`--public-path=${publicPath}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        publicPath,
        write
      })
    })
  })

  describe('--pure <list>', () => {
    it('should call make with flags.pure', async () => {
      // Arrange
      const pure: string = 'document.createElement'

      // Act
      await CommandTestFactory.run(command, [`--pure=${pure}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        pure: [...util.parseList(pure)],
        write
      })
    })
  })

  describe('--reserve-props <regex>', () => {
    it('should call make with flags.reserveProps', async () => {
      // Arrange
      const reserveProps: string = '/^__.*__$/'

      // Act
      await CommandTestFactory.run(command, [`--reserve-props=${reserveProps}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        reserveProps: util.parseRegExp(reserveProps),
        write
      })
    })
  })

  describe('--resolve-extensions <list>', () => {
    it('should call make with flags.resolveExtensions', async () => {
      // Arrange
      const resolveExtensions: string = 'mjs,mts,cjs,cts,js,ts,jsx,tsx,json'

      // Act
      await CommandTestFactory.run(command, [
        `--resolve-extensions=${resolveExtensions}`
      ])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        resolveExtensions: util.parseList(resolveExtensions),
        write
      })
    })
  })

  describe('--serve, -S [choice]', () => {
    it('should call make with flags.serve', async () => {
      // Act
      await CommandTestFactory.run(command, ['--serve'])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        logLevel: 'info',
        serve: {},
        write
      })
    })

    it('should call make with flags.serve given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-S', 'false'])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        logLevel: 'info',
        serve: false,
        write
      })
    })
  })

  describe('--serve.certfile <path>', () => {
    it('should call make with flags.serve.certfile', async () => {
      // Arrange
      const certfile: string = './.lego/certificates/_.mkbuild.app.crt'

      // Act
      await CommandTestFactory.run(command, [`--serve.certfile=${certfile}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        logLevel: 'info',
        serve: { certfile },
        write
      })
    })
  })

  describe('--serve.host <host>', () => {
    it('should call make with flags.serve.host', async () => {
      // Arrange
      const host: string = 'localhost'

      // Act
      await CommandTestFactory.run(command, [`--serve.host=${host}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        logLevel: 'info',
        serve: { host },
        write
      })
    })
  })

  describe('--serve.keyfile <path>', () => {
    it('should call make with flags.serve.keyfile', async () => {
      // Arrange
      const keyfile: string = './.lego/certificates/_.mkbuild.app.key'

      // Act
      await CommandTestFactory.run(command, [`--serve.keyfile=${keyfile}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        logLevel: 'info',
        serve: { keyfile },
        write
      })
    })
  })

  describe('--serve.port <port>', () => {
    it('should call make with flags.serve.port', async () => {
      // Arrange
      const port: number = 8004

      // Act
      await CommandTestFactory.run(command, [`--serve.port=${port}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        logLevel: 'info',
        serve: { port },
        write
      })
    })
  })

  describe('--serve.servedir <directory>', () => {
    it('should call make with flags.serve.servedir', async () => {
      // Arrange
      const servedir: string = 'www/js'

      // Act
      await CommandTestFactory.run(command, [`--serve.servedir=${servedir}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        logLevel: 'info',
        serve: { servedir },
        write
      })
    })
  })

  describe('--source, -s <path>', () => {
    let source: string

    beforeAll(() => {
      source = 'src'
    })

    it('should call make with flags.source', async () => {
      // Act
      await CommandTestFactory.run(command, [`--source=${source}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        source,
        write
      })
    })

    it('should call make with flags.source given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-s', source])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        source,
        write
      })
    })
  })

  describe('--source-root <root>', () => {
    it('should call make with flags.sourceRoot', async () => {
      // Arrange
      const sourceRoot: string = faker.internet.url({ protocol: 'https' })

      // Act
      await CommandTestFactory.run(command, [`--source-root=${sourceRoot}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        sourceRoot,
        write
      })
    })
  })

  describe('--sourcemap [choice]', () => {
    it('should call make with flags.sourcemap', async () => {
      // Arrange
      const sourcemap: Sourcemap = 'inline'

      // Act
      await CommandTestFactory.run(command, [`--sourcemap=${sourcemap}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        sourcemap,
        write
      })
    })
  })

  describe('--sources-content [choice]', () => {
    it('should call make with flags.sourcesContent', async () => {
      // Arrange
      const sourcesContent: boolean = true

      // Act
      await CommandTestFactory.run(command, [
        `--sources-content=${sourcesContent}`
      ])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        sourcesContent,
        write
      })
    })
  })

  describe('--splitting [choice]', () => {
    it('should call make with flags.splitting', async () => {
      // Arrange
      const splitting: boolean = true

      // Act
      await CommandTestFactory.run(command, [`--splitting=${splitting}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        splitting,
        write
      })
    })
  })

  describe('--supported <list>', () => {
    it('should call make with flags.supported', async () => {
      // Arrange
      const supported: string = 'async-await:true,bigint:false'

      // Act
      await CommandTestFactory.run(command, [`--supported=${supported}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        supported: util.parseObject(supported),
        write
      })
    })
  })

  describe('--target <list>', () => {
    it('should call make with flags.target', async () => {
      // Arrange
      const target: string = 'node16.20.0,es2021'

      // Act
      await CommandTestFactory.run(command, [`--target=${target}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        target: [...util.parseList(target)],
        write
      })
    })
  })

  describe('--tree-shaking [choice]', () => {
    it('should call make with flags.treeShaking', async () => {
      // Arrange
      const treeShaking: boolean = true

      // Act
      await CommandTestFactory.run(command, [`--tree-shaking=${treeShaking}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        treeShaking,
        write
      })
    })
  })

  describe('--tsconfig <tsconfig>', () => {
    it('should call make with flags.tsconfig', async () => {
      // Arrange
      const tsconfig: string = 'tsconfig.build.json'

      // Act
      await CommandTestFactory.run(command, [`--tsconfig=${tsconfig}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({
        tsconfig,
        write
      })
    })
  })

  describe.todo('--version, -v', () => {
    let version: string

    beforeAll(() => {
      version = mlly.readPackageJson()!.version!
    })

    it('should print version number', async () => {
      // Act
      await CommandTestFactory.run(command, ['--version'])

      // Expect
      expect(consola.log).toHaveBeenCalledOnce()
      expect(consola.log).toBeCalledWith(version)
      expect(make).not.toHaveBeenCalled()
    })

    it('should print version number given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-v'])

      // Expect
      expect(consola.log).toHaveBeenCalledOnce()
      expect(consola.log).toBeCalledWith(version)
      expect(make).not.toHaveBeenCalled()
    })
  })

  describe('--watch, -w [choice]', () => {
    let watch: boolean

    beforeAll(() => {
      watch = true
    })

    it('should call make with flags.watch', async () => {
      // Act
      await CommandTestFactory.run(command, [`--watch=${watch}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({ watch, write })
    })

    it('should call make with flags.watch given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-w', watch.toString()])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.eql({ watch, write })
    })
  })
})
