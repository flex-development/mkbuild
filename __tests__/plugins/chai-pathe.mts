/**
 * @file Plugins - chaiPathe
 * @module tests/plugins/chaiPathe
 */

import pathe from '@flex-development/pathe'
import type Chai from 'chai'

export default plugin

/**
 * Chai plugin for [pathe][].
 *
 * [pathe]: https://github.com/flex-development/pathe
 *
 * @see {@linkcode Chai.ChaiStatic}
 * @see {@linkcode Chai.ChaiUtils}
 *
 * @param {ChaiStatic} chai
 *  `chai` export
 * @param {Chai.ChaiUtils} utils
 *  `chai` utilities
 * @return {undefined}
 */
function plugin(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): undefined {
  utils.addChainableMethod(chai.Assertion.prototype, dirname.name, dirname)

  return void 0

  /**
   * @this {Chai.Assertion}
   *
   * @param {URL | string} expected
   *  Expected dirname
   * @return {undefined}
   */
  function dirname(this: Chai.Assertion, expected: URL | string): undefined {
    /**
     * Subject of assertion.
     *
     * @const {URL | string} subject
     */
    const subject: URL | string = utils.flag(this, 'object')

    /**
     * Actual dirname.
     *
     * @const {string} actual
     */
    const actual: string = pathe.dirname(subject)

    return expected = String(expected), void this.assert(
      actual === expected,
      'expected #{this} to have dirname #{exp} but got #{act}',
      'expected #{this} not to have dirname #{exp} but got #{act}',
      expected,
      actual
    )
  }
}
