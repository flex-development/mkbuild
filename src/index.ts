/**
 * @file Package Entry Point
 * @module mkbuild
 */

export * from './config/constants'
export { default as defineBuildConfig } from './config/define'
export { default as loadBuildConfig } from './config/load'
export type { Config, Result } from './interfaces'
export { default } from './make'
