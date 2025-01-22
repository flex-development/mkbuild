/**
 * @file Internal - VIRTUAL_MODULE_RE
 * @module mkbuild/internal/VIRTUAL_MODULE_RE
 */

/**
 * Regular expression matching module ids following virtual modules convention.
 *
 * @see https://rollupjs.org/plugin-development/#conventions
 * @see https://vite.dev/guide/api-plugin#virtual-modules-convention
 *
 * @internal
 *
 * @const {RegExp} VIRTUAL_MODULE_RE
 */
const VIRTUAL_MODULE_RE: RegExp = /^\\0|(?:(?:\\0)?virtual:)/

export default VIRTUAL_MODULE_RE
