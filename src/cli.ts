#!/usr/bin/env node

/**
 * @file CLI
 * @module mkbuild/cli
 */

import { isNIL } from '@flex-development/tutils'
import consola from 'consola'
import * as esbuild from 'esbuild'
import { get } from 'radash'
import sade from 'sade'
import pkg from '../package.json' assert { type: 'json' }
import make from './make'

sade(pkg.name.replace(/.*\//, ''), true)
  .version(pkg.version)
  .describe(pkg.description)
  .action(async (): Promise<void> => {
    try {
      await make({ write: true })
    } catch (e: unknown) {
      // format and log esbuild build failure messages
      if (!isNIL(get(e, 'errors')) && !isNIL(get(e, 'warnings'))) {
        const { errors, warnings } = e as esbuild.BuildFailure

        /**
         * Formatted message type.
         *
         * @see {@linkcode esbuild.FormatMessagesOptions.kind}
         *
         * @const {'error' | 'warning'} kind
         */
        const kind: 'error' | 'warning' =
          errors.length > 0 ? 'error' : 'warning'

        /**
         * Objects representing error or warning messages.
         *
         * @see {@linkcode esbuild.Message}
         *
         * @const {esbuild.Message[]} messages
         */
        const messages: esbuild.Message[] = kind === 'error' ? errors : warnings

        /**
         * Formatted error or warning messages.
         *
         * @see {@linkcode esbuild.formatMessages}
         *
         * @const {string[]} logs
         */
        const logs: string[] = await esbuild.formatMessages(messages, {
          color:
            process.env.NO_COLOR ?? process.env.NODE_DISABLE_COLORS
              ? false
              : process.env.FORCE_COLOR
              ? +process.env.FORCE_COLOR > 0
              : true,
          kind
        })

        // log formatted build failure messages
        for (let log of logs) {
          log = log.replace(/^.+?].+? /, '').trim()
          consola[kind === 'error' ? kind : 'warn'](log)
        }
      } else consola.error(e)

      // set exit code
      process.exitCode = 1
    }

    return void process.exit()
  })
  .parse(process.argv)
