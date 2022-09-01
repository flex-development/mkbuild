/**
 * @file Test Setup - console
 * @module tests/setup/console
 */

import util from 'node:util'

/** @const {Console} logger  - Copy of {@link global.console} */
const logger: Console = Object.assign({}, global.console)

/** @const {RegExp[]} ignore - Console message patterns to ignore */
const ignore: RegExp[] = []

/**
 * Prints to `stderr` with newline.
 *
 * Multiple arguments can be passed, with the first used as the primary message
 * and all additional used as substitution values similar to [`printf(3)`][1]
 * (arguments are passed to {@link util.format}).
 *
 * [1]: https://man7.org/linux/man-pages/man3/printf.3.html
 *
 * @param {any} message - Primary message
 * @param {any[]} params - {@link util.format} arguments
 * @return {void} Nothing when complete
 */
const error = (message?: any, ...params: any[]): void => {
  message = util.format(message, ...(params as string[]))

  for (const pattern of ignore) {
    if (typeof message === 'string' && pattern.test(message)) return
  }

  return void logger.error(message)
}

/**
 * Restores {@link console} to its default state.
 *
 * @return {void} Nothing when complete
 */
const restore = (): void => void (global.console = logger)

global.console.debug = vi.fn(logger.debug.bind(logger))
global.console.error = vi.fn(error)
global.console.info = vi.fn()
global.console.log = vi.fn()
global.console.warn = vi.fn()

global.restoreConsole = restore
