/**
 * @file Unit Tests - esbuilder
 * @module mkbuild/utils/tests/unit/esbuilder
 */

import type { Entry, Result, SourceFile } from '#src/interfaces'
import type { Spy } from '#tests/interfaces'
import { globby } from 'globby'
import path from 'node:path'
import testSubject from '../esbuilder'

vi.mock('#src/plugins/dts/plugin')
vi.mock('#src/plugins/fully-specified/plugin')
vi.mock('#src/plugins/tsconfig-paths/plugin')
vi.mock('globby')

describe('unit:utils/esbuilder', () => {
  const src: Pick<SourceFile, 'ext' | 'file'> = {
    ext: '.ts',
    file: 'dbl-linear.ts'
  }
  const entry: Entry = {
    dts: true,
    ext: '.mjs',
    format: 'esm',
    outdir: 'dist/esm',
    pattern: '*',
    source: '__fixtures__'
  }

  let results: Result[]

  beforeEach(async () => {
    ;(globby as unknown as Spy<typeof globby>).mockResolvedValueOnce([src.file])
    results = await testSubject(entry)
  })

  it('should return build result array', () => {
    // Arrange
    const basename: string = path.basename(src.file, src.ext) + entry.ext

    // Expect
    results.forEach(result => {
      expect(result.bytes).to.be.a('number')
      expect(result.contents).to.not.be.undefined
      expect(result.entryPoint).to.be.a('string')
      expect(result.errors).to.be.an('array').of.length(0)
      expect(result.exports).to.be.an('array')
      expect(result.imports).to.be.an('array')
      expect(result.inputs).to.be.an('object')
      expect(result.outfile).to.be.a('string').that.has.basename(basename)
      expect(result.path).to.be.a('string').that.has.basename(basename)
      expect(result.text).to.be.a('string')
      expect(result.warnings).to.be.an('array').of.length(0)
    })
  })
})
