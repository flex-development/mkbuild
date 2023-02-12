/**
 * @file Fixtures - ESBUILD_OPTIONS
 * @module fixtures/ESBUILD_OPTIONS
 */

import * as mlly from '@flex-development/mlly'
import * as tscu from '@flex-development/tsconfig-utils'
import type * as esbuild from 'esbuild'

export default {
  allowOverwrite: true,
  conditions: [...mlly.CONDITIONS],
  metafile: true,
  outdir: 'dist',
  resolveExtensions: [...mlly.RESOLVE_EXTENSIONS],
  target: tscu.ScriptTarget.ESNext,
  write: false
} as esbuild.BuildOptions & { metafile: true; write: false }
