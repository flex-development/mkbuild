/**
 * @file Internal - regex
 * @module mkbuild/internal/regex
 */

export default {
  /**
   * TypeScript declaration file extension regex.
   *
   * @const {RegExp} dts
   */
  dts: /\.d\.(c|m)?ts$/,

  /**
   * JavaScript file extension regex.
   *
   * @const {RegExp} js
   */
  js: /(\.(c|m)?js|jsx)$/,

  /**
   * TypeScript file extension regex.
   *
   * @const {RegExp} ts
   */
  ts: /(\.(c|m)?ts|tsx)$/
}
