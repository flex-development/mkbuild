/**
 * @file Internal - gitignore
 * @module mkbuild/internal/gitignore
 */

import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import { cast, isEmptyString, trim } from '@flex-development/tutils'

/**
 * Returns a set of ignore patterns found in a `.gitignore` file.
 *
 * @internal
 * @async
 *
 * @param {string} absWorkingDir - Absolute path to current working directory
 * @return {Promise<Set<string>>} Ignore patterns set
 */
const gitignore = async (absWorkingDir: string): Promise<Set<string>> => {
  /**
   * Ignore patterns found in `.gitignore` file.
   *
   * @const {Set<string>} ignore
   */
  const ignore: Set<string> = new Set<string>()

  // try adding ignore patterns from .gitignore
  try {
    /**
     * Absolute path to `.gitignore` file.
     *
     * @const {string} path
     */
    const path: string = pathe.resolve(absWorkingDir, '.gitignore')

    /**
     * `.gitignore` file content.
     *
     * @const {string} gitignore
     */
    const content: string = cast(await mlly.getSource(path))

    // add ignore patterns from .gitignore
    for (const line of content.split(/\r?\n/)) {
      if (isEmptyString(trim(line))) continue
      if (line.startsWith('#') || line.startsWith('!')) continue
      ignore.add(trim(line))
    }
  } catch {
    // do nothing if .gitignore file was not found
  }

  return ignore
}

export default gitignore
