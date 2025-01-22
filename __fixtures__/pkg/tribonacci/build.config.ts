/**
 * @file Build Config
 * @module fixtures/pkg/tribonacci/build.config
 */

export default {
  input: 'src/*.ts',
  root: '__fixtures__/pkg/tribonacci',
  tasks: [{ format: 'cjs' as const }, { format: 'esm' as const }],
  tsconfig: 'tsconfig.json'
}
