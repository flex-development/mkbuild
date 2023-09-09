/**
 * @file Vitest Configuration
 * @module config/vitest
 * @see https://vitest.dev/config/
 */

import { DECORATOR_REGEX } from '@flex-development/decorator-regex'
import pathe from '@flex-development/pathe'
import { cast, split, type Nullable } from '@flex-development/tutils'
import swc from '@swc/core'
import ci from 'is-ci'
import tsconfigpaths from 'vite-tsconfig-paths'
import {
  defineConfig,
  type UserConfig,
  type UserConfigExport
} from 'vitest/config'
import { BaseSequencer, type WorkspaceSpec } from 'vitest/node'
import tsconfig from './tsconfig.json' assert { type: 'json' }

/**
 * Vitest configuration export.
 *
 * @const {UserConfigExport} config
 */
const config: UserConfigExport = defineConfig((): UserConfig => {
  /**
   * [`lint-staged`][1] check.
   *
   * [1]: https://github.com/okonet/lint-staged
   *
   * @const {boolean} LINT_STAGED
   */
  const LINT_STAGED: boolean = !!Number.parseInt(process.env.LINT_STAGED ?? '0')

  return {
    define: {},
    plugins: [
      {
        enforce: 'pre',
        name: 'decorators',

        /**
         * Transforms source `code` containing decorators.
         *
         * @see https://github.com/swc-project/swc/issues/3854
         *
         * @param {string} code - Source code
         * @param {string} id - Module id of source code
         * @return {Promise<Nullable<{ code: string }>>} Transform result
         */
        async transform(
          code: string,
          id: string
        ): Promise<Nullable<{ code: string }>> {
          // do nothing if source code does not contain decorators
          DECORATOR_REGEX.lastIndex = 0
          if (!DECORATOR_REGEX.test(code)) return null

          /**
           * Regular expression used to match constructor parameters.
           *
           * @see https://regex101.com/r/kTq0JK
           *
           * @const {RegExp} CONSTRUCTOR_PARAMS_REGEX
           */
          const CONSTRUCTOR_PARAMS_REGEX: RegExp =
            /(?<=constructor\(\s*)([^\n)].+?)(?=\n? *?\) ?{)/gs

          // add "/* c8 ignore next */" before constructor parameters
          for (const [match] of code.matchAll(CONSTRUCTOR_PARAMS_REGEX)) {
            code = code.replace(match, (params: string): string => {
              return split(params, '\n').reduce((acc, param) => {
                return acc.replace(
                  param,
                  param.replace(/(\S)/, '/* c8 ignore next */ $1')
                )
              }, params)
            })
          }

          return {
            code: (
              await swc.transform(code, {
                configFile: false,
                filename: id,
                inlineSourcesContent: true,
                jsc: {
                  keepClassNames: true,
                  parser: {
                    decorators: true,
                    dynamicImport: true,
                    syntax: 'typescript',
                    tsx: pathe.extname(id) === '.tsx'
                  },
                  target: cast<swc.JscTarget>(tsconfig.compilerOptions.target),
                  transform: {
                    decoratorMetadata:
                      tsconfig.compilerOptions.emitDecoratorMetadata,
                    legacyDecorator: true,
                    useDefineForClassFields:
                      tsconfig.compilerOptions.useDefineForClassFields
                  }
                },
                sourceMaps: 'inline',
                swcrc: false
              })
            ).code
          }
        }
      },
      tsconfigpaths({ projects: [pathe.resolve('tsconfig.json')] })
    ],
    test: {
      allowOnly: !ci,
      benchmark: {},
      chaiConfig: {
        includeStack: true,
        showDiff: true,
        truncateThreshold: 0
      },
      clearMocks: true,
      coverage: {
        all: !LINT_STAGED,
        clean: true,
        cleanOnRerun: true,
        exclude: [
          '**/__mocks__/**',
          '**/__tests__/**',
          '**/index.ts',
          '**/interfaces/',
          '**/types/',
          'src/plugins/**/options.ts'
        ],
        extension: ['.ts'],
        include: ['src'],
        provider: 'v8',
        reporter: [...(ci ? [] : (['html'] as const)), 'lcovonly', 'text'],
        reportsDirectory: './coverage',
        skipFull: false
      },
      environment: 'node',
      environmentOptions: {},
      globalSetup: [],
      globals: true,
      hookTimeout: 10 * 1000,
      include: [
        `**/__tests__/*.${LINT_STAGED ? '{spec,spec-d}' : 'spec'}.{ts,tsx}`
      ],
      isolate: true,
      mockReset: true,
      outputFile: { json: './__tests__/report.json' },
      passWithNoTests: true,
      reporters: [
        'json',
        'verbose',
        ...(ci ? [] : ['./__tests__/reporters/notifier.ts'])
      ],
      /**
       * Stores snapshots next to `file`'s directory.
       *
       * @param {string} file - Path to test file
       * @param {string} extension - Snapshot extension
       * @return {string} Custom snapshot path
       */
      resolveSnapshotPath(file: string, extension: string): string {
        return pathe.resolve(
          pathe.resolve(pathe.dirname(pathe.dirname(file)), '__snapshots__'),
          pathe.basename(file).replace(/\.spec.tsx?/, '') + extension
        )
      },
      restoreMocks: true,
      root: process.cwd(),
      sequence: {
        sequencer: class Sequencer extends BaseSequencer {
          /**
           * Determines test file execution order.
           *
           * @public
           * @override
           * @async
           *
           * @param {WorkspaceSpec[]} specs - Workspace spec objects
           * @return {Promise<WorkspaceSpec[]>} `files` sorted
           */
          public override async sort(
            specs: WorkspaceSpec[]
          ): Promise<WorkspaceSpec[]> {
            return (await super.sort(specs)).sort(([, file1], [, file2]) => {
              return file1.localeCompare(file2)
            })
          }
        }
      },
      setupFiles: ['./__tests__/setup/index.ts'],
      silent: false,
      singleThread: true,
      slowTestThreshold: 5000,
      snapshotFormat: {
        callToJSON: true,
        min: false,
        printBasicPrototype: false,
        printFunctionName: true
      },
      testTimeout: 20 * 1000,
      typecheck: {
        allowJs: false,
        checker: 'tsc',
        ignoreSourceErrors: false,
        include: ['**/__tests__/*.spec-d.ts'],
        tsconfig: pathe.resolve('tsconfig.typecheck.json')
      },
      unstubEnvs: true,
      unstubGlobals: true
    }
  }
})

export default config
