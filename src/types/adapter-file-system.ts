/**
 * @file Type Definitions - FileSystemAdapter
 * @module mkbuild/types/FileSystemAdapter
 */

import type fs from 'node:fs'
import type fsp from 'node:fs/promises'

/**
 * Custom implementations of file system methods.
 *
 * @todo update documentation
 *
 * @see https://nodejs.org/api/fs.html
 */
type FileSystemAdapter = {
  lstat: (typeof fs)['lstat']
  mkdir: (typeof fsp)['mkdir']
  readdir: (typeof fsp)['readdir']
  readdirSync: (typeof fs)['readdirSync']
  rm: (typeof fsp)['rm']
  stat: (typeof fs)['stat']
  unlink: (typeof fsp)['unlink']
  writeFile: (typeof fsp)['writeFile']
}

export type { FileSystemAdapter as default }
