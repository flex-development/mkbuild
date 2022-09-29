/**
 * @file Integration Tests - esbuilder
 * @module mkbuild/utils/tests/integration/esbuilder
 */

import type { Entry } from '#src/interfaces'
import type { Spy } from '#tests/interfaces'
import * as esbuild from 'esbuild'
import testSubject from '../esbuilder'

vi.mock('esbuild')

describe('integration:utils/esbuilder', () => {
  const build = esbuild.build as unknown as Spy<typeof esbuild['build']>

  describe('esbuild', () => {
    describe('bundling', () => {
      const entry: Entry = {
        assetNames: 'assets/[name]-[hash]',
        bundle: true,
        chunkNames: 'chunks/[name]-[hash]',
        ext: '.mjs',
        format: 'esm',
        outdir: 'dist/esm',
        platform: 'node',
        source: '__fixtures__/reverse.mts',
        splitting: true
      }

      let plugins: esbuild.Plugin[] = []

      beforeEach(async () => {
        await testSubject(entry)
        plugins = build.mock.lastCall![0]!.plugins!
      })

      it('should enable bundling', () => {
        expect(build.mock.lastCall![0]!.bundle).to.be.true
      })

      it('should support asset names', () => {
        expect(build.mock.lastCall![0]!.assetNames).to.equal(entry.assetNames)
      })

      it('should support code splitting', () => {
        expect(build.mock.lastCall![0]!.chunkNames).to.equal(entry.chunkNames)
        expect(build.mock.lastCall![0]!.splitting).to.equal(entry.splitting)
      })

      it('should use create-require plugin if esm bundle for node', () => {
        expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
          return plugin.name === 'create-require'
        })
      })
    })

    describe('plugins', () => {
      let plugins: esbuild.Plugin[] = []

      beforeEach(async () => {
        await testSubject({
          createRequire: true,
          dts: true,
          ext: '.js',
          format: 'esm',
          outdir: 'dist/esm',
          pattern: 'dbl-linear.ts',
          source: '__fixtures__',
          tsconfig: 'tsconfig.json'
        })

        plugins = build.mock.lastCall![0]!.plugins!
      })

      it('should use create-require if requested', () => {
        expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
          return plugin.name === 'create-require'
        })
      })

      it('should use dts if declarations are enabled', () => {
        expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
          return plugin.name === 'dts'
        })
      })

      it('should use fully-specified if specifers require extensions', () => {
        expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
          return plugin.name === 'fully-specified'
        })
      })

      it('should use tsconfig-paths if tsconfig is detected', () => {
        expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
          return plugin.name === 'tsconfig-paths'
        })
      })
    })

    describe('transpiling', () => {
      beforeEach(async () => {
        await testSubject({
          ext: '.cjs',
          format: 'cjs',
          outdir: 'dist/cjs',
          pattern: ['my-atoi.cts', 'save-mark.d.cts'],
          source: '__fixtures__'
        })
      })

      it('should disable bundling', () => {
        expect(build.mock.lastCall![0]!.bundle).to.not.be.true
      })
    })
  })
})
