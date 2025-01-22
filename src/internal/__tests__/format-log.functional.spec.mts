/**
 * @file Functional Tests - formatLog
 * @module mkbuild/internal/tests/functional/formatLog
 */

import testSubject from '#internal/format-log'
import pathe from '@flex-development/pathe'
import ts from 'typescript'

describe('functional:internal/formatLog', () => {
  it.each<Parameters<typeof testSubject>>([
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
        '[plugin mkbuild:dts] tsconfig.build.json: Compiler option \'sourceMap\' requires a value of type boolean.',
      meta: { category: ts.DiagnosticCategory.Error },
      plugin: 'mkbuild:dts',
      pluginCode: 5024
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
        '[plugin mkbuild:esbuild] src/utils/load-build-config.mts (96:18): This "import" expression will not be bundled because the argument is not a string literal',
      meta: { level: 'warning', notes: [] },
      plugin: 'mkbuild:esbuild',
      pluginCode: 'unsupported-dynamic-import',
      pos: 2188
    }]
  ])('should format rollup `log` (%#)', (level, log) => {
    // Act
    testSubject(level, log)

    // Expect
    expect(log).to.have.property('level', level)
    expect(log).toMatchSnapshot()
  })
})
