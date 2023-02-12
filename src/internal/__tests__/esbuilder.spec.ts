/**
 * @file Unit Tests - esbuilder
 * @module mkbuild/internal/tests/unit/esbuilder
 */

import type { Entry } from '#src'
import testSubject from '../esbuilder'

describe('unit:internal/esbuilder', () => {
  let entry: Entry

  beforeAll(() => {
    entry = {
      cwd: '__fixtures__/pkg/dbl-linear',
      outdir: '.',
      pattern: 'dbl-linear.ts',
      source: '.',
      sourcemap: false
    }
  })

  it('should return metafile and build results', async () => {
    // Act
    const [metafile, results] = await testSubject({ ...entry, dts: false })

    // Expect
    expect(metafile).to.have.property('inputs')
    expect(metafile).to.have.property('outputs')
    expect(results).to.be.an('array').of.length(1)
    expect(results).to.each.have.property('bytes').be.a('number')
    expect(results).to.each.have.property('contents').instanceof(Uint8Array)
    expect(results).to.each.have.property('entryPoint').be.a('string')
    expect(results).to.each.have.property('errors').be.an('array').and.empty
    expect(results).to.each.have.property('exports').be.an('array')
    expect(results).to.each.have.property('imports').be.an('array')
    expect(results).to.each.have.property('inputs').be.an('object')
    expect(results).to.each.have.property('outfile').be.a('string')
    expect(results).to.each.have.property('path').be.a('string')
    expect(results).to.each.have.property('text').be.a('string')
    expect(results).to.each.have.property('warnings').be.an('array').and.empty
  })

  it('should return metafile and dts-only build results', async () => {
    // Act
    const [metafile, results] = await testSubject({ ...entry, dts: 'only' })

    // Expect
    expect(metafile).to.have.property('inputs')
    expect(metafile).to.have.property('outputs')
    expect(results).to.be.an('array').of.length(1)
    expect(results).to.each.have.property('path').endWith('.d.mts')
  })
})
