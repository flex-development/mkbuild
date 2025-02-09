/**
 * @file Type Tests - Task
 * @module mkbuild/interfaces/tests/unit-d/Task
 */

import type TestSubject from '#interfaces/task'
import type {
  AssetFileNamesFn,
  BannerFn,
  DTSOption,
  EntryFileNamesFn,
  EsbuildOptions,
  EsModuleOption,
  ExperimentalOptions,
  ExportMode,
  FooterFn,
  Format,
  GeneratedCodeOption,
  Input,
  InteropOption,
  LogType,
  ModuleContextOption,
  ResolveOptions,
  SanitizeFileNameFn,
  SourcemapFileNamesFn,
  SourcemapIgnoreTest,
  SourcemapOption,
  SourcemapPathTransform,
  TreeshakeOption
} from '@flex-development/mkbuild'
import type { ModuleId } from '@flex-development/mlly'
import type { Tsconfig } from '@flex-development/tsconfig-types'
import type { Nilable } from '@flex-development/tutils'
import type {
  HashCharacters,
  ImportAttributesKey,
  InputPluginOption,
  PreserveEntrySignaturesOption
} from 'rollup'

describe('unit-d:interfaces/Task', () => {
  it('should match [assetFileNames?: AssetFileNamesFn | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('assetFileNames')
      .toEqualTypeOf<Nilable<AssetFileNamesFn | string>>()
  })

  it('should match [banner?: BannerFn | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('banner')
      .toEqualTypeOf<Nilable<BannerFn | string>>()
  })

  it('should match [bundle?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('bundle')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [clean?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('clean')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [compact?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('compact')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [dts?: DTSOption | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('dts')
      .toEqualTypeOf<Nilable<DTSOption>>()
  })

  it('should match [dynamicImportInCjs?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('dynamicImportInCjs')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [entryFileNames?: EntryFileNamesFn | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('entryFileNames')
      .toEqualTypeOf<Nilable<EntryFileNamesFn | string>>()
  })

  it('should match [esModule?: EsModuleOption | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('esModule')
      .toEqualTypeOf<Nilable<EsModuleOption>>()
  })

  it('should match [esbuild?: EsbuildOptions | false | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('esbuild')
      .toEqualTypeOf<Nilable<EsbuildOptions | false>>()
  })

  it('should match [experimental?: ExperimentalOptions | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('experimental')
      .toEqualTypeOf<Nilable<ExperimentalOptions>>()
  })

  it('should match [exports?: ExportMode | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('exports')
      .toEqualTypeOf<Nilable<ExportMode>>()
  })

  it('should match [ext?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ext')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [externalImportAttributes?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('externalImportAttributes')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [externalLiveBindings?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('externalLiveBindings')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [footer?: FooterFn | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('footer')
      .toEqualTypeOf<Nilable<FooterFn | string>>()
  })

  it('should match [format?: Format | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('format')
      .toEqualTypeOf<Nilable<Format>>()
  })

  it('should match [freeze?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('freeze')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [generatedCode?: GeneratedCodeOption | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('generatedCode')
      .toEqualTypeOf<Nilable<GeneratedCodeOption>>()
  })

  it('should match [gitignore?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('gitignore')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [globalExtend?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('globalExtend')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [globalName?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('globalName')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [hashCharacters?: HashCharacters | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('hashCharacters')
      .toEqualTypeOf<Nilable<HashCharacters>>()
  })

  it('should match [hoistTransitiveImports?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('hoistTransitiveImports')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [ignore?: Set<string> | readonly string[] | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ignore')
      .toEqualTypeOf<Nilable<Set<string> | readonly string[] | string>>()
  })

  it('should match [importAttributesKey?: ImportAttributesKey | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('importAttributesKey')
      .toEqualTypeOf<Nilable<ImportAttributesKey>>()
  })

  it('should match [indent?: boolean | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('indent')
      .toEqualTypeOf<Nilable<boolean | string>>()
  })

  it('should match [inlineDynamicImports?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('inlineDynamicImports')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [input?: Input | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('input')
      .toEqualTypeOf<Nilable<Input>>()
  })

  it('should match [interop?: InteropOption | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('interop')
      .toEqualTypeOf<Nilable<InteropOption>>()
  })

  it('should match [logLevel?: LogType | "silent" | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('logLevel')
      .toEqualTypeOf<Nilable<LogType | 'silent'>>()
  })

  it('should match [maxParallelFileOps?: number | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('maxParallelFileOps')
      .toEqualTypeOf<Nilable<number>>()
  })

  it('should match [minifyInternalExports?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('minifyInternalExports')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [moduleContext?: ModuleContextOption | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('moduleContext')
      .toEqualTypeOf<Nilable<ModuleContextOption>>()
  })

  it('should match [noConflict?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('noConflict')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [outdir?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('outdir')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [plugins?: InputPluginOption[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('plugins')
      .toEqualTypeOf<Nilable<InputPluginOption[]>>()
  })

  it('should match [preserveEntrySignatures?: PreserveEntrySignaturesOption | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preserveEntrySignatures')
      .toEqualTypeOf<Nilable<PreserveEntrySignaturesOption>>()
  })

  it('should match [reexportProtoFromExternal?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('reexportProtoFromExternal')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [resolve?: ResolveOptions | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('resolve')
      .toEqualTypeOf<Nilable<ResolveOptions>>()
  })

  it('should match [root?: ModuleId | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('root')
      .toEqualTypeOf<Nilable<ModuleId>>()
  })

  it('should match [sanitizeFileName?: SanitizeFileNameFn | boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sanitizeFileName')
      .toEqualTypeOf<Nilable<SanitizeFileNameFn | boolean>>()
  })

  it('should match [shimMissingExports?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('shimMissingExports')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [sourcemap?: SourcemapOption | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sourcemap')
      .toEqualTypeOf<Nilable<SourcemapOption>>()
  })

  it('should match [sourcemapBaseUrl?: ModuleId | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sourcemapBaseUrl')
      .toEqualTypeOf<Nilable<ModuleId>>()
  })

  it('should match [sourcemapExcludeSources?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sourcemapExcludeSources')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [sourcemapFileNames?: SourcemapFileNamesFn | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sourcemapFileNames')
      .toEqualTypeOf<Nilable<SourcemapFileNamesFn | string>>()
  })

  it('should match [sourcemapIgnoreList?: SourcemapIgnoreTest | boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sourcemapIgnoreList')
      .toEqualTypeOf<Nilable<SourcemapIgnoreTest | boolean>>()
  })

  it('should match [sourcemapPathTransform?: SourcemapPathTransform | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sourcemapPathTransform')
      .toEqualTypeOf<Nilable<SourcemapPathTransform>>()
  })

  it('should match [strict?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('strict')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [strictDeprecations?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('strictDeprecations')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [systemNullSetters?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('systemNullSetters')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [tsconfig?: ModuleId | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tsconfig')
      .toEqualTypeOf<Nilable<ModuleId>>()
  })

  it('should match [tsconfigRaw?: Tsconfig | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tsconfigRaw')
      .toEqualTypeOf<Nilable<Tsconfig | string>>()
  })

  it('should match [treeshake?: TreeshakeOption | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('treeshake')
      .toEqualTypeOf<Nilable<TreeshakeOption>>()
  })

  it('should match [typescriptPath?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('typescriptPath')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [validate?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('validate')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [virtualDirname?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('virtualDirname')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [write?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('write')
      .toEqualTypeOf<Nilable<boolean>>()
  })
})
