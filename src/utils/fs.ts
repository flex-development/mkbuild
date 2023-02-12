/**
 * @file Utilities - fs
 * @module mkbuild/utils/fs
 */

import type { FileSystemAdapter } from '#src/types'
import fsc from 'node:fs'
import fsp from 'node:fs/promises'

/**
 * File system methods.
 *
 * @const {FileSystemAdapter} fs
 */
const fs: FileSystemAdapter = {
  lstat: fsc.lstat,
  mkdir: fsp.mkdir,
  readdir: fsp.readdir,
  readdirSync: fsc.readdirSync,
  rm: fsp.rm,
  stat: fsc.stat,
  unlink: fsp.unlink,
  writeFile: fsp.writeFile
}

export default fs
