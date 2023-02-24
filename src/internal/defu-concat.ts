/**
 * @file Internal - defuConcat
 * @module mkbuild/internal/defuConcat
 */

import { isUndefined, type ObjectPlain } from '@flex-development/tutils'
import { mergeAndCompare as merge, type Merge } from 'merge-anything'

/**
 * Assigns default properties to the given `object`.
 *
 * Leftmost arguments have more priority when assigning defaults.
 *
 * Supports array concatenation.
 *
 * @template T - Destination object type
 * @template D - Source object type(s)
 *
 * @param {T} object - Destination object
 * @param {D} defaults - Object(s) used to assign default properties
 * @return {Merge<T, D> & T} `object` with defaults assigned
 */
function defuConcat<
  T extends ObjectPlain = ObjectPlain,
  D extends ObjectPlain[] = ObjectPlain[]
>(object: T, ...defaults: D): Merge<T, D> & T {
  /**
   * Determines how to assign a property.
   *
   * @param {unknown} val1 - Original value from {@linkcode object}
   * @param {unknown} val2 - Incoming value from object in {@linkcode defaults}
   * @return {unknown} Property value for {@linkcode object}
   */
  const compare = (val1: unknown, val2: unknown): unknown => {
    return Array.isArray(val1) && Array.isArray(val2)
      ? [...new Set([...val1, ...val2])]
      : isUndefined(val1)
      ? val2
      : val1
  }

  return merge<T, D>(compare, object, ...defaults) as Merge<T, D> & T
}

export default defuConcat
