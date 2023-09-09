/**
 * @file Type Definitions - RawCommitField
 * @module grease/types/RawCommitField
 */

/**
 * Raw commit field names.
 */
type RawCommitField =
  | 'body'
  | 'date'
  | 'hash'
  | 'sha'
  | 'tags'
  | 'trailers'
  | `author.${'email' | 'name'}`

export type { RawCommitField as default }
