/**
 * @file Unit Tests - declarations
 * @module mkbuild/utils/tests/unit/declarations
 */

import fs from 'node:fs'
import path from 'node:path'
import type { OutputFile } from 'src/interfaces'
import testSubject from '../declarations'

describe('utils:unit/declarations', () => {
  it('should return empty vfs if outputs is empty array', async () => {
    expect(await testSubject([])).deep.equal(new Map())
  })

  it('should return empty vfs if missing declaration outputs', async () => {
    expect(await testSubject([{} as OutputFile])).deep.equal(new Map())
  })

  it('should return vfs with emitted declarations', async () => {
    // Arrange
    const src = path.resolve('__fixtures__/sum-of-intervals.ts')
    const dts = src.replace(/\.(c|m)?(j|t)s$/, '.d.$1ts')
    const dts_relative = dts.replace(process.cwd(), '')

    // Act
    const result = await testSubject([
      {
        contents: fs.readFileSync(src, 'utf8'),
        declaration: true,
        ext: '.d.mts',
        path: 'sum-of-intervals.d.mts',
        src
      }
    ])

    // Expect
    expect(new Map([[dts_relative, result.get(dts)]])).toMatchSnapshot()
  })
})
