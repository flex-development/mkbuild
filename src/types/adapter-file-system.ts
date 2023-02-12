/**
 * @file Type Definitions - FileSystemAdapter
 * @module mkbuild/types/FileSystemAdapter
 */

import type fsc from 'node:fs'
import type fsp from 'node:fs/promises'

/**
 * Custom implementations of file system methods.
 *
 * @todo method documentation
 *
 * @see https://nodejs.org/api/fs.html
 */
type FileSystemAdapter = {
  lstat: (typeof fsc)['lstat']
  mkdir: (typeof fsp)['mkdir']
  readdir: (typeof fsp)['readdir']
  readdirSync: (typeof fsc)['readdirSync']
  rm: (typeof fsp)['rm']
  stat: (typeof fsc)['stat']
  unlink: (typeof fsp)['unlink']
  writeFile: (typeof fsp)['writeFile']
}

export type { FileSystemAdapter as default }
