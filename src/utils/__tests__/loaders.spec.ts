/**
 * @file Unit Tests - loaders
 * @module mkbuild/utils/tests/unit/loaders
 */

import testSubject from '../loaders'

describe('unit:utils/loaders', () => {
  interface Case {
    parameters: Parameters<typeof testSubject>
    state: `${'cjs' | 'esm'} ${'bundle' | 'transpilation'}`
  }

  const cases: Case[] = [
    { parameters: [], state: 'esm transpilation' },
    { parameters: ['esm', true], state: 'esm bundle' },
    { parameters: ['cjs', true], state: 'cjs bundle' },
    { parameters: ['cjs'], state: 'cjs transpilation' }
  ]

  cases.forEach(({ parameters, state }) => {
    it(`should return esbuild loader config for ${state}`, () => {
      expect(testSubject(...parameters)).toMatchSnapshot()
    })
  })
})
