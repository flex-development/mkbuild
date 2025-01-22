/**
 * @file Type Aliases - WithNil
 * @module mkbuild/types/WithNil
 */

/**
 * Allow each property in `T` to be `null` or `undefined`.
 *
 * @internal
 *
 * @template {Record<string, any>} T
 *  Object type
 */
type WithNil<T extends Record<string, any>> = {
  [K in keyof T]: T[K] | null | undefined
}

export type { WithNil as default }
