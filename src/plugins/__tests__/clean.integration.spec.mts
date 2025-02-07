/**
 * @file Integration Tests - clean
 * @module mkbuild/plugins/tests/integration/clean
 */

import testSubject from '#plugins/clean'
import createHasPlugin, { type HasPlugin } from '#tests/utils/create-has-plugin'
import runnableTask from '#utils/runnable-task'
import type { FileSystem, Task } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { isObjectPlain, noop } from '@flex-development/tutils'
import type { Mock } from 'vitest'

describe('integration:plugins/clean', () => {
  let cache: Set<string>
  let hasPlugin: HasPlugin
  let mkdir: Mock<FileSystem['mkdir']>
  let rm: Mock<FileSystem['rm']>
  let taskBase: Task
  let writeFile: Mock<FileSystem['writeFile']>

  beforeAll(() => {
    cache = testSubject.directories
    hasPlugin = createHasPlugin(testSubject.PLUGIN_NAME)
    mkdir = vi.fn(noop).mockName('mkdir')
    rm = vi.fn(noop).mockName('rm')
    writeFile = vi.fn(noop).mockName('writeFile')

    taskBase = {
      input: '*',
      logLevel: 'silent',
      root: '__fixtures__/pkg/browser-usage',
      write: true
    }
  })

  afterEach(() => {
    cache.clear()
  })

  it('should clean new output directories', async () => {
    // Arrange
    const task: Task = { ...taskBase, outdir: 'dist/' }

    // Act
    const result = await runnableTask(task, { mkdir, rm, writeFile }).run()
    const path: string = pathe.join(result.root, result.outdir)

    // Expect
    expect(result).to.have.property('failure').be.null
    expect(result).to.have.property('task', task).satisfy(isObjectPlain)
    expect(result).to.have.nested.property('task.plugins').satisfy(hasPlugin)
    expect(cache).to.have.property('size', 2)
    expect(cache.has(path)).to.be.true
    expect(cache.has(result.root)).to.be.true
    expect(mkdir).toHaveBeenCalledTimes(2)
    expect(mkdir).toHaveBeenCalledAfter(rm, true)
    expect(mkdir).toHaveBeenNthCalledWith(1, path, { recursive: true })
    expect(rm).toHaveBeenCalledOnce()
    expect(rm).toHaveBeenCalledWith(path, { force: true, recursive: true })
  })

  it('should not clean cached output directories', async () => {
    // Arrange
    const task: Task = { ...taskBase, outdir: '' }

    // Act
    const result = await runnableTask(task, { mkdir, rm, writeFile }).run()

    // Expect
    expect(result).to.have.property('failure').be.null
    expect(result).to.have.property('task', task).satisfy(isObjectPlain)
    expect(result).to.have.nested.property('task.plugins').satisfy(hasPlugin)
    expect(cache).to.have.property('size', 1)
    expect(cache.has(result.root)).to.be.true
    expect(mkdir).toHaveBeenCalledOnce()
    expect(mkdir).not.toHaveBeenCalledBefore(rm)
    expect(rm).not.toHaveBeenCalled()
  })
})
