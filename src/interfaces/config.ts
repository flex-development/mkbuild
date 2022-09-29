/**
 * @file Interfaces - Config
 * @module mkbuild/interfaces/Config
 */

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
   * Current working directory.
   *
   * @default '.'
   */
  absWorkingDir?: Options['absWorkingDir']

  /**
   * Remove output directories before starting build.
   *
   * @default true
   */
  clean?: boolean

  /**
   * Build entries.
   *
   * **Note**: If empty or `undefined`, a single build entry will be inferred
   * from the remaining set of configuration options.
   *
   * @default []
   */
  entries?: Partial<Entry>[]

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
