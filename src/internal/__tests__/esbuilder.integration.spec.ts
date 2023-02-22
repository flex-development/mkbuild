/**
 * @file Integration Tests - esbuilder
 * @module mkbuild/internal/tests/integration/esbuilder
 */

import type { Entry } from '#src/interfaces'
import type { Spy } from '#tests/interfaces'
import * as esbuild from 'esbuild'
import testSubject from '../esbuilder'

vi.mock('#src/plugins/write/plugin')
vi.mock('esbuild')

describe('integration:internal/esbuilder', () => {
  describe('esbuild', () => {
    let build: Spy<(typeof esbuild)['build']>

    beforeEach(() => {
      build = esbuild.build as unknown as typeof build
    })

    describe('bundling', () => {
      let entry: Partial<Entry>
      let plugins: esbuild.Plugin[]

      beforeAll(() => {
        entry = {
          assetNames: 'assets/[name]-[hash]',
          bundle: true,
          chunkNames: 'chunks/[name]-[hash]',
          cwd: '__fixtures__/pkg/reverse',
          dts: false,
          format: 'esm',
          name: 'index',
          platform: 'node',
          splitting: true
        }
      })

      beforeEach(async () => {
        await testSubject(entry)
        plugins = build.mock.lastCall![0]!.plugins!
      })

      it('should enable bundling', () => {
        expect(build.mock.lastCall![0]!.bundle).to.be.true
      })

      it('should use create-require plugin if esm bundle is for node', () => {
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
          cwd: '__fixtures__/pkg/dbl-linear',
          dts: true,
          ext: '.js',
          format: 'esm',
          outdir: '.',
          pattern: 'dbl-linear.ts',
          source: '.',
          tsconfig: 'tsconfig.json',
          write: true
        })

        plugins = build.mock.lastCall![0]!.plugins!
      })

      it('should use create-require if requested', () => {
        expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
          return plugin.name === 'create-require'
        })
      })

      it('should use decorators if tsconfig file is passed', () => {
        expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
          return plugin.name === 'decorators'
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

      it('should use tsconfig-paths if tsconfig file is passed', () => {
        expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
          return plugin.name === 'tsconfig-paths'
        })
      })

      it('should use write if requested', () => {
        expect(plugins).to.containExactlyOne((plugin: esbuild.Plugin) => {
          return plugin.name === 'write'
        })
      })
    })

    describe('transpiling', () => {
      beforeEach(async () => {
        await testSubject({
          cwd: '__fixtures__/pkg/my-atoi',
          ext: '.cjs',
          format: 'cjs',
          tsconfig: 'tsconfig.json'
        })
      })

      it('should disable bundling', () => {
        expect(build.mock.lastCall![0]!.bundle).to.not.be.true
      })
    })
  })
})
