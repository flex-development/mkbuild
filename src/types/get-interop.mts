/**
 * @file Type Aliases - GetInterop
 * @module mkbuild/types/GetInterop
 */

import type { InteropType } from 'rollup'

/**
 * Control how mkbuild (rollup) handles default, namespace, and dynamic imports
 * from external dependencies in formats that do not natively support these
 * concepts.
 *
 * > 👉 **Note**: The default mode of `'default'` mimics NodeJS behavior and is
 * > different from TypeScript's `esModuleInterop`. To mimic TypeScript's
 * > behavior instead, return `'auto'`.
 *
 * @see {@linkcode InteropType}
 * @see https://rollupjs.org/configuration-options/#output-interop
 *
 * @this {void}
 *
 * @param {string | null} id
 *  Module id of external dependency
 * @return {InteropType}
 *  Interop type for `id`
 */
type GetInterop = (this: void, id: string | null) => InteropType

export type { GetInterop as default }
