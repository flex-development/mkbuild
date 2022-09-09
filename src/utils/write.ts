/**
 * @file Utilities - write
 * @module mkbuild/utils/write
 */

import type { Options } from '#src/interfaces'
import type { OutputFile } from 'esbuild'
import fse from 'fs-extra'
import * as pathe from 'pathe'

/**
 * Writes a build result to the file system.
 *
 * @todo handle writing chunks
 *
 * @template R - Build result object type
 *
 * @async
 *
 * @param {R} result - Build result object
 * @param {Options['fs']} [fs=fse] - Custom file system methods
 * @return {Promise<R>} Written build result
 */
async function write<R extends OutputFile = OutputFile>(
  result: R,
  fs: Options['fs'] = fse
): Promise<R> {
  // create subdirectories in outdir
  await fs.mkdirp(pathe.dirname(result.path))

  // write build result
  await fs.writeFile(result.path, result.text, 'utf8')

  return result
}

export default write