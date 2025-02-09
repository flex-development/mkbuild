/**
 * @file Type Aliases - GetModuleContext
 * @module mkbuild/types/GetModuleContext
 */

/**
 * Get the module context of `id`.
 *
 * @this {void}
 *
 * @param {string} id
 *  Module id
 * @return {string | null | undefined}
 *  Value of `this` at the top level
 */
type GetModuleContext = (this: void, id: string) => string | null | undefined

export type { GetModuleContext as default }
