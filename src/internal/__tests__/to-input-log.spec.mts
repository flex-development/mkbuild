/**
 * @file Functional Tests - toInputLog
 * @module mkbuild/internal/tests/unit/toInputLog
 */

import testSubject from '#internal/to-input-log'
import { createColors, type Colors } from '@flex-development/colors'
import type { Message } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { dedent } from 'ts-dedent'
import { DiagnosticCategory } from 'typescript'

describe('unit:internal/toInputLog', () => {
  let colors: Colors

  beforeAll(() => {
    colors = createColors({ color: true })
  })

  it.each<Message>([
    {
      code: 'EMPTY_BUNDLE',
      level: 'warn',
      message: 'Generated an empty chunk: "interfaces/task".',
      names: ['interfaces/task']
    },
    {
      code: 'PLUGIN_ERROR',
      frame: '      formatLog(\'error\', e)',
      hook: 'renderStart',
      level: 'error',
      loc: { column: 17, file: 'src/utils/runnable-task.mts', line: 449 },
      message:
        `Argument of type '"error"' is not assignable to parameter of type 'LogLevel'.`,
      meta: { category: DiagnosticCategory.Error },
      plugin: 'mkbuild:dts',
      pluginCode: 2345,
      pos: 11986,
      stack: dedent`
        RollupError: Argument of type '"error"' is not assignable to parameter of type 'LogLevel'.
          at getRollupError (${
        pathe.pathToFileURL('node_modules/rollup/dist/es/shared/parseAst.js')
      }:396:41)
          at error (${
        pathe.pathToFileURL('node_modules/rollup/dist/es/shared/parseAst.js')
      }:392:42)
          at Object.diagnostics (${pathe.resolve('src/plugins/dts.mts')}:135:22)
          at Object.renderStart (${pathe.resolve('src/plugins/dts.mts')}:359:17)
          at async Promise.all (index 0)
          at async PluginDriver.hookParallel (${
        pathe.pathToFileURL('node_modules/rollup/dist/es/shared/node-entry.js')
      }:20868:9)
          at async Bundle.generate (${
        pathe.pathToFileURL('node_modules/rollup/dist/es/shared/node-entry.js')
      }:19200:13)
          at async ${
        pathe.pathToFileURL('node_modules/rollup/dist/es/shared/node-entry.js')
      }:21904:27
          at async catchUnfinishedHookActions (${
        pathe.pathToFileURL('node_modules/rollup/dist/es/shared/node-entry.js')
      }:21286:16)
      `
    },
    {
      code: 'PLUGIN_LOG',
      frame:
        '        : (await import(url.href) as { default?: Config | null }).default',
      hook: 'transform',
      id: 'src/utils/load-build-config.mts',
      level: 'info',
      loc: { column: 18, file: 'src/utils/load-build-config.mts', line: 96 },
      message:
        'This "import" expression will not be bundled because the argument is not a string literal',
      meta: { level: 'info', notes: [] },
      plugin: 'mkbuild:esbuild',
      pluginCode: 'unsupported-dynamic-import',
      pos: 2183
    }
  ])('should return input log object (%#)', message => {
    expect(testSubject(message, colors)).toMatchSnapshot()
  })
})
