# mkbuild

[![conventional commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![npm](https://img.shields.io/npm/v/@flex-development/mkbuild.svg)](https://npmjs.com/package/@flex-development/mkbuild)
[![license](https://img.shields.io/github/license/flex-development/mkbuild.svg)](LICENSE.md)
[![typescript](https://badgen.net/badge/-/typescript?color=2a72bc&icon=typescript&label)](https://typescriptlang.org)

> An [esbuild][1] based file-to-file transformer and bundler.

## :eyes: Features

### :package: optimized bundler and transpiler

fast and minimal builds with [esbuild][1] (integrates with the build api for
plugin support - say toodles 👋🏾 to transform api hacks! :wink:)

### :file_folder: bundleless dists

create bundleless distributions with file-to-file transpilation and static asset
copying

### :relieved: esm friendly

create es modules + add file extensions to specifiers in modules **_and_**
declaration files

### :bookmark_tabs: dts generation <small>(`.d.cts`, `.d.mts`, `.d.ts`)</small>

generate declarations for `.cjs`, `.cts`, `.js`, `.jsx`, `.mjs`, `.mts`, `.ts`,
and `.tsx` files

### :dna: path alias support

resolve path aliases in `.cjs`, `.cts`, `.d.cts`, `.d.mts`, `.d.ts`, `.js`,
`.jsx`, `.mjs`, `.mts`, `.ts`, and `.tsx` files

## Install

```sh
yarn add -D @flex-development/mkbuild esbuild typescript
```

### GitHub Package Registry

To install from the GitHub Package Registry:

1. Setup a `.npmrc` or `.yarnrc.yml` file to authenticate with the registry

   **`.npmrc`**

   ```ini
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   @flex-development:registry=https://npm.pkg.github.com/
   ```

   **`.yarnrc.yml`**

   ```yaml
   npmRegistries:
     //npm.pkg.github.com:
       npmAlwaysAuth: true
       npmAuthToken: ${GITHUB_TOKEN}

   npmScopes:
     flex-development:
       npmRegistryServer: https://npm.pkg.github.com
   ```

   where `GITHUB_TOKEN` is a [Personal Access Token with the `read:packages`
   scope][2].

2. Run install command

   ```sh
   yarn add -D @flex-development/mkbuild esbuild typescript
   ```

### Git

See [npm-install][3] or [Git - Protocols | Yarn][4] for details on requesting a
specific branch, commit, or tag.

#### NPM

```sh
npm i -D flex-development/mkbuild
```

#### Yarn

```sh
yarn add -D @flex-development/mkbuild@flex-development/mkbuild esbuild typescript
```

## Usage

```shell
mkbuild
```

Running the command above without a [build configuration](#configuration) file
will create a bundleless [esm][5] build with [declarations][6].

Files within the `src` directory will be transpiled or copied and output to
`dist/**.{d.mts,mjs}`. Declaration files, `dist/**.d.mts`, will be generated if
`typescript` is installed. The original folder structure and extensions of
copied files will remain in tact.

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

Options common to build configs and [build entries](#configuring-build-entries)
can be seen [here](src/interfaces/options).

### Configuring Build Entries

```typescript
/**
 * @file Build Config
 * @module config/build
 */

import { defineBuildConfig } from '@flex-development/mkbuild'
import tsconfig from './tsconfig.build.json' assert { type: 'json' }

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
  target: [tsconfig.compilerOptions.target, 'node14'],
  treeShaking: true,
  tsconfig: 'tsconfig.build.json'
})
```

See all build entry options [here](src/interfaces/entry).

[1]: https://esbuild.github.io
[2]:
    https://docs.github.com/packages/learn-github-packages/about-permissions-for-github-packages#about-scopes-and-permissions-for-package-registries
[3]: https://docs.npmjs.com/cli/v8/commands/npm-install#description
[4]: https://yarnpkg.com/features/protocols#git
[5]: https://nodejs.org/api/esm.html
[6]: https://www.typescriptlang.org/docs/handbook/2/type-declarations.html
