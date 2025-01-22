/**
 * @file Utilities - gitignore
 * @module utils/gitignore
 */

import dfs from '#internal/fs'
import toPath from '#internal/to-path'
import type { FileSystem } from '@flex-development/mkbuild'
import { isFile } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import { ok } from 'devlop'

/**
 * Extract a list of ignore patterns from a `.gitignore` file.
 *
 * @see {@linkcode FileSystem}
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {URL | string | null | undefined} [dir]
 *  Module id of directory containing `.gitignore` file
 * @param {Partial<FileSystem> | null | undefined} [fs]
 *  File system adapter
 * @return {Set<string>}
 *  List of ignore patterns
 */
function gitignore(
  this: void,
  dir?: URL | string | null | undefined,
  fs?: Partial<FileSystem> | null | undefined
): Set<string> {
  fs = { ...dfs, ...fs }

  ok(typeof fs.readFileSync === 'function', 'expected `fs.readFileSync`')
  ok(typeof fs.statSync === 'function', 'expected `fs.statSync`')

  /**
   * Ignore patterns found in `.gitignore` file.
   *
   * @const {Set<string>} ignore
   */
  const ignore: Set<string> = new Set<string>()

  /**
   * Absolute path to `.gitignore` file.
   *
   * @const {string} path
   */
  const path: string = pathe.join(toPath(dir ?? pathe.cwd()), '.gitignore')

  if (isFile(path, fs as FileSystem)) {
    for (let line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
      line = line.trim()

      if (!line || line.startsWith('#') || line.startsWith('!')) continue
      if (line.endsWith(pathe.sep)) line += '*'.repeat(2)
      ignore.add(line)
    }
  }

  return ignore
}

export default gitignore
