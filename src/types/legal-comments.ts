/**
 * @file Type Definitions - LegalComments
 * @module mkbuild/types/LegalComments
 */

import type { Fallback } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'

/**
 * esbuild `legalComments` options.
 *
 * @see https://esbuild.github.io/api/#legal-comments
 */
type LegalComments = Fallback<esbuild.BuildOptions['legalComments'], never>

export type { LegalComments as default }
