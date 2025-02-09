/**
 * @file Type Aliases - InteropOption
 * @module mkbuild/types/InteropOption
 */

import type { GetInterop } from '@flex-development/mkbuild'
import type { InteropType } from 'rollup'

/**
 * Control how mkbuild (rollup) handles default, namespace, and dynamic imports
 * from external dependencies in formats that do not natively support these
 * concepts.
 *
 * @see {@linkcode GetInterop}
 * @see {@linkcode InteropType}
 * @see https://rollupjs.org/configuration-options/#output-interop
 */
type InteropOption = GetInterop | InteropType

export type { InteropOption as default }
