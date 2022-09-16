/**
 * @file Fixtures - ESBUILD_OPTIONS
 * @module fixtures/ESBUILD_OPTIONS
 */

import type { BuildOptions } from 'esbuild'

export default {
  allowOverwrite: true,
  metafile: true,
  outdir: 'dist',
  target: 'esnext',
  write: false
} as BuildOptions
