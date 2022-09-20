/**
 * @file Integration Tests - esbuilder
 * @module mkbuild/utils/tests/integration/esbuilder
 */

import { BUILTIN_MODULES as BUILTINS } from '#src/config/constants'
import type { Entry, SourceFile } from '#src/interfaces'
import dts from '#src/plugins/dts/plugin'
import fullySpecified from '#src/plugins/fully-specified/plugin'
import tsconfigPaths from '#src/plugins/tsconfig-paths/plugin'
import type { Spy } from '#tests/interfaces'
import * as esbuild from 'esbuild'
import testSubject from '../esbuilder'

vi.mock('#src/plugins/dts/plugin')
vi.mock('#src/plugins/fully-specified/plugin')
vi.mock('#src/plugins/tsconfig-paths/plugin')
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

      beforeEach(async () => {
        await testSubject(src, { ...entry, splitting: true })
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
        describe('dts', () => {
          it('should add plugin if declarations should be generated', () => {
            expect(dts).toHaveBeenCalledOnce()
          })
        })

        describe('fully-specified', () => {
          it('should not add plugin', () => {
            expect(fullySpecified).toHaveBeenCalledTimes(0)
          })
        })

        describe('tsconfig-paths', () => {
          it('should not add plugin', () => {
            expect(fullySpecified).toHaveBeenCalledTimes(0)
          })
        })
      })
    })

    describe('transpiling', () => {
      const src: Pick<SourceFile, 'ext' | 'file'> = {
        ext: '.cts',
        file: 'my-atoi.cts'
      }

      beforeEach(async () => {
        await testSubject(src, {
          declaration: true,
          ext: '.cjs',
          format: 'cjs',
          outdir: 'dist/cjs',
          source: '__fixtures__'
        })
      })

      describe('options', () => {
        it('should disable bundling', () => {
          expect(build.mock.lastCall![0]!.bundle).to.not.be.true
        })
      })

      describe('plugins', () => {
        describe('dts', () => {
          it('should add plugin if declarations should be generated', () => {
            expect(dts).toHaveBeenCalledOnce()
          })
        })

        describe('fully-specified', () => {
          it('should add plugin if specifers need extensions', () => {
            expect(fullySpecified).toHaveBeenCalledOnce()
          })
        })

        describe('tsconfig-paths', () => {
          it('should add plugin if tsconfig is detected', () => {
            expect(tsconfigPaths).toHaveBeenCalledOnce()
          })
        })
      })
    })
  })
})
