#!/usr/bin/env node

/**
 * @file CLI
 * @module mkbuild/cli
 */

import sade from 'sade'
import pkg from '../package.json' assert { type: 'json' }
import make from './make'

sade(pkg.name.replace(/.*\//, ''), true)
  .version(pkg.version)
  .describe(pkg.description)
  .action(async (): Promise<void> => void (await make()))
  .parse(process.argv)
