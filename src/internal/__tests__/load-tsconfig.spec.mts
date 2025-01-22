/**
 * @file Unit Tests - loadTsconfig
 * @module mkbuild/internal/tests/unit/loadTsconfig
 */

import testSubject from '#internal/load-tsconfig'
import type { Tsconfig } from '@flex-development/tsconfig-types'
import * as tscu from '@flex-development/tsconfig-utils'
import { isObjectPlain } from '@flex-development/tutils'
import json5 from 'json5'
import tsconfigRaw from '../../../tsconfig.json' with { type: 'json' }

describe('unit:internal/loadTsconfig', () => {
  describe('options.tsconfig', () => {
    it('should return normalized tsconfig', async () => {
      // Arrange
      const id: string = 'tsconfig.build.json'

      // Act
      const result = await testSubject({ tsconfig: id })

      // Expect
      expect(result).to.eql((await tscu.loadTsconfig(id))?.tsconfig)
      expect(result).to.have.property('compilerOptions').satisfy(isObjectPlain)
    })
  })

  describe('options.tsconfigRaw', () => {
    it.each<Parameters<typeof testSubject>>([
      [{ tsconfigRaw: json5.stringify(tsconfigRaw) }],
      [{ tsconfigRaw: tsconfigRaw as Tsconfig }]
    ])('should return normalized tsconfig (%#)', async options => {
      // Act
      const result = await testSubject(options)

      // Expect
      expect(result).to.eql(tsconfigRaw).and.not.eq(tsconfigRaw)
      expect(result).to.have.property('compilerOptions').satisfy(isObjectPlain)
    })
  })
})
