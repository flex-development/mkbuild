/**
 * @file Unit Tests - createEntryFileNames
 * @module mkbuild/internal/tests/unit/createEntryFileNames
 */

import testSubject from '#internal/create-entry-file-names'
import pathe from '@flex-development/pathe'

describe('unit:internal/createEntryFileNames', () => {
  describe('entryFileNames', () => {
    it.each<Parameters<typeof testSubject>>([
      [{ entryFileNames: '[name]{extname}', ext: '.mjs' }],
      [{ entryFileNames: chunk => chunk.name + '{extname}', ext: '.mjs' }]
    ])('should return pattern to use for naming `chunk` (%#)', task => {
      // Arrange
      const facadeModuleId: string = pathe.resolve('src/make.mts')

      // Act
      const result = testSubject(task)({
        exports: ['default'],
        facadeModuleId,
        isDynamicEntry: false,
        isEntry: true,
        isImplicitEntry: false,
        moduleIds: [facadeModuleId],
        name: pathe.basename(facadeModuleId, pathe.extname(facadeModuleId)),
        type: 'chunk'
      })

      // Expect
      expect(result).toMatchSnapshot()
    })
  })
})
