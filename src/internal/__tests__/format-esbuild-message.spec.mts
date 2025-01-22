/**
 * @file Unit Tests - formatEsbuildMessage
 * @module mkbuild/internal/tests/unit/formatEsbuildMessage
 */

import testSubject from '#internal/format-esbuild-message'
import pathe from '@flex-development/pathe'
import type { LogLevel, Message } from 'esbuild'
import { readFileSync } from 'node:fs'

describe('unit:internal/formatEsbuildMessage', () => {
  let code: string
  let file: string
  let level: LogLevel
  let plugin: string
  let message: Message

  beforeAll(() => {
    file = pathe.resolve('src/utils/load-build-config.mts')

    code = readFileSync(file, 'utf8')
    level = 'warning'
    plugin = 'mkbuild:esbuild'

    message = {
      detail: undefined,
      id: 'unsupported-dynamic-import',
      location: {
        column: 17,
        file,
        length: 6,
        line: 96,
        lineText:
          '        : (await import(url.href) as { default?: Config | null }).default',
        namespace: '',
        suggestion: ''
      },
      notes: [],
      pluginName: '',
      text:
        'This "import" expression will not be bundled because the argument is not a string literal'
    }
  })

  it('should return `message` as rollup log', () => {
    expect(testSubject(message, code, file, plugin, level)).toMatchSnapshot()
  })
})
