/**
 * @file Interfaces - Context
 * @module mkbuild/interfaces/Context
 */

import type * as esbuild from 'esbuild'

/**
 * Object representing a build context.
 *
 * @see {@linkcode esbuild.BuildContext}
 *
 * @extends {esbuild.BuildContext<{metafile:true;write:false}>}
 */
interface Context
  extends esbuild.BuildContext<{ metafile: true; write: false }> {}

export type { Context as default }
