/**
 * @file Functional Tests - MkbuildCommand
 * @module mkbuild/cli/commands/tests/functional/MkbuildCommand
 */

import { HelpService, UtilityService } from '#src/cli/providers'
import type { Flags } from '#src/interfaces'
import make from '#src/make'
import type { Jsx, LegalComments, OutputExtension, Sourcemap } from '#src/types'
import type { Spy } from '#tests/interfaces'
import createTestingCommand from '#tests/utils/create-testing-command'
import * as mlly from '@flex-development/mlly'
import type { TestingModule } from '@nestjs/testing'
import consola from 'consola'
import type * as esbuild from 'esbuild'
import { CommandTestFactory } from 'nest-commander-testing'
import { get } from 'radash'
import TestSubject from '../mkbuild.command'

vi.mock('#src/make')
vi.mock('#src/plugins/clean/plugin')
vi.mock('#src/plugins/write/plugin')

describe('functional:cli/commands/MkbuildCommand', () => {
  let command: TestingModule
  let util: UtilityService
  let write: boolean

  beforeAll(() => {
    consola.mockTypes(() => vi.fn())
    write = true
  })

  beforeEach(async () => {
    command = await createTestingCommand({
      providers: [TestSubject, HelpService, UtilityService]
    })

    util = command.get(UtilityService)
  })

  describe('--asset-names <template>', () => {
    it('should call make with flags.assetNames', async () => {
      // Arrange
      const assetNames: string = 'assets/[name]-[hash]'

      // Act
      await CommandTestFactory.run(command, ['--asset-names', `${assetNames}`])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        assetNames,
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        bundle,
        write
      })
    })

    it('should call make with flags.bundle given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-b', bundle.toString()])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        clean,
        write
      })
    })

    it('should call make with flags.clean given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-c', clean.toString()])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({ color, write })
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        cwd,
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({ dts, write })
    })

    it('should call make with flags.dts given short flag', async () => {
      // Arrange
      const dts: NonNullable<Exclude<Flags['dts'], boolean>> = 'only'

      // Act
      await CommandTestFactory.run(command, ['-d', dts])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({ dts, write })
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({ ext, write })
    })

    it('should call make with flags.ext given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-e', ext])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({ ext, write })
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        external: [...util.parseList(external)],
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        format,
        write
      })
    })

    it('should call make with flags.format given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-f', format])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        globalName,
        write
      })
    })
  })

  describe('--help, -h', () => {
    let formatHelp: Spy<HelpService['formatHelp']>
    let subject: TestSubject

    beforeEach(() => {
      formatHelp = vi.spyOn(command.get(HelpService), 'formatHelp')
      subject = command.get(TestSubject)
    })

    it('should print help text', async () => {
      // Act
      await CommandTestFactory.run(command, ['--help'])

      // Expect
      expect(formatHelp).toHaveBeenCalledOnce()
      expect(formatHelp).toBeCalledWith(get(subject, 'command'))
      expect(consola.log).toHaveBeenCalledOnce()
      expect(make).not.toHaveBeenCalled()
    })

    it('should print help text given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-h'])

      // Expect
      expect(formatHelp).toHaveBeenCalledOnce()
      expect(formatHelp).toBeCalledWith(get(subject, 'command'))
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        ignore: parsed,
        write
      })
    })

    it('should call make with flags.ignore given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-i', ignore])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        legalComments,
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        logLevel,
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        mainFields: util.parseList(mainFields),
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        name,
        write
      })
    })

    it('should call make with flags.name given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-n', name])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        name,
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        outdir,
        write
      })
    })

    it('should call make with flags.outdir given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-o', outdir])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        pattern: parsed,
        write
      })
    })

    it('should call make with flags.pattern given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-p', pattern])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        pure: [...util.parseList(pure)],
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        resolveExtensions: util.parseList(resolveExtensions),
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        source,
        write
      })
    })

    it('should call make with flags.source given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-s', source])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        splitting,
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({
        tsconfig,
        write
      })
    })
  })

  describe('--version, -v', () => {
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
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({ watch, write })
    })

    it('should call make with flags.watch given short flag', async () => {
      // Act
      await CommandTestFactory.run(command, ['-w', watch.toString()])

      // Expect
      expect(make).toHaveBeenCalledOnce()
      expect(vi.mocked(make).mock.lastCall?.[0]).to.deep.equal({ watch, write })
    })
  })
})
