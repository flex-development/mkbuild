/**
 * @file Unit Tests - esbuilder
 * @module mkbuild/utils/tests/unit/esbuilder
 */

import type { Entry, Result, SourceFile } from '#src/interfaces'
import path from 'node:path'
import testSubject from '../esbuilder'

vi.mock('#src/plugins/dts/plugin')
vi.mock('#src/plugins/fully-specified/plugin')
vi.mock('#src/plugins/tsconfig-paths/plugin')

describe('unit:utils/esbuilder', () => {
  const src: Pick<SourceFile, 'ext' | 'file'> = {
    ext: '.ts',
    file: 'dbl-linear.ts'
  }

  const entry: Entry = {
    declaration: true,
    ext: '.mjs',
    format: 'esm',
    outdir: 'dist/esm',
    source: '__fixtures__'
  }

  let results: Result[]

  beforeEach(async () => {
    results = await testSubject(src, entry)
  })

  it('should return build result array', () => {
    // Arrange
    const { ext, outdir } = entry
    const outfile = `${outdir}/${path.basename(src.file, src.ext)}${ext}`

    // Expect
    results.forEach(result => {
      expect(result.bytes).to.be.a('number')
      expect(result.entryPoint).to.be.a('string')
      expect(result.errors).to.be.an('array').of.length(0)
      expect(result.exports).to.be.an('array')
      expect(result.imports).to.be.an('array')
      expect(result.inputs).to.be.an('object')
      expect(result.outfile).to.be.a('string').that.equals(outfile)
      expect(result.text).to.be.a('string')
      expect(result.warnings).to.be.an('array').of.length(0)
    })
  })
})
