/**
 * @file Functional Tests - resolveAliases
 * @module mkbuild/utils/tests/functional/resolveAliases
 */

import type { Format, Metafile, OutputFile } from 'esbuild'
import dedent from 'ts-dedent'
import {
  createMatchPath,
  loadConfig,
  type ConfigLoaderSuccessResult,
  type MatchPath
} from 'tsconfig-paths'
import resolveAlias from '../resolve-alias'
import testSubject from '../resolve-aliases'

vi.mock('../resolve-alias', async () => {
  type Actual = typeof import('../resolve-alias')
  const path: string = '../resolve-alias'

  const { default: resolveAlias } = await vi.importActual<Actual>(path)

  return { default: vi.fn(resolveAlias) }
})

describe('functional:utils/resolveAliases', () => {
  const format: Format = 'esm'

  describe('noop', () => {
    const matcher = vi.fn(() => faker.system.filePath()).mockName('matcher')
    const outfile: string = 'dist/foo.mjs'
    const outpath: string = process.cwd() + '/' + outfile
    const metafile: Pick<Metafile, 'outputs'> = {
      outputs: {
        [outfile]: {
          bytes: 0,
          entryPoint: 'src/foo.ts',
          exports: [],
          imports: [],
          inputs: {}
        }
      }
    }

    it('should do nothing if output does not have metadata', () => {
      // Arrange
      const output = { path: faker.system.filePath() } as OutputFile

      // Act
      testSubject(output, { outputs: {} }, format, matcher)

      // Expect
      expect(matcher).toHaveBeenCalledTimes(0)
      expect(resolveAlias).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if output entry point is empty string', () => {
      // Arrange
      const text: string = "import foo from 'baz'"
      const output: OutputFile = {
        contents: new Uint8Array(Buffer.from(text)),
        path: outpath,
        text
      }
      const metafile: Pick<Metafile, 'outputs'> = {
        outputs: {
          [outfile]: {
            bytes: 0,
            entryPoint: '',
            exports: [],
            imports: [],
            inputs: {}
          }
        }
      }

      // Act
      testSubject(output, metafile, format, matcher)

      // Expect
      expect(matcher).toHaveBeenCalledTimes(0)
      expect(resolveAlias).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if output entry point is undefined', () => {
      // Arrange
      const text: string = "import fizz from 'buzz'"
      const output: OutputFile = {
        contents: new Uint8Array(Buffer.from(text)),
        path: outpath,
        text
      }
      const metafile: Pick<Metafile, 'outputs'> = {
        outputs: {
          [outfile]: {
            bytes: 0,
            entryPoint: undefined,
            exports: [],
            imports: [],
            inputs: {}
          }
        }
      }

      // Act
      testSubject(output, metafile, format, matcher)

      // Expect
      expect(matcher).toHaveBeenCalledTimes(0)
      expect(resolveAlias).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if module specifier is not found', () => {
      // Arrange
      const text: OutputFile['text'] = 'export const foo'
      const output: OutputFile = {
        contents: new Uint8Array(Buffer.from(text)),
        path: outpath,
        text
      }

      // Act
      testSubject(output, metafile, format, matcher)

      // Expect
      expect(matcher).toHaveBeenCalledTimes(0)
      expect(resolveAlias).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if matcher returns undefined', () => {
      // Arrange
      const matcher = vi.fn().mockName('matcher')
      const text: string = "import { foo } from 'foobar'"
      const output: OutputFile = {
        contents: new Uint8Array(Buffer.from(text)),
        path: outpath,
        text
      }

      // Act
      testSubject(output, metafile, format, matcher)

      // Expect
      expect(matcher).toHaveBeenCalledOnce()
      expect(resolveAlias).toHaveBeenCalledTimes(0)
    })
  })

  describe('resolve', () => {
    const tsconfig = loadConfig(process.cwd()) as ConfigLoaderSuccessResult
    const matcher: MatchPath = vi.fn(
      createMatchPath(
        tsconfig.absoluteBaseUrl,
        tsconfig.paths,
        tsconfig.mainFields,
        tsconfig.addMatchAll
      )
    )

    it('should resolve path aliases in output file content', () => {
      // Arrange
      const entryPoint: string = 'src/utils/resolve-aliases.ts'
      const outfile: string = 'dist/utils/resolve-alias.mjs'
      const text: string = dedent`
        import { MODULE_EXTENSIONS } from '#src/config/constants'
        import extractStatements from '#src/utils/extract-statements'
        import resolveAlias from '#src/utils/resolve-alias'
        import type { Format } from 'esbuild'
        import type { MatchPath } from 'tsconfig-paths'
        import type { ReadJsonSync } from 'tsconfig-paths/lib/filesystem'
      `
      const output: OutputFile = {
        contents: new Uint8Array(Buffer.from(text)),
        path: process.cwd() + '/' + outfile,
        text
      }
      const metafile: Pick<Metafile, 'outputs'> = {
        outputs: {
          [outfile]: {
            bytes: 0,
            entryPoint,
            exports: [],
            imports: [],
            inputs: {}
          }
        }
      }

      // Act
      const result = testSubject(output, metafile, format, matcher)

      // Expect
      expect(matcher).toHaveBeenCalledTimes(6)
      expect(resolveAlias).toHaveBeenCalledTimes(3)
      expect(result.text).toMatchSnapshot()
    })
  })
})
