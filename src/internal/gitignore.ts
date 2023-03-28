/**
 * @file Internal - gitignore
 * @module mkbuild/internal/gitignore
 */

import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'

/**
 * Returns a set of ignore patterns found in a `.gitignore` file.
 *
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
    const content: string = (await mlly.getSource(path)) as string

    // add ignore patterns from .gitignore
    for (const line of content.split(/\r?\n/)) {
      if (!line.trim()) continue
      if (line.startsWith('#') || line.startsWith('!')) continue
      ignore.add(line.trim())
    }
  } catch {
    // do nothing if .gitignore file was not found
  }

  return ignore
}

export default gitignore
