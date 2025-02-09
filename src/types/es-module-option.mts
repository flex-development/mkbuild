/**
 * @file Type Aliases - EsModuleOption
 * @module mkbuild/types/EsModuleOption
 */

/**
 * Union of values to determine whether to add `__esModule: true` when
 * generating exports for non-ES formats.
 *
 * - `'if-default-prop'`: only add the property when using
 *   [named exports mode][exports] and there also is a default export. the
 *   subtle difference is that if there is no default export, consumers of the
 *   commonjs version of your library will get all named exports as the
 *   default export instead of an error or `undefined`
 * - `false`: never add the property (even if the default export would become
 *   `.default`)
 * - `true`: add the property when using [named exports mode][exports]
 *
 * [exports]: https://rollupjs.org/configuration-options/#output-exports
 *
 * @see https://rollupjs.org/configuration-options/#output-esmodule
 */
type EsModuleOption = 'if-default-prop' | boolean

export type { EsModuleOption as default }
