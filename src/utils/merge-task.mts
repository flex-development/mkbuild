/**
 * @file Utilities - mergeTask
 * @module mkbuild/utils/mergeTask
 */

import type { Task } from '@flex-development/mkbuild'
import {
  isObjectCurly,
  ksort,
  properties,
  sift
} from '@flex-development/tutils'

export default mergeTask

/**
 * Merge one or more build tasks into a single {@linkcode Task}.
 *
 * Task source objects are applied from left to right. Subsequent sources
 * overwrite property assignments of previous sources.
 *
 * @see {@linkcode Task}
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {Task | null | undefined} target
 *  Target build task
 * @param {ReadonlyArray<Task | null | undefined>} tasks
 *  Source build task(s)
 * @return {Task}
 *  Merged build task
 */
function mergeTask(
  this: void,
  target: Task | null | undefined,
  ...tasks: readonly (Task | null | undefined)[]
): Task {
  return ksort(merge(target ?? {}, ...sift(tasks)))
}

/**
 * @this {void}
 *
 * @param {Record<PropertyKey, any>} target
 *  Target object
 * @param {Record<PropertyKey, any>[]} sources
 *  Source object(s)
 * @return {Record<PropertyKey, any>}
 *  Merged object
 */
function merge(
  this: void,
  target: Record<PropertyKey, any>,
  ...sources: Record<PropertyKey, any>[]
): Record<PropertyKey, any> {
  return sources.reduce<Record<PropertyKey, any>>((acc, source) => {
    return properties(source).reduce((target, property) => {
      /**
       * Source object value.
       *
       * @var {any} value
       */
      let value: any = source[property]

      if (Object.prototype.hasOwnProperty.call(target, property)) {
        /**
         * Target object value.
         *
         * @const {any} targetValue
         */
        const targetValue: any = target[property]

        if (Array.isArray(targetValue) && Array.isArray(value)) {
          value = [...new Set([...targetValue, ...value])]
        } else if (targetValue instanceof Set && value instanceof Set) {
          value = new Set([...targetValue, ...value])
        } else if (isObjectCurly(targetValue) && isObjectCurly(value)) {
          value = merge(targetValue, value)
        }
      }

      return target[property] = value, target
    }, acc)
  }, target)
}
