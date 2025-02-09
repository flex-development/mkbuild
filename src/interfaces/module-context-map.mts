/**
 * @file Interfaces - ModuleContextMap
 * @module mkbuild/interfaces/ModuleContextMap
 */

/**
 * Record, where each key is a module id and each value is context of the
 * module.
 */
interface ModuleContextMap {
  [id: string]: string
}

export type { ModuleContextMap as default }
