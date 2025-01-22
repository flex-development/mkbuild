/**
 * @file Functional Tests - createOnLog
 * @module mkbuild/internal/tests/functional/createOnLog
 */

import testSubject from '#internal/create-on-log'
import type { Message } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { ok } from 'devlop'
import ts from 'typescript'

describe('functional:internal/createOnLog', () => {
  describe('onLog', () => {
    it.each<Parameters<ReturnType<typeof testSubject>>>([
      ['warn', {
        code: 'EMPTY_BUNDLE',
        message: 'Generated an empty chunk: "interfaces/task".',
        names: ['interfaces/task']
      }],
      ['warn', {
        code: 'PLUGIN_WARNING',
        hook: 'renderStart',
        id: pathe.resolve('tsconfig.build.json'),
        message:
          'Compiler option \'sourceMap\' requires a value of type boolean.',
        meta: { category: ts.DiagnosticCategory.Error },
        plugin: 'mkbuild:dts',
        pluginCode: 5024,
        pos: 299
      }],
      ['warn', {
        code: 'PLUGIN_WARNING',
        frame:
          '        : (await import(url.href) as { default?: Config | null }).default',
        hook: 'transform',
        loc: {
          column: 18,
          file: pathe.resolve('src/utils/load-build-config.mts'),
          line: 96
        },
        message:
          'This "import" expression will not be bundled because the argument is not a string literal',
        meta: { level: 'warning', notes: [] },
        plugin: 'mkbuild:esbuild',
        pluginCode: 'unsupported-dynamic-import',
        pos: 2188
      }]
    ])('should handle rollup `log` (%#)', (...args) => {
      ok(args[1].code, 'expected `log.code`')

      // Arrange
      const messages: Message[] = []

      // Act
      testSubject(messages)(...args)

      // Expect
      expect(messages).to.be.of.length(1)
      expect(messages).to.have.nested.property('0.code', args[1].code)
      expect(messages).to.have.nested.property('0.level', args[0])
      expect(messages).to.have.nested.property('0.text', args[1].message)
    })
  })
})
