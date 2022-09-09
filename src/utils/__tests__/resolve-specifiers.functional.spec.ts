/**
 * @file Functional Tests - resolveSpecifiers
 * @module mkbuild/utils/tests/functional/resolveSpecifiers
 */

import type { Entry } from '#src/interfaces'
import type { Format, Metafile, OutputFile } from 'esbuild'
import dedent from 'ts-dedent'
import resolveSpecifier from '../resolve-specifier'
import testSubject from '../resolve-specifiers'

vi.mock('../resolve-specifier', async () => {
  type Actual = typeof import('../resolve-specifier')
  const path: string = '../resolve-specifier'

  const { default: resolveSpecifier } = await vi.importActual<Actual>(path)

  return { default: vi.fn(resolveSpecifier) }
})

describe('functional:utils/resolveSpecifiers', () => {
  const ext: Entry['ext'] = '.mjs'
  const format: Format = 'esm'

  describe('noop', () => {
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

    it('should do nothing if output does not have metadata', async () => {
      // Arrange
      const output = { path: faker.system.filePath() } as OutputFile

      // Act
      await testSubject(output, { outputs: {} }, format, ext)

      // Expect
      expect(resolveSpecifier).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if output entry point is empty string', async () => {
      // Arrange
      const text: string = "import foo from './baz'"
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
      await testSubject(output, metafile, format, ext)

      // Expect
      expect(resolveSpecifier).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if output entry point is undefined', async () => {
      // Arrange
      const text: string = "import fizz from './buzz'"
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
      await testSubject(output, metafile, format, ext)

      // Expect
      expect(resolveSpecifier).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if module specifier is not found', async () => {
      // Arrange
      const text: OutputFile['text'] = 'export const foo'
      const output: OutputFile = {
        contents: new Uint8Array(Buffer.from(text)),
        path: outpath,
        text
      }

      // Act
      await testSubject(output, metafile, format, ext)

      // Expect
      expect(resolveSpecifier).toHaveBeenCalledTimes(0)
    })
  })

  describe('resolve', () => {
    it('should add file extensions to relative specifiers', async () => {
      // Arrange
      const entryPoint: string = 'src/utils/resolve-specifiers.ts'
      const outfile: string = 'dist/utils/resolve-specifiers.mjs'
      const text: string = dedent`
        import type { Metafile, OutputFile } from 'esbuild'
        import * as pathe from 'pathe'
        import { MODULE_EXTENSIONS } from '../config/constants'
        import type { Entry } from '../interfaces'
        import extractStatements from './extract-statements'
        import resolveSpecifier from './resolve-specifier'
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
      const result = await testSubject(output, metafile, format, ext)

      // Expect
      expect(resolveSpecifier).toHaveBeenCalledTimes(6)
      expect(result.text).toMatchSnapshot()
    })
  })
})
