/**
 * @file Internal - fs/browser
 * @module mkbuild/internal/fs/browser
 */

import type { FileSystem } from '@flex-development/mkbuild'

/**
 * File system API.
 *
 * @internal
 *
 * @const {FileSystem} fs
 */
const fs: FileSystem = {
  /**
   * Create a directory.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  mkdir(): never {
    throw new Error('[mkdir] not implemented')
  },

  /**
   * Create a directory.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  mkdirSync(): never {
    throw new Error('[mkdirSync] not implemented')
  },

  /**
   * Get the contents of a file.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  readFileSync(): never {
    throw new Error('[readFileSync] not implemented')
  },

  /**
   * Read the contents of a directory.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  readdirSync(): never {
    throw new Error('[readdirSync] not implemented')
  },

  /**
   * Get the resolved pathname of a directory or file.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  realpathSync(): never {
    throw new Error('[realpathSync] not implemented')
  },

  /**
   * Remove a directory or file.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  rm(): never {
    throw new Error('[rm] not implemented')
  },

  /**
   * Get information about a directory or file.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  statSync(): never {
    throw new Error('[statSync] not implemented')
  },

  /**
   * Create a file.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  writeFile(): never {
    throw new Error('[writeFile] not implemented')
  }
}

export default fs
