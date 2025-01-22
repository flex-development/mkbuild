declare module '#internal/fs' {
  import type { FileSystem } from '@flex-development/mkbuild'

  const fs: FileSystem

  export default fs
}
