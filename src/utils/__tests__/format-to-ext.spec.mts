/**
 * @file Unit Tests - formatToExt
 * @module mkbuild/utils/tests/unit/formatToExt
 */

import testSubject from '#utils/format-to-ext'

describe('unit:utils/formatToExt', () => {
  it.each<Parameters<typeof testSubject>>([
    ['cjs'],
    ['esm'],
    ['iife'],
    ['system'],
    ['umd']
  ])('should return file extension for `format` (%j)', format => {
    expect(testSubject(format)).toMatchSnapshot()
  })
})
