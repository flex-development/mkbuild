import type WithUndefined from '#types/with-undefined'
import type { Tsconfig } from '@flex-development/tsconfig-types'

declare module 'esbuild' {
  interface TransformOptions {
    tsconfigRaw?: Tsconfig | TsconfigRaw | string
  }

  /**
   * Transform `code`.
   *
   * This function can be used to minify JavaScript, convert TypeScript/JSX to
   * JavaScript, or convert newer JavaScript to older JavaScript.
   *
   * @see {@linkcode TransformOptions}
   * @see {@linkcode TransformResult}
   *
   * @template {WithUndefined<TransformOptions>} T
   *  Transform options
   *
   * @async
   *
   * @param {Uint8Array | string} code
   *  The code to transform
   * @param {SameShape<TransformOptions, T> | undefined} [options]
   *  Transform options
   * @return {Promise<TransformResult<T>>}
   *  Transform result
   */
  export declare function transform<T extends WithUndefined<TransformOptions>>(
    code: Uint8Array | string,
    options?: SameShape<TransformOptions, T>
  ): Promise<TransformResult<T>>
}
