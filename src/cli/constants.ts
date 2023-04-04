/**
 * @file CLI - Constants
 * @module mkbuild/cli/constants
 */

import pkg from '#pkg' assert { type: 'json' }

/**
 * Array containing choices for boolean flags.
 *
 * @internal
 *
 * @const {string[]} CHOICES_BOOLEAN
 */
export const CHOICES_BOOLEAN: string[] = ['false', 'true', '0', '1']

/**
 * CLI application name.
 *
 * @internal
 *
 * @const {string} CLI_NAME
 */
export const CLI_NAME: string = pkg.name.replace(/.*\//, '')
