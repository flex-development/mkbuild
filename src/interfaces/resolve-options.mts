/**
 * @file Interfaces - ResolveOptions
 * @module mkbuild/interfaces/ResolveOptions
 */

import type { ResolveModuleOptions } from '@flex-development/mlly'

/**
 * Union of ignored or overridden fields.
 *
 * @internal
 */
type Skip = 'conditions' | 'cwd' | 'fs' | 'mainFields'

/**
 * Module resolution options.
 *
 * Modules are resolved according to the [ESM Resolver algorithm][esm], mostly
 * 😉. Support is also added for:
 *
 * - Changing file extensions
 * - Directory index resolution
 * - Extensionless file resolution
 * - Path alias resolution
 * - Scopeless `@types/*` resolution (i.e. `unist` -> `@types/unist`)
 *
 * [esm]: https://nodejs.org/api/esm.html#esm_resolver_algorithm
 *
 * @see {@linkcode ResolveModuleOptions}
 *
 * @extends {Omit<ResolveModuleOptions,Skip>}
 */
interface ResolveOptions extends Omit<ResolveModuleOptions, Skip> {
  /**
   * List of export/import conditions.
   *
   * > 👉 **Note**: Should be sorted by priority.
   *
   * @see https://nodejs.org/api/packages.html#conditional-exports
   *
   * @default mlly.defaultConditions
   */
  conditions?: Set<string> | string[] | null | undefined

  /**
   * Module extensions to probe for.
   *
   * > 👉 **Note**: Should be sorted by priority.
   *
   * @override
   *
   * @default ['.mjs','.js','.mts','.ts','.jsx','.tsx','.json']
   */
  extensions?: Set<string> | string[] | null | undefined

  /**
   * List of legacy `main` fields.
   *
   * > 👉 **Note**: Should be sorted by priority.
   *
   * @default mlly.defaultMainFields
   */
  mainFields?: Set<string> | string[] | null | undefined
}

export type { ResolveOptions as default, Skip }
