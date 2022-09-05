/**
 * @file Utilities - declarations
 * @module mkbuild/utils/declarations
 */

import type { OutputFile } from 'src/interfaces'
import type {
  CompilerHost,
  CompilerOptions,
  WriteFileCallback
} from 'typescript'

/**
 * Outputs TypeScript declarations to a virtual file system.
 *
 * @async
 *
 * @param {OutputFile[]} [outputs=[]] - Output file objects
 * @return {Promise<Map<string, string>>} Virtual file system
 */
const declarations = async (
  outputs: OutputFile[] = []
): Promise<Map<string, string>> => {
  // do nothing if no outputs to operate on
  if (outputs.length === 0) return new Map()

  /**
   * Declaration output file objects.
   *
   * @const {OutputFile[]} dts
   */
  const dts: OutputFile[] = outputs.filter(output => output.declaration)

  // do nothing if no declaration file outputs to operate on
  if (dts.length === 0) return new Map()

  const { createCompilerHost, createProgram } = await import('typescript')

  /**
   * Virtual file system.
   *
   * @const {Map<string, string>} vfs
   */
  const vfs = new Map()

  /**
   * TypeScript compiler options.
   *
   * @const {CompilerOptions} compilerOptions
   */
  const compilerOptions: CompilerOptions = {
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    skipLibCheck: true
  }

  /**
   * TypeScript compiler host.
   *
   * @const {CompilerHost} host
   */
  const host: CompilerHost = createCompilerHost(compilerOptions)

  /**
   * Original `host.readFile` function.
   *
   * @const {CompilerHost['readFile']} _readFile
   */
  const _readFile: CompilerHost['readFile'] = host.readFile.bind(host)

  /**
   * Reads a file from {@link vfs}.
   *
   * @param {string} filename - Name of file to write
   * @return {string | undefined} File content
   */
  const readFile = (filename: string): string | undefined => {
    return dts.find(o => o.src === filename)?.contents ?? _readFile(filename)
  }

  /**
   * Writes a file to {@link vfs}.
   *
   * @param {string} filename - Name of file to write
   * @param {string} contents - Content to write
   * @return {void} Nothing when complete
   */
  const writeFile: WriteFileCallback = (
    filename: string,
    contents: string
  ): void => void vfs.set(filename, contents)

  host.readFile = readFile
  host.writeFile = writeFile

  // emit declarations to virtual file system
  createProgram([...dts.map(o => o.src)], compilerOptions, host).emit()

  return vfs
}

export default declarations
