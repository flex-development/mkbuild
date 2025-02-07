/**
 * @file Integration Tests - metadata
 * @module mkbuild/plugins/tests/integration/metadata
 */

import testSubject from '#plugins/metadata'
import createHasPlugin, { type HasPlugin } from '#tests/utils/create-has-plugin'
import runnableTask from '#utils/runnable-task'
import { isObjectPlain } from '@flex-development/tutils'

describe('integration:plugins/metadata', () => {
  let hasPlugin: HasPlugin

  beforeAll(() => {
    hasPlugin = createHasPlugin(testSubject.PLUGIN_NAME)
  })

  it.each<Parameters<typeof runnableTask>>([
    [
      {
        esbuild: { loader: { '.jsonc': 'copy' } },
        input: ['*'],
        logLevel: 'silent',
        root: '__fixtures__/pkg/apple-stock'
      }
    ],
    [
      {
        input: ['src/*.mts'],
        logLevel: 'silent',
        root: '__fixtures__/pkg/reverse',
        sourcemap: true
      }
    ]
  ])('should add build metadata to outputs (%#)', async (task, fs) => {
    // Act
    const result = await runnableTask(task, fs).run()

    // Expect
    expect(result).to.have.property('failure').be.null
    expect(result).to.have.property('outputs').be.an('array').that.is.not.empty
    expect(result).to.have.property('task', task).satisfy(isObjectPlain)
    expect(result).to.have.nested.property('task.plugins').satisfy(hasPlugin)
    expect(result.outputs).each.have.property('bytes').be.a('number')
    expect(result.outputs).each.have.property('type').oneOf(['asset', 'chunk'])
  })
})
