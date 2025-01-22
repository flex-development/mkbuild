/**
 * @file Internal - fs/node
 * @module mkbuild/internal/fs/node
 */

import type { FileSystem } from '@flex-development/mkbuild'
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  statSync
} from 'node:fs'
import { mkdir, rm, writeFile } from 'node:fs/promises'

/**
 * File system API.
 *
 * @internal
 *
 * @const {FileSystem} fs
 */
const fs: FileSystem = {
  mkdir,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rm,
  statSync,
  writeFile
}

export default fs
