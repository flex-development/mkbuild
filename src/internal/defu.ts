/**
 * @file Internal - defu
 * @module mkbuild/internal/defu
 */

import {
  isUndefined,
  type ExactOptionalPropertyTypes,
  type ObjectPlain
} from '@flex-development/tutils'
import { mergeAndCompare as merge, type Merge } from 'merge-anything'

/**
 * Assigns default properties to the given `object`.
 *
 * Leftmost arguments have more priority when assigning defaults.
 *
 * @template T - Destination object type
 * @template D - Source object type(s)
 *
 * @param {T} object - Destination object
 * @param {D} defaults - Object(s) used to assign default properties
 * @return {ExactOptionalPropertyTypes<Merge<T, D> & T>} `object` with defaults
 */
function defu<T extends ObjectPlain, D extends ObjectPlain[]>(
  object: T,
  ...defaults: D
): ExactOptionalPropertyTypes<Merge<T, D> & T> {
  return merge<T, D>(
    /**
     * Determines how to assign a property.
     *
     * @param {unknown} v1 - Original value from {@linkcode object}
     * @param {unknown} v2 - Incoming value from object in {@linkcode defaults}
     * @return {unknown} Property value for {@linkcode object}
     */
    (v1: unknown, v2: unknown): unknown => (isUndefined(v1) ? v2 : v1),
    object,
    ...defaults
  )
}

export default defu
