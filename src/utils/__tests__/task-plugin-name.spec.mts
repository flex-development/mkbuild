/**
 * @file Unit Tests - TASK_PLUGIN_NAME
 * @module mkbuild/utils/tests/unit/TASK_PLUGIN_NAME
 */

import TEST_SUBJECT from '#utils/task-plugin-name'

describe('unit:utils/TASK_PLUGIN_NAME', () => {
  it('should equal "mkbuild:task"', () => {
    expect(TEST_SUBJECT).to.eq('mkbuild:task')
  })
})
