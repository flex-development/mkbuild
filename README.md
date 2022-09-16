# mkbuild

[![conventional commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![module type: cjs+esm](https://img.shields.io/badge/module%20type-cjs%2besm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![npm](https://img.shields.io/npm/v/@flex-development/mkbuild.svg)](https://npmjs.com/package/@flex-development/mkbuild)
[![license](https://img.shields.io/github/license/flex-development/mkbuild.svg)](LICENSE.md)
[![typescript](https://badgen.net/badge/-/typescript?color=2a72bc&icon=typescript&label)](https://typescriptlang.org)

> An [esbuild][1] based file-to-file transformer and bundler.

## Install

```sh
yarn add @flex-development/mkbuild
```

### GitHub Package Registry

To install from the GitHub Package Registry, setup a `.npmrc` or `.yarnrc.yml`
file to authenticate with the registry.

A [Personal Access Token with the `read:packages` scope][2] is required.

#### `.npmrc`

```utf-8
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@flex-development:registry=https://npm.pkg.github.com/
```

#### `.yarnrc.yml`

```yaml
npmRegistries:
  //npm.pkg.github.com:
    npmAlwaysAuth: true
    npmAuthToken: ${GITHUB_TOKEN}

npmScopes:
  flex-development:
    npmRegistryServer: https://npm.pkg.github.com
```

### Git

See [npm-install][3] or [Git - Protocols | Yarn][4] for details on requesting a
specific branch, commit, or tag.

#### NPM

```sh
npm i flex-development/mkbuild
```

#### Yarn

```sh
yarn add @flex-development/mkbuild@flex-development/mkbuild
```

## Usage

**TODO**: Update documentation.

## Built With

**TODO**: Update documentation.

[1]: https://esbuild.github.io
[2]:
    https://docs.github.com/packages/learn-github-packages/about-permissions-for-github-packages#about-scopes-and-permissions-for-package-registries
[3]: https://docs.npmjs.com/cli/v8/commands/npm-install#description
[4]: https://yarnpkg.com/features/protocols#git
