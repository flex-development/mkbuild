/**
 * @file Type Definitions - LegalComments
 * @module mkbuild/types/LegalComments
 */

import type * as esbuild from 'esbuild'

/**
 * esbuild `legalComments` options.
 *
 * @see https://esbuild.github.io/api/#legal-comments
 */
type LegalComments = NonNullable<esbuild.BuildOptions['legalComments']>

export type { LegalComments as default }
