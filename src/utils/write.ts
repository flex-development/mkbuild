/**
 * @file Utilities - write
 * @module mkbuild/utils/write
 */

import type { OutputFile } from 'esbuild'
import fse from 'fs-extra'
import * as pathe from 'pathe'

/**
 * Writes a build result to the file system.
 *
 * @template R - Build result object type
 *
 * @async
 *
 * @param {R} result - Build result object
 * @param {Pick<typeof fse, 'mkdirp' | 'writeFile'>} [fs=fse] - `fs` methods
 * @return {Promise<R>} Written build result
 */
async function write<R extends OutputFile = OutputFile>(
  result: R,
  fs: Pick<typeof fse, 'mkdirp' | 'writeFile'> = fse
): Promise<R> {
  // create subdirectories in outdir
  await fs.mkdirp(pathe.dirname(result.path))

  // write build result
  await fs.writeFile(result.path, result.text, 'utf8')

  return result
}

export default write
