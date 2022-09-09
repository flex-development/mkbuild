/**
 * @file Utilities - resolveSpecifiers
 * @module mkbuild/utils/resolveSpecifiers
 */

import { MODULE_EXTENSIONS } from '#src/config/constants'
import type { Entry } from '#src/interfaces'
import type { Metafile, OutputFile } from 'esbuild'
import * as pathe from 'pathe'
import extractStatements from './extract-statements'
import resolveSpecifier from './resolve-specifier'

/**
 * Adds file extensions to relative specifiers in `output` file content.
 *
 * @see {@link resolveSpecifier}
 *
 * @async
 *
 * @param {OutputFile} output - Output file object
 * @param {Uint8Array} output.contents - Output file content
 * @param {string} output.path - Absolute path to output file
 * @param {string} output.text - `output.contents` as string
 * @param {Pick<Metafile, 'outputs'>} metadata - Build metadata
 * @param {Entry['format']} [format] - Output file format
 * @param {Entry['ext']} [ext] - Output file extension
 * @param {string} [cwd=process.cwd()] - Current working directory
 * @param {string[]} [extensions=MODULE_EXTENSIONS] - Extensions to probe for
 * @return {Promise<OutputFile>} `output` with specifiers fully resolved
 */
const resolveSpecifiers = async (
  output: OutputFile,
  metadata: Pick<Metafile, 'outputs'>,
  format: Entry['format'],
  ext: Entry['ext'],
  cwd: string = process.cwd(),
  extensions: string[] = MODULE_EXTENSIONS
): Promise<OutputFile> => {
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
     * {@link statement.code} before specifier resolution.
     *
     * @const {string} code
     */
    const code: string = statement.code

    // add extension to module specifier
    await resolveSpecifier(
      statement,
      pathe.resolve(cwd, metadata.outputs[outfile]!.entryPoint!),
      format,
      ext,
      extensions
    )

    // replace code in text
    text = text.replace(code, statement.code)
  }

  return { ...output, contents: new Uint8Array(Buffer.from(text)), text }
}

export default resolveSpecifiers
