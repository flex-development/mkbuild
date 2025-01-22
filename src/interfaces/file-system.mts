/**
 * @file Interfaces - FileSystem
 * @module mkbuild/interfaces/FileSystem
 */

import type { Awaitable, ModuleId } from '@flex-development/mlly'
import type * as tscu from '@flex-development/tsconfig-utils'

/**
 * File system API.
 *
 * @see {@linkcode tscu.FileSystem}
 *
 * @extends {tscu.FileSystem}
 */
interface FileSystem extends tscu.FileSystem {
  /**
   * Create a directory.
   *
   * @see {@linkcode Awaitable}
   * @see {@linkcode ModuleId}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  Direcory URL or path relative to current working directory
   * @param {{ recursive: true } | undefined} [options]
   *  Creation options
   * @param {true} options.recursive
   *  Create parent folders
   * @return {Awaitable<string | null | undefined | void>}
   *  First directory path created
   */
  mkdir(
    this: void,
    id: ModuleId,
    options?: { recursive: true } | undefined
  ): Awaitable<string | null | undefined | void>

  /**
   * Create a directory.
   *
   * @see {@linkcode ModuleId}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  Direcory URL or path relative to current working directory
   * @return {string | null | undefined | void}
   *  First directory path created
   */
  mkdirSync(this: void, id: ModuleId): string | null | undefined | void

  /**
   * Get the contents of the file at `id`.
   *
   * @see {@linkcode ModuleId}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  Module id of file to read
   * @param {'utf8'} encoding
   *  Buffer encoding
   * @return {string}
   *  File contents
   */
  readFileSync(this: void, id: ModuleId, encoding: 'utf8'): string

  /**
   * Get the contents of the file at `id`.
   *
   * @see {@linkcode Buffer}
   * @see {@linkcode ModuleId}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  Module id of file to read
   * @return {Buffer | string}
   *  File contents
   */
  readFileSync(this: void, id: ModuleId): Buffer | string

  /**
   * Remove a directory or file.
   *
   * @this {void}
   *
   * @param {string} path
   *  Directory or file path, relative to current working directory
   * @param {{ force: true; recursive: true }} options
   *  Removal options
   * @param {true} options.force
   *  Ignore exceptions if `path` does not exist
   * @param {true} options.recursive
   *  Perform a recursive directory removal
   * @return {Awaitable<null | undefined | void>}
   */
  rm(
    this: void,
    path: string,
    options: { force: true; recursive: true }
  ): Awaitable<null | undefined | void>

  /**
   * Create a file.
   *
   * @this {void}
   *
   * @param {string} path
   *  File path, relative to current working directory
   * @param {string} contents
   *  File contents
   * @return {Awaitable<null | undefined | void>}
   */
  writeFile(
    this: void,
    path: string,
    contents: string
  ): Awaitable<null | undefined | void>
}

export type { FileSystem as default }
