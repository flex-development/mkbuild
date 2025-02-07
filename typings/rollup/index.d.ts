import type {
  FileSystem,
  LogType,
  MessageLocation
} from '@flex-development/mkbuild'
import type { PackageJson } from '@flex-development/pkg-types'
import type { Tsconfig } from '@flex-development/tsconfig-types'

declare module 'rollup' {
  interface NormalizedInputOptions {
    fs: FileSystem
    pkg: PackageJson
    root: string
    tsconfig: Tsconfig
  }

  interface NormalizedOutputOptions {
    clean: boolean
    fs: FileSystem
    root: string
    write: boolean
  }

  interface OutputAsset {
    bytes: number
  }

  interface OutputChunk {
    bytes: number
  }

  interface RollupLog {
    loc?: { column: number; file?: string; line: number } | MessageLocation
    level?: LogLevel | 'error' | undefined
    type?: LogType | undefined
  }
}

export {}
