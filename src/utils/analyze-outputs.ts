/**
 * @file Utilities - analyzeOutputs
 * @module mkbuild/utils/analyzeOutputs
 */

import type { Output } from '#src/interfaces'
import * as color from 'colorette'
import pb from 'pretty-bytes'

/**
 * Returns a pretty printed version of `outputs`.
 *
 * @param {string} outdir - Output directory name
 * @param {Pick<Output, 'bytes' | 'outfile'>[]} [outputs=[]] - Build outputs
 * @param {number} [pad=2] - Number of spaces before new lines
 * @return {string} Pretty printed `outputs`
 */
const analyzeOutputs = (
  outdir: string,
  outputs: Pick<Output, 'bytes' | 'outfile'>[] = [],
  pad: number = 2
): string => {
  /**
   * Total number of bytes in {@linkcode outputs}.
   *
   * @const {number} bytes
   */
  const bytes: number = outputs.reduce((acc, result) => acc + result.bytes, 0)

  /**
   * Space before new lines.
   *
   * @const {string} padding
   */
  const padding: string = ' '.repeat(pad)

  return [
    `${padding}${color.bold(outdir)} (total size: ${color.cyan(pb(bytes))})`,
    ...outputs.map(({ bytes, outfile }) => {
      return color.gray(`${padding}└─ ${outfile} (${pb(bytes)})`)
    })
  ].join('\n')
}

export default analyzeOutputs
