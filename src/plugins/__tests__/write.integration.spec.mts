/**
 * @file Integration Tests - write
 * @module mkbuild/plugins/tests/integration/write
 */

import testSubject from '#plugins/write'
import createHasPlugin, { type HasPlugin } from '#tests/utils/create-has-plugin'
import runnableTask from '#utils/runnable-task'
import type { FileSystem, Result, Task } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { isObjectPlain, noop } from '@flex-development/tutils'
import type { Mock } from 'vitest'

describe('integration:plugins/write', () => {
  let hasPlugin: HasPlugin
  let mkdir: Mock<FileSystem['mkdir']>
  let writeFile: Mock<FileSystem['writeFile']>

  beforeAll(() => {
    hasPlugin = createHasPlugin(testSubject.PLUGIN_NAME)
    mkdir = vi.fn(noop).mockName('mkdir')
    writeFile = vi.fn(noop).mockName('writeFile')
  })

  it('should write output files', async () => {
    // Arrange
    const task: Task = {
      clean: false,
      input: 'src/*.ts',
      logLevel: 'silent',
      root: '__fixtures__/pkg/tribonacci',
      sourcemap: true,
      write: true
    }

    // Act
    const result = await runnableTask(task, { mkdir, writeFile }).run()

    // Expect
    expect(result).to.have.property('failure').be.null
    expect(result).to.have.nested.property('outputs.length').gt(0)
    expect(result).to.have.property('task', task).satisfy(isObjectPlain)
    expect(result).to.have.nested.property('task.plugins').satisfy(hasPlugin)
    expect(result.outputs).satisfy((outputs: Result['outputs']): boolean => {
      expect(mkdir).toHaveBeenCalledTimes(outputs.length)
      expect(writeFile).toHaveBeenCalledTimes(outputs.length)

      for (const output of outputs) {
        /**
         * Path to output file.
         *
         * @const {string} path
         */
        const path: string = pathe.join(
          result.root,
          result.outdir,
          output.fileName
        )

        /**
         * Path to output file directory.
         *
         * @const {string} path
         */
        const dirname: string = pathe.dirname(path)

        /**
         * Output file contents.
         *
         * @const {string} contents
         */
        const contents: string = 'code' in output
          ? output.code
          : String(output.source)

        expect(mkdir).toHaveBeenCalledWith(dirname, { recursive: true })
        expect(writeFile).toHaveBeenCalledWith(path, contents)
      }

      return true
    })
  })
})
