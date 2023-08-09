/**
 * @file Unit Tests - loadBuildConfig
 * @module mkbuild/config/tests/unit/loadBuildConfig
 */

import path from 'node:path'
import testSubject from '../load'

describe('unit:config/loadBuildConfig', () => {
  it('should return empty object if config is not found', async () => {
    expect(await testSubject(path.resolve('__fixtures__'))).to.eql({})
  })
})
