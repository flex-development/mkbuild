/**
 * @file Type Tests - Context
 * @module mkbuild/interfaces/tests/unit-d/Context
 */

import type * as esbuild from 'esbuild'
import type TestSubject from '../context'

describe('unit-d:interfaces/Context', () => {
  it('should extend esbuild.BuildContext<{metafile:true;write:false}>', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<
      esbuild.BuildContext<{ metafile: true; write: false }>
    >()
  })
})
