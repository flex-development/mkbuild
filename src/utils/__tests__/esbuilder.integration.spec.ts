/**
 * @file Integration Tests - esbuilder
 * @module mkbuild/utils/tests/integration/esbuilder
 */

import { BUILTIN_MODULES as BUILTINS } from '#src/config/constants'
import type { Entry, SourceFile } from '#src/interfaces'
import type { Spy } from '#tests/interfaces'
import * as esbuild from 'esbuild'
import testSubject from '../esbuilder'

vi.mock('esbuild')

describe('integration:utils/esbuilder', () => {
  const build = esbuild.build as unknown as Spy<typeof esbuild['build']>

  describe('esbuild', () => {
    describe('bundling', () => {
      const src: Pick<SourceFile, 'ext' | 'file'> = {
        ext: '.mts',
        file: 'reverse.mts'
      }

      const entry: Entry = {
        bundle: true,
        declaration: true,
        ext: '.mjs',
        format: 'esm',
        outdir: 'dist/esm',
        source: `__fixtures__/${src.file}`
      }

      let plugins: esbuild.Plugin[] = []

      beforeEach(async () => {
        await testSubject(src, { ...entry, splitting: true })
        plugins = build.mock.lastCall![0]!.plugins!
      })

      describe('options', () => {
        it('should enable bundling', () => {
          expect(build.mock.lastCall![0]!.bundle).to.be.true
        })

        it('should mark built-in modules as external', () => {
          expect(build.mock.lastCall![0]!.external).to.have.members(BUILTINS)
        })
      })

      describe('plugins', () => {
        it('should add dts if declarations are enabled', () => {
          expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
            return plugin.name === 'dts'
          })
        })

        it('should not add fully-specified', () => {
          expect(plugins).to.not.containOne((plugin: esbuild.Plugin) => {
            return plugin.name === 'fully-specified'
          })
        })

        it('should not add tsconfig-paths', () => {
          expect(plugins).to.not.containOne((plugin: esbuild.Plugin) => {
            return plugin.name === 'tsconfig-paths'
          })
        })
      })
    })

    describe('transpiling', () => {
      const src: Pick<SourceFile, 'ext' | 'file'> = {
        ext: '.cts',
        file: 'my-atoi.cts'
      }

      let plugins: esbuild.Plugin[] = []

      beforeEach(async () => {
        await testSubject(src, {
          declaration: true,
          ext: '.cjs',
          format: 'cjs',
          outdir: 'dist/cjs',
          source: '__fixtures__',
          tsconfig: 'tsconfig.json'
        })
        plugins = build.mock.lastCall![0]!.plugins!
      })

      describe('options', () => {
        it('should disable bundling', () => {
          expect(build.mock.lastCall![0]!.bundle).to.not.be.true
        })
      })

      describe('plugins', () => {
        it('should add dts if declarations are enabled', () => {
          expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
            return plugin.name === 'dts'
          })
        })

        it('should add fully-specified if specifers require extensions', () => {
          expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
            return plugin.name === 'fully-specified'
          })
        })

        it('should add tsconfig-paths if tsconfig is detected', () => {
          expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
            return plugin.name === 'tsconfig-paths'
          })
        })
      })
    })
  })
})
