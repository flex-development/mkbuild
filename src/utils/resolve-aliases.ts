/**
 * @file Utilities - resolveAliases
 * @module mkbuild/utils/resolveAliases
 */

import { MODULE_EXTENSIONS } from '#src/config/constants'
import type { Entry } from '#src/interfaces'
import type { Metafile, OutputFile } from 'esbuild'
import type { MatchPath } from 'tsconfig-paths'
import type { ReadJsonSync } from 'tsconfig-paths/lib/filesystem'
import extractStatements from './extract-statements'
import resolveAlias from './resolve-alias'

/**
 * Resolves path aliases in `output` file content.
 *
 * @param {OutputFile} output - Output file object
 * @param {Uint8Array} output.contents - Output file content
 * @param {string} output.path - Absolute path to output file
 * @param {string} output.text - `output.contents` as string
 * @param {Pick<Metafile, 'outputs'>} metadata - Build metadata
 * @param {Entry['format']} format - Output file format
 * @param {MatchPath} matcher - Path matching function
 * @param {string} [cwd=process.cwd()] - Current working directory
 * @param {string[]} [extensions=MODULE_EXTENSIONS] - Extensions to probe for
 * @param {(path: string) => boolean} [fileExists] - File existence checker
 * @param {ReadJsonSync} [readJson] - Reads `JSON` data from a file
 * @return {OutputFile} `output` with path aliases in file content resolved
 */
const resolveAliases = (
  output: OutputFile,
  metadata: Pick<Metafile, 'outputs'>,
  format: Entry['format'],
  matcher: MatchPath,
  cwd: string = process.cwd(),
  extensions: string[] = MODULE_EXTENSIONS,
  fileExists?: (path: string) => boolean,
  readJson?: ReadJsonSync
): OutputFile => {
  /**
   * Relative path to output file.
   *
   * **Note**: Relative to {@link cwd}.
   *
   * @const {string} outfile
   */
  const outfile: string = output.path.replace(cwd + '/', '')

  // do nothing if output does not have metadata
  if (!metadata.outputs[outfile]) return output

  // do nothing if output does not have entry point
  if (!metadata.outputs[outfile]!.entryPoint) return output

  /**
   * {@link output.text} copy.
   *
   * @var {string} text
   */
  let text: string = output.text

  for (const statement of extractStatements(output.text, format)) {
    // do nothing if missing module specifier
    if (!statement.specifier) continue

    /**
     * Possible path match for {@link statement.specifier}.
     *
     * @const {string | undefined} match
     */
    const match: string | undefined = matcher(
      statement.specifier,
      readJson,
      fileExists,
      extensions
    )

    // do nothing if path match was not found
    if (!match) continue

    /**
     * {@link statement.code} before path alias replacement.
     *
     * @const {string} code
     */
    const code: string = statement.code

    // resolve path alias in statement
    resolveAlias(statement, match, metadata.outputs[outfile]!.entryPoint!)

    // replace code in text
    text = text.replace(code, statement.code)
  }

  return { ...output, contents: new Uint8Array(Buffer.from(text)), text }
}

export default resolveAliases
