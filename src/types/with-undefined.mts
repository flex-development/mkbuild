/**
 * @file Type Aliases - WithUndefined
 * @module mkbuild/types/WithUndefined
 */

/**
 * Allow each property in `T` to be `undefined`.
 *
 * @internal
 *
 * @template {Record<string, any>} T
 *  Object type
 */
type WithUndefined<T extends Record<string, any>> = {
  [K in keyof T]: T[K] | undefined
}

export type { WithUndefined as default }
