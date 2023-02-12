# mkbuild

[![npm](https://img.shields.io/npm/v/@flex-development/mkbuild.svg)](https://npmjs.com/package/@flex-development/mkbuild)
[![codecov](https://codecov.io/gh/flex-development/mkbuild/branch/main/graph/badge.svg?token=TDSHFXPP4Z)](https://codecov.io/gh/flex-development/mkbuild)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/mkbuild.svg)](LICENSE.md)
[![conventional commits](https://img.shields.io/badge/-conventional%20commits-fe5196?logo=conventional-commits&logoColor=ffffff)](https://conventionalcommits.org/)
[![typescript](https://img.shields.io/badge/-typescript-3178c6?logo=typescript&logoColor=ffffff)](https://typescriptlang.org/)
[![vitest](https://img.shields.io/badge/-vitest-6e9f18?style=flat&logo=vitest&logoColor=ffffff)](https://vitest.dev/)
[![yarn](https://img.shields.io/badge/-yarn-2c8ebb?style=flat&logo=yarn&logoColor=ffffff)](https://yarnpkg.com/)

An [esbuild][1] based file-to-file transformer and bundler.

## Contents

- [Features](#features)
- [Install](#install)
- [Use](#use)
  - [Configuration](#configuration)
  - [Configuring Build Entries](#configuring-build-entries)
- [Types](#types)
- [Contribute](#contribute)

## Features

### :package: optimized bundler and transpiler

fast and minimal builds with [esbuild][1] (integrates with the build api for plugin support &mdash; say toodles 👋🏾 to
transform api hacks! :wink:)

### :file_folder: bundleless dists

create bundleless distributions with file-to-file transpilation and static asset copying

### :relieved: esm friendly

create es modules + add file extensions to specifiers in modules **_and_** declaration files

### :bookmark_tabs: dts generation <small>(`.d.cts`, `.d.mts`, `.d.ts`)</small>

generate declarations for `.cjs`, `.cts`, `.js`, `.jsx`, `.mjs`, `.mts`, `.ts`, and `.tsx` files

### :dna: path alias support

resolve path aliases in `.cjs`, `.cts`, `.d.cts`, `.d.mts`, `.d.ts`, `.js`, `.jsx`, `.mjs`, `.mts`, `.ts`, and `.tsx`
files

## Install

This package is [ESM only][2].

```sh
yarn add -D @flex-development/mkbuild esbuild typescript
```

From Git:

```sh
yarn add -D @flex-development/mkbuild@flex-development/mkbuild esbuild typescript
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/features/protocols#git'>Git - Protocols | Yarn</a>
    &nbsp;for details on requesting a specific branch, commit, or tag.
  </small>
</blockquote>

## Use

```shell
mkbuild
```

Running the command above without a [build configuration](#configuration) file will create a bundleless [esm][3] build
with [declarations][4].

Files within the `src` directory will be transpiled or copied and output to `dist/**.{d.mts,mjs}`. Declaration files,
`dist/**.d.mts`, will be generated if `typescript` is installed. The original folder structure and extensions of copied
files will remain in tact.

### Configuration

Create `build.config.{cjs,cts,js,json,mjs,mts,ts}`:

```typescript
/**
 * @file Build Config
 * @module config/build
 */

import { defineBuildConfig } from '@flex-development/mkbuild'

export default defineBuildConfig({
  // esbuild options; see https://esbuild.github.io/api/#build-api
  sourcemap: 'external',
  sourcesContent: false,
  treeShaking: true,
  tsconfig: 'tsconfig.build.json'
})
```

See all configuration options [here](src/interfaces/config).

Options common to build configs and [build entries](#configuring-build-entries) can be seen
[here](src/interfaces/options).

### Configuring Build Entries

```typescript
/**
 * @file Build Config
 * @module config/build
 */

import { defineBuildConfig } from '@flex-development/mkbuild'
import pkg from './package.json' assert { type: 'json' }

export default defineBuildConfig({
  entries: [
    { dts: true, ignore: ['cli.ts'] }, // dist/**.{d.mts,mjs}
    { dts: true, ext: '.cjs', format: 'cjs', ignore: ['cli.ts'] }, // dist/**.{cjs,d.cts}
    { dts: 'only', ext: '.js', ignore: ['cli.ts'] }, // dist/**.d.ts
    { bundle: true, minify: true, source: 'src/cli.ts' } // dist/cli.mjs
  ],
  platform: 'node',
  sourcemap: 'external',
  sourcesContent: false,
  target: 'node' + pkg.engines.node.replace(/^\D+/, ''),
  treeShaking: true,
  tsconfig: 'tsconfig.build.json'
})
```

See all build entry options [here](src/interfaces/entry).

## Types

This package is fully typed with [TypeScript][5].

## Contribute

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

[1]: https://esbuild.github.io
[2]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[3]: https://nodejs.org/api/esm.html
[4]: https://www.typescriptlang.org/docs/handbook/2/type-declarations.html
[5]: https://typescriptlang.org/
