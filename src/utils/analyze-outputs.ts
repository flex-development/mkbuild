/**
 * @file Utilities - analyzeOutputs
 * @module mkbuild/utils/analyzeOutputs
 */

import type { OutputMetadata } from '#src/types'
import { entries, join, template } from '@flex-development/tutils'
import pb from 'pretty-bytes'
import color from 'tinyrainbow'

/**
 * Generates a build analysis for the given `outputs`.
 *
 * @param {string} outdir - Output directory name
 * @param {Record<string, Pick<OutputMetadata, 'bytes'>>} [outputs={}] - Build
 * output map from metafile
 * @return {{ analysis: string; bytes: number }} Build output analysis and size
 */
const analyzeOutputs = (
  outdir: string,
  outputs: Record<string, Pick<OutputMetadata, 'bytes'>> = {}
): { analysis: string; bytes: number } => {
  /**
   * Indentation.
   *
   * @const {string} indent
   */
  const indent: string = ' '.repeat(2)

  /**
   * Output strings.
   *
   * @const {string[]} strings
   */
  const strings: string[] = []

  /**
   * Total output size.
   *
   * @const {number} size
   */
  const size: number = entries(outputs).reduce((acc, output) => {
    const [outfile, metadata] = output
    strings.push(color.gray(`${indent}└─ ${outfile} (${pb(metadata.bytes)})`))
    return acc + metadata.bytes
  }, 0)

  return {
    analysis: template(`${indent}{0} (total size: {1})\n{2}`, {
      0: color.bold(outdir),
      1: color.cyan(pb(size)),
      2: join(strings, '\n')
    }),
    bytes: size
  }
}

export default analyzeOutputs
