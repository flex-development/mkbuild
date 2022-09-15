/**
 * @file Fixtures - ESBUILD_OPTIONS
 * @module fixtures/ESBUILD_OPTIONS
 */

import type { BuildOptions } from 'esbuild'

export default {
  allowOverwrite: true,
  logLevel: 'silent',
  metafile: true,
  outdir: 'dist',
  target: 'esnext',
  write: false
} as BuildOptions
