/**
 * @file Utilities - analyzeResults
 * @module mkbuild/utils/analyzeResults
 */

import type { Result } from '#src/interfaces'
import * as color from 'colorette'
import pb from 'pretty-bytes'

/**
 * Returns a pretty printed version of `results`.
 *
 * @param {string} outdir - Output directory name
 * @param {Pick<Result, 'bytes' | 'outfile'>[]} [results=[]] - Build results
 * @param {number} [pad=2] - Number of spaces before new lines
 * @return {string} Pretty printed `results`
 */
const analyzeResults = (
  outdir: string,
  results: Pick<Result, 'bytes' | 'outfile'>[] = [],
  pad: number = 2
): string => {
  /**
   * Total number of bytes in {@link results}.
   *
   * @const {number} bytes
   */
  const bytes: number = results.reduce((acc, result) => acc + result.bytes, 0)

  /**
   * Space before new lines.
   *
   * @const {string} padding
   */
  const padding: string = ' '.repeat(pad)

  return [
    `${padding}${color.bold(outdir)} (total size: ${color.cyan(pb(bytes))})`,
    ...results.map(({ bytes, outfile }) => {
      return color.gray(`${padding}└─ ${outfile} (${pb(bytes)})`)
    })
  ].join('\n')
}

export default analyzeResults
