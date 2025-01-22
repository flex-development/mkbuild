/**
 * @file Unit Tests - mergeTask
 * @module mkbuild/utils/tests/unit/mergeTask
 */

import testSubject from '#utils/merge-task'
import tsconfig from '../../../tsconfig.build.json' with { type: 'json' }

describe('unit:utils/mergeTask', () => {
  it.each<Parameters<typeof testSubject>>([
    [
      null,
      null,
      {
        input: ['src/*.mts'],
        root: '__fixtures__/pkg/reverse',
        sourcemap: true
      }
    ],
    [
      {
        esbuild: {
          logOverride: {
            'ambiguous-reexport': 'warning',
            'assert-to-with': 'warning',
            'assert-type-json': 'warning',
            'assign-to-constant': 'warning',
            'assign-to-define': 'warning',
            'assign-to-import': 'warning',
            'call-import-namespace': 'warning',
            'class-name-will-throw': 'warning',
            'commonjs-variable-in-esm': 'warning',
            'css-syntax-error': 'warning',
            'delete-super-property': 'warning',
            'different-path-case': 'warning',
            'direct-eval': 'warning',
            'duplicate-case': 'warning',
            'duplicate-class-member': 'warning',
            'duplicate-object-key': 'warning',
            'empty-glob': 'warning',
            'empty-import-meta': 'warning',
            'equals-nan': 'warning',
            'equals-negative-zero': 'warning',
            'equals-new-object': 'warning',
            'html-comment-in-js': 'warning',
            'ignored-bare-import': 'warning',
            'ignored-dynamic-import': 'warning',
            'import-is-undefined': 'warning',
            'impossible-typeof': 'warning',
            'indirect-require': 'warning',
            'invalid-@charset': 'warning',
            'invalid-@import': 'warning',
            'invalid-@layer': 'warning',
            'invalid-calc': 'warning',
            'invalid-source-mappings': 'warning',
            'js-comment-in-css': 'warning',
            'missing-source-map': 'warning',
            'package.json': 'warning',
            'private-name-will-throw': 'warning',
            'require-resolve-not-external': 'warning',
            'sections-in-source-map': 'warning',
            'semicolon-after-return': 'warning',
            'suspicious-boolean-not': 'warning',
            'suspicious-define': 'warning',
            'suspicious-logical-operator': 'warning',
            'suspicious-nullish-coalescing': 'warning',
            'this-is-undefined-in-esm': 'warning',
            'tsconfig.json': 'warning',
            'undefined-composes-from': 'warning',
            'unsupported-@charset': 'warning',
            'unsupported-@namespace': 'warning',
            'unsupported-css-nesting': 'warning',
            'unsupported-css-property': 'warning',
            'unsupported-dynamic-import': 'warning',
            'unsupported-jsx-comment': 'warning',
            'unsupported-regexp': 'warning',
            'unsupported-require-call': 'warning',
            'unsupported-source-map-comment': 'warning'
          },
          target: [tsconfig.compilerOptions.target]
        },
        resolve: {
          conditions: new Set(['import', 'node'])
        },
        tsconfig: 'tsconfig.build.json'
      },
      {
        esbuild: {
          logOverride: {
            'unsupported-dynamic-import': 'silent'
          },
          target: ['node18']
        },
        input: [
          'src/*.mts',
          'src/interfaces/*.mts',
          'src/types/*.mts',
          'src/utils/*.mts'
        ],
        resolve: {
          conditions: new Set(tsconfig.compilerOptions.customConditions)
        }
      }
    ]
  ])('should return merged build task (%#)', (target, ...tasks) => {
    expect(testSubject(target, ...tasks)).toMatchSnapshot()
  })
})
