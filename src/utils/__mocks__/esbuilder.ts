/**
 * @file Mock Utilities - esbuilder
 * @module mkbuild/utils/mocks/esbuilder
 */

import { EXT_DTS_REGEX } from '#src/config/constants'
import type { Entry, Result, SourceFile } from '#src/interfaces'
import { findExportNames } from 'mlly'
import fs from 'node:fs'
import path from 'node:path'

export default vi.fn(
  (source: Pick<SourceFile, 'ext' | 'file'>, entry: Entry): Result[] => {
    const outfilename: string = source.file.replace(source.ext, entry.ext)
    const outfile: string = `${entry.outdir}/${outfilename}`
    const entryPoint: string = `${entry.source}/${source.file}`
    const content: string = fs.readFileSync(path.resolve(entryPoint), 'utf8')

    return [
      {
        bytes: 0,
        contents: new Uint8Array(Buffer.from('')),
        entryPoint:
          EXT_DTS_REGEX.test(source.file) ||
          /(\.json(5|c)?)$/.test(source.file) ||
          (source.file.endsWith('.cjs') && entry.format === 'cjs') ||
          (source.file.endsWith('.mjs') && entry.format === 'esm')
            ? undefined
            : entryPoint,
        errors: [],
        exports: findExportNames(content),
        imports: [],
        inputs: {
          [entryPoint]: { bytes: Buffer.byteLength(content), imports: [] }
        },
        outfile,
        path: path.resolve(entry.outdir, outfile),
        text: '',
        warnings: []
      }
    ]
  }
)
