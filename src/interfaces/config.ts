/**
 * @file Interfaces - Config
 * @module mkbuild/interfaces/Config
 */

import type { EsbuildOptions } from '#src/types'
import type fse from 'fs-extra'
import type { Options as GlobbyOptions } from 'globby'
import type Entry from './entry'
import type Options from './options'

/**
 * Build configuration options.
 *
 * @extends {Options}
 */
interface Config extends Options {
  /**
   * Remove output directory before starting build.
   *
   * @default true
   */
  clean?: boolean

  /**
   * Current working directory.
   *
   * @default '.'
   */
  cwd?: string

  /**
   * Build entries.
   *
   * @default []
   */
  entries?: Partial<Entry>[]

  /**
   * [esbuild build API][1] options.
   *
   * [1]: https://esbuild.github.io/api/#build-api
   *
   * @default {}
   */
  esbuild?: EsbuildOptions

  /**
   * Custom implementations of `fs` methods.
   *
   * @see https://github.com/mrmlnc/fast-glob#fs
   * @see https://github.com/jprichardson/node-fs-extra
   *
   * @default fse
   */
  fs?: GlobbyOptions['fs'] & {
    emptyDir: typeof fse['emptyDir']
    mkdirp: typeof fse['mkdirp']
    readJson: typeof fse['readJson']
    unlink: typeof fse['unlink']
    writeFile: typeof fse['writeFile']
  }
}

export type { Config as default }
