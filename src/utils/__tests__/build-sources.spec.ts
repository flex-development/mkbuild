/**
 * @file Unit Tests - buildSources
 * @module mkbuild/utils/tests/unit/buildSources
 */

import type { Entry } from '#src/interfaces'
import type { Spy } from '#tests/interfaces'
import { globby } from 'globby'
import path from 'node:path'
import { omit } from 'radash'
import testSubject from '../build-sources'

vi.mock('globby')

describe('unit:utils/buildSources', () => {
  it('should return build sources for bundle', async () => {
    // Arrange
    const entry: Entry = {
      bundle: true,
      declaration: false,
      ext: '.min.mjs',
      format: 'esm',
      minify: true,
      outdir: 'dist',
      source: 'src/cli.ts'
    }

    // Act
    const results = await testSubject(entry)

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results[0]!.ext).to.equal('.ts')
    expect(results[0]!.file).to.equal(entry.source.replace('src/', ''))
    expect(results[0]!.path).to.equal(path.resolve(entry.source))
    expect(results.map(result => omit(result, ['path']))).toMatchSnapshot()
  })

  it('should return build sources for transpilation', async () => {
    // Arrange
    const entry: Entry = {
      declaration: true,
      ext: '.mjs',
      format: 'esm',
      outdir: 'dist',
      source: '__fixtures__'
    }
    const files: string[] = ['dbl-linear.ts', 'reverse.mts', 'save-mark.d.cts']
    const sourcedir: string = path.resolve(entry.source) + '/'

    // Act
    ;(globby as unknown as Spy<typeof globby>).mockResolvedValue(files)
    const results = await testSubject(entry, '*')

    // Expect
    expect(results).to.be.an('array').of.length(files.length)
    expect(results).to.each.have.property('ext')
    expect(results).to.each.have.property('file').not.startWith(sourcedir)
    expect(results).to.each.have.property('path').startsWith(sourcedir)
    expect(results.map(result => omit(result, ['path']))).toMatchSnapshot()
  })
})
