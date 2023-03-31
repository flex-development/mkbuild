#!/usr/bin/env node

/**
 * @file CLI
 * @module mkbuild/cli
 */

import { isNIL } from '@flex-development/tutils'
import consola from 'consola'
import * as esbuild from 'esbuild'
import type mri from 'mri'
import { camel, get, mapEntries, shake } from 'radash'
import sade from 'sade'
import pkg from '../package.json' assert { type: 'json' }
import type { Flags } from './interfaces'
import make from './make'

sade(pkg.name.replace(/.*\//, ''), true)
  .version(pkg.version)
  .describe(pkg.description)
  .option('--sourcemap', 'Generate sourcemaps')
  .option('--sources-content', 'Add original source code to sourcemap')
  .option('-c, --clean', 'Remove output directories', true)
  .option('-d, --dts', 'Generate TypeScript declaration files')
  .option('-e, --ext', 'Output file extension')
  .option('-f, --format', 'Output file format', 'esm')
  .option('-n, --name', 'Bundle output file name', '[name]')
  .option('-o, --outdir', 'Output directory', 'dist')
  .option('-p, --pattern', 'Glob patterns matching source files', '**')
  .option('-s, --source', 'Directory containing source files or bundle input')
  .option('-t, --tsconfig', 'Relative path to tsconfig file')
  .option('-w, --watch', 'Watch files', false)
  .example('')
  .example('--watch')
  .action(async (flags: mri.Argv<Flags>): Promise<void> => {
    try {
      await make(
        shake(
          mapEntries({ ...flags, write: true }, (k: string, v: unknown) => {
            return k.length === 1 ? ['', undefined] : [camel(k), v]
          })
        )
      )
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

    return void (flags.watch ? flags.watch : process.exit())
  })
  .parse(process.argv)
