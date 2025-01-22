/**
 * @file Unit Tests - formatDiagnostic
 * @module mkbuild/internal/tests/unit/formatDiagnostic
 */

import testSubject, {
  type MinimalDiagnostic
} from '#internal/format-diagnostic'
import pathe from '@flex-development/pathe'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

describe('unit:internal/formatDiagnostic', () => {
  let diagnostic: MinimalDiagnostic
  let fileName: string
  let hook: string
  let plugin: string

  beforeAll(() => {
    fileName = pathe.resolve('src/utils/runnable-task.mts')
    hook = 'renderStart'
    plugin = 'mkbuild:dts'

    diagnostic = {
      category: ts.DiagnosticCategory.Error,
      code: 2578,
      file: { fileName, text: readFileSync(fileName, 'utf8') },
      length: undefined,
      messageText: 'Unused \'@ts-expect-error\' directive.',
      start: 10305
    }
  })

  it('should return `diagnostic` as rollup log', () => {
    // Act
    const result = testSubject(diagnostic, plugin, hook, ts)

    // Expect
    expect(result).to.have.property('frame').be.a('string')
    expect(result).to.have.property('hook', hook)
    expect(result).to.have.property('id', fileName)
    expect(result).to.have.property('level', 'warn')
    expect(result).to.have.nested.property('loc.column').be.a('number')
    expect(result).to.have.nested.property('loc.file', fileName)
    expect(result).to.have.nested.property('loc.line').be.a('number')
    expect(result).to.have.property('message', diagnostic.messageText)
    expect(result).to.have.nested.property('meta.category', diagnostic.category)
    expect(result).to.have.property('plugin', plugin)
    expect(result).to.have.property('pluginCode', diagnostic.code)
    expect(result).to.have.property('pos').be.a('number')
  })
})
