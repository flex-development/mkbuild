/**
 * @file Unit Tests - loadBuildConfig
 * @module mkbuild/utils/tests/unit/loadBuildConfig
 */

import testSubject from '#utils/load-build-config'
import pathe, { type Ext } from '@flex-development/pathe'
import { isObjectPlain } from '@flex-development/tutils'

describe('unit:utils/loadBuildConfig', () => {
  it.each<[Ext, ...Parameters<typeof testSubject>]>([
    ['.jsonc', pathe.pathToFileURL('__fixtures__/pkg/apple-stock')],
    ['.mts']
  ])('should return resolved build configuration (%j)', async (
    ext,
    location,
    fs
  ) => {
    // Act
    const result = await testSubject(location, fs)

    // Expect
    expect(result).to.have.property('config').satisfy(isObjectPlain)
    expect(result).to.have.property('url').be.instanceof(URL)
    expect(String(result.url)).to.endWith(ext)
  })
})
