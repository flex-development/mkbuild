/**
 * @file build
 * @module scripts/build
 */

import { make, type Report } from '@flex-development/mkbuild'
import config from '../build.config.mts'

/**
 * Build report.
 *
 * @const {Report} report
 */
const report: Report = await make({ ...config, write: true })

for (const result of report.builds) {
  if (result.failure) console.error(result.failure)
}
