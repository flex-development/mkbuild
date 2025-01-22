/**
 * @file Internal - glob
 * @module mkbuild/internal/glob
 */

import dfs from '#internal/fs'
import toPath from '#internal/to-path'
import type { DirectoryContent, File } from '@flex-development/fst'
import {
  fromFileSystem,
  type Dirent,
  type Options
} from '@flex-development/fst-util-from-fs'
import pathe from '@flex-development/pathe'
import type { Type } from '@flex-development/unist-util-types'
import { ok } from 'devlop'

export default glob

/**
 * Glob options.
 *
 * @internal
 */
interface GlobOptions extends Options {
  /**
   * Path filters to determine if nodes should be added to the tree.
   *
   * @override
   */
  filters?: null | undefined

  /**
   * Glob pattern, or a list of patterns, used to exclude matches.
   */
  ignore?: Set<string> | readonly string[] | string | null | undefined

  /**
   * Glob pattern, or a list of patterns, matching files to include in the tree.
   *
   * > 👉 **Note**: Patterns matching directories to search will be generated
   * > using this list.
   */
  include?: Set<string> | readonly string[] | string | null | undefined
}

/**
 * Traverse the file system and return a list of pathnames matching a a defined
 * set of patterns.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {GlobOptions | null | undefined} [options]
 *  Glob options
 * @return {string[]}
 *  List of matched files
 */
function glob(this: void, options?: GlobOptions | null | undefined): string[] {
  options ??= {}

  if (typeof options.ignore === 'string') options.ignore = [options.ignore]
  if (typeof options.include === 'string') options.include = [options.include]

  /**
   * List of matched files.
   *
   * @const {string[]} files
   */
  const files: string[] = []

  /**
   * List of glob patterns used to exclude matches.
   *
   * @const {Set<string>} ignore
   */
  const ignore: Set<string> = new Set<string>(options.ignore)

  /**
   * Record of glob patterns matching directories to search and files to
   * include.
   *
   * @const {Record<Type<DirectoryContent>, Set<string>>} matchers
   */
  const matchers: Record<Type<DirectoryContent>, Set<string>> = {
    directory: new Set(),
    file: new Set(options.include)
  }

  // convert negated patterns to ignore patterns
  for (const pattern of matchers.file) {
    if (pattern.startsWith('!')) {
      ignore.add(pattern.slice(1))
      matchers.file.delete(pattern)
    }
  }

  // get patterns matching directories to search
  for (const pattern of matchers.file) {
    if (pattern === '**') {
      matchers.directory.add(pattern)
    } else {
      /**
       * Directory name of {@linkcode pattern}.
       *
       * @const {string} dirname
       */
      let dirname: string = pathe.dirname(pattern)

      while (dirname !== pathe.dot) {
        matchers.directory.add(dirname)
        dirname = pathe.dirname(dirname)
      }
    }
  }

  // create matched file tree
  fromFileSystem({
    ...options,
    filters: {
      /**
       * Determine if a `directory` node should be added to the tree.
       *
       * @this {void}
       *
       * @param {string} x
       *  Relative path to directory
       * @return {boolean}
       *  `true` if `directory` node should be added, `false` otherwise
       */
      directory(this: void, x: string): boolean {
        return filter(x, matchers.directory)
      },
      /**
       * Determine if a `file` node should be added to the tree.
       *
       * @this {void}
       *
       * @param {string} x
       *  Relative path to file
       * @return {boolean}
       *  `true` if `file` node should be added, `false` otherwise
       */
      file(this: void, x: string): boolean {
        return filter(x, matchers.file)
      }
    },
    fs: { ...dfs, ...options.fs },
    handles: {
      /**
       * Add matched files.
       *
       * @this {void}
       *
       * @param {File} node
       *  File node
       * @param {Dirent} dirent
       *  Dirent object representing the file `node` was created from
       * @return {undefined}
       */
      file(this: void, node: File, dirent: Dirent): undefined {
        return void files.push(pathe.join(dirent.parentPath, node.name))
      }
    }
  })

  return files

  /**
   * @this {void}
   *
   * @param {string} x
   *  The path to match
   * @param {Set<string>} patterns
   *  List of glob patterns
   * @return {boolean}
   *  `true` if `x` matches include pattern and is not excluded
   */
  function filter(this: void, x: string, patterns: Set<string>): boolean {
    ok(options, 'expected `options`')

    return pathe.matchesGlob(x, [...patterns], {
      cwd: options.root ? toPath(options.root) : pathe.cwd(),
      dot: true,
      ignore: [...ignore]
    })
  }
}
