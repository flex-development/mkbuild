/**
 * @file Utilities - buildSources
 * @module mkbuild/utils/buildSources
 */

import {
  EXT_DTS_REGEX,
  EXT_TS_REGEX,
  IGNORE_PATTERNS
} from '#src/config/constants'
import type { Entry, SourceFile } from '#src/interfaces'
import fse from 'fs-extra'
import { globby, type Options as GlobbyOptions } from 'globby'
import * as pathe from 'pathe'

/**
 * Returns an array of build sources for `entry`.
 *
 * @async
 *
 * @param {Entry} entry - Build entry object
 * @param {string[] | string} [pattern='**'] - Globs matching source files
 * @param {string[]} [ignore=IGNORE_PATTERNS] - Globs excluding source files
 * @param {GlobbyOptions['fs']} [fs=fse] - Custom  `fs` methods
 * @return {Promise<SourceFile[]>} Source file objects
 */
const buildSources = async (
  entry: Entry,
  pattern: string[] | string = '**',
  ignore: string[] = IGNORE_PATTERNS,
  fs: GlobbyOptions['fs'] = fse
): Promise<SourceFile[]> => {
  /**
   * Relative paths to source files.
   *
   * **Note**: Files are relative to `entry.source` when bundling is disbaled.
   * When enabled, files are relative to `pathe.parse(entry.source).root`.
   *
   * @var {string[]} files
   */
  let files: string[] = []

  if (entry.bundle) {
    const { root } = pathe.parse(entry.source)
    files = [entry.source.replace(root + '/', '')]
  } else {
    files = await globby(pattern, {
      cwd: pathe.resolve(entry.absWorkingDir ?? process.cwd(), entry.source),
      dot: true,
      fs,
      ignore
    })
  }

  return files.map(file => {
    /**
     * {@link file} resolved.
     *
     * @const {string} path
     */
    const path: string = pathe.resolve(entry.source, entry.bundle ? '' : file)

    /**
     * {@link file} extension.
     *
     * @var {string} ext
     */
    let ext: string = pathe.extname(path)

    // ! fix extension if file is a typescript declaration file
    if (EXT_TS_REGEX.test(ext) && EXT_DTS_REGEX.test(file)) ext = '.d' + ext

    return { ext, file, path }
  })
}

export default buildSources
