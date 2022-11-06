## [1.0.0-alpha.9](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.8...1.0.0-alpha.9) (2022-11-06)


### :package: Build

* **deps:** use @flex-development/mlly@1.0.0-alpha.2 ([94ddedb](https://github.com/flex-development/mkbuild/commit/94ddedba5c8d75510fc4829695d5b7c113b865f6))


### :robot: Continuous Integration

* **deps:** bump dependabot/fetch-metadata from 1.3.3 to 1.3.5 ([#31](https://github.com/flex-development/mkbuild/issues/31)) ([d6aef35](https://github.com/flex-development/mkbuild/commit/d6aef350979a98a016ce329b186c2e53705ce8fd))

## [1.0.0-alpha.8](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.7...1.0.0-alpha.8) (2022-10-22)


### :package: Build

* **deps:** use flex-development/mlly@a58ec2055750747743bc537f32f33ad7676fdcf4 ([ca74bfd](https://github.com/flex-development/mkbuild/commit/ca74bfd4c4057fe739ede1b65a2f7459549e33ab))

## [1.0.0-alpha.7](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.6...1.0.0-alpha.7) (2022-10-21)


### :package: Build

* cleanup build target settings ([548b846](https://github.com/flex-development/mkbuild/commit/548b846ee64cd39e517a78c161220279a409746b))
* remove `src` files from distribution ([d0a3302](https://github.com/flex-development/mkbuild/commit/d0a3302df9ffa1dd6ee2d962b6153613261cc7bc))
* replace `mlly` with `@flex-development/mlly` ([72d3fcf](https://github.com/flex-development/mkbuild/commit/72d3fcf31b5e9105ae9baa8290666ab827a51f27))
* **deps-dev:** bump deps according to `yarn upgrade-interactive` ([ba92cd0](https://github.com/flex-development/mkbuild/commit/ba92cd0d75b29216348320a55d0e20b9a1de0477))
* **deps-dev:** bump esbuild from 0.15.10 to 0.15.12 ([3321e1e](https://github.com/flex-development/mkbuild/commit/3321e1ed9e617f6148c3a70a04f7cb0b628467fa))
* **exports:** export `.`, `./package.json`, and `./plugins/*` only ([825c536](https://github.com/flex-development/mkbuild/commit/825c5367a4f89bb3334a3c466af8f5568dd88b2f))
* **pkg:** add `"sideEffects": false` ([6bc2cd0](https://github.com/flex-development/mkbuild/commit/6bc2cd0a617d1131315a8e14ae861e9922ebcae9))


### :robot: Continuous Integration

* **deps:** bump actions/checkout from 3.0.2 to 3.1.0 ([#22](https://github.com/flex-development/mkbuild/issues/22)) ([0632090](https://github.com/flex-development/mkbuild/commit/0632090da01483d2918a43ea936038cd658526cc))
* **deps:** bump actions/github-script from 6.3.0 to 6.3.1 ([#20](https://github.com/flex-development/mkbuild/issues/20)) ([ba50c35](https://github.com/flex-development/mkbuild/commit/ba50c35f349c8572110c1e56106d87a9b545af56))
* **deps:** bump actions/github-script from 6.3.1 to 6.3.2 ([#25](https://github.com/flex-development/mkbuild/issues/25)) ([557bf2e](https://github.com/flex-development/mkbuild/commit/557bf2e7d0753abf6efdcba3f4f8267aa393ec10))
* **deps:** bump actions/github-script from 6.3.2 to 6.3.3 ([#27](https://github.com/flex-development/mkbuild/issues/27)) ([2943bf8](https://github.com/flex-development/mkbuild/commit/2943bf836bceb179ffbe9104fb804aba788416ca))
* **deps:** bump crazy-max/ghaction-import-gpg from 5.1.0 to 5.2.0 ([#28](https://github.com/flex-development/mkbuild/issues/28)) ([ab88c54](https://github.com/flex-development/mkbuild/commit/ab88c5457f0dd8313614931fd5d33fb79e41c90e))
* **deps:** bump hmarr/debug-action from 2.0.1 to 2.1.0 ([#23](https://github.com/flex-development/mkbuild/issues/23)) ([f78e5e8](https://github.com/flex-development/mkbuild/commit/f78e5e80bab643f3c63e8d8f12b3437cc3495d2c))


### :pencil: Documentation

* merge zsh docs into contributing guide ([42f50bd](https://github.com/flex-development/mkbuild/commit/42f50bdc3063566be1b2b063b76686f5992ac58c))
* reorganize gpr install guide ([ca184cb](https://github.com/flex-development/mkbuild/commit/ca184cbd514b964e50e7944b87885162cffdbd5a))


### :house_with_garden: Housekeeping

* add "vscode as git editor" setup to sample gitconfig ([b215a09](https://github.com/flex-development/mkbuild/commit/b215a092abe6dc4602a0a28bb176b1d8f43a1cf7))
* **tests:** reorganize vitest config ([7b690c6](https://github.com/flex-development/mkbuild/commit/7b690c600ee3471ff9af180f3fa35ad26f367d82))
* **tests:** update `ImportMetaEnv` base ([50842cc](https://github.com/flex-development/mkbuild/commit/50842cc2a2c9ca5be7211d6bf94ad6113b9ead81))
* **ts:** enforce `import type` for type-only imports ([6fb9272](https://github.com/flex-development/mkbuild/commit/6fb92721b9794e0cba76e4bd71305846d3947fa4))
* **vscode:** configure debugging ([6c6ea09](https://github.com/flex-development/mkbuild/commit/6c6ea094d4cecafb7e5af1c70148d4ac24065890))

## [1.0.0-alpha.6](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.5...1.0.0-alpha.6) (2022-10-02)


### :package: Build

* **deps-dev:** bump @flex-development/tutils from 5.0.0 to 5.0.1 ([7cc1c69](https://github.com/flex-development/mkbuild/commit/7cc1c69e11d54fec3125f570d04be83c3f6d472f))
* **deps:** move @flex-development/tutils to `dependencies` ([eee26a9](https://github.com/flex-development/mkbuild/commit/eee26a95217386f4bd9204b49dec118577b4b94c))


### :bug: Fixes

* **plugins:** [`fully-specified`] dot case specifiers support ([b301894](https://github.com/flex-development/mkbuild/commit/b301894aac5f29f9ea36eeb2a21ac737d7732483))

## [1.0.0-alpha.5](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.4...1.0.0-alpha.5) (2022-09-30)


### :package: Build

* **deps-dev:** bump pretty-format from 29.1.0 to 29.1.2 ([bf400b2](https://github.com/flex-development/mkbuild/commit/bf400b24a43a3f5e768ba4090751ee03700166c8))
* **deps:** bump mlly from 0.5.14 to 0.5.16 ([95bdfc8](https://github.com/flex-development/mkbuild/commit/95bdfc8b07ec3becf5cc586c2423d3e90f3d30e2))

## [1.0.0-alpha.4](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.3...1.0.0-alpha.4) (2022-09-30)


### :bug: Fixes

* **plugins:** [`fully-specified`] `Cannot read properties of undefined (reading 'length')` ([deab2d8](https://github.com/flex-development/mkbuild/commit/deab2d8da9b44aa88120d6f5c240efd0a2d23e7a))


### :house_with_garden: Housekeeping

* `.graphqlrc.cts` -> `.graphqlrc.yml` ([24a70c3](https://github.com/flex-development/mkbuild/commit/24a70c3a445f8c192f6bd9c884d88845540fc2d1))
* **deps-dev:** cleanup + upgrade deps ([50d2562](https://github.com/flex-development/mkbuild/commit/50d2562defe001ad4e55eff280addf7fdbcf7b6a))

## [1.0.0-alpha.3](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.2...1.0.0-alpha.3) (2022-09-29)


### :bug: Fixes

* **plugins:** [`create-require`] remove new line from end of snippet if output should be minified ([dc0f0f9](https://github.com/flex-development/mkbuild/commit/dc0f0f93ce7cb9844360f59da605eeaa52164d77))

## [1.0.0-alpha.2](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.1...1.0.0-alpha.2) (2022-09-29)


### :zap: Refactors

* **options:** merge esbuild options into common build options ([0b40f2d](https://github.com/flex-development/mkbuild/commit/0b40f2d9a7cb774eda82d01ab8b176744797af84))

## 1.0.0-alpha.1 (2022-09-29)


### :package: Build

* fix `ERR_PACKAGE_IMPORT_NOT_DEFINED` ([c5e7153](https://github.com/flex-development/mkbuild/commit/c5e715305b72bd678edd71564ae3afb83f893fee))
* remove `main` field ([c408bba](https://github.com/flex-development/mkbuild/commit/c408bbaff206b8fbb2094d11794599342801c8fa))
* **deps-peer:** require `esbuild>=0.15.0` ([8752a0b](https://github.com/flex-development/mkbuild/commit/8752a0b03352f946a6ee52c095e9cc966b9807b0))
* **esm:** pure esm ([0705685](https://github.com/flex-development/mkbuild/commit/0705685f33ce75b785a83001827d067119c58d09))
* **exports:** remove extraneous exports ([7bde131](https://github.com/flex-development/mkbuild/commit/7bde1319e5288fed720d1390b1463d2f44380c51))
* **node:** make programmatic users apply patches ([811ba99](https://github.com/flex-development/mkbuild/commit/811ba99eaea0f4af4dd0330f602a781cb28b860f))


### :robot: Continuous Integration

* add [@dependabot](https://github.com/dependabot) config ([9c58d1c](https://github.com/flex-development/mkbuild/commit/9c58d1ca753406bbba92c729360b9b6e400a6e9a))
* **deps:** bump actions/github-script from 6.2.0 to 6.3.0 ([#11](https://github.com/flex-development/mkbuild/issues/11)) ([bc89779](https://github.com/flex-development/mkbuild/commit/bc89779332666701448a1083b9759017f299ad3b))
* **deps:** bump actions/setup-node from 3.4.1 to 3.5.0 ([#12](https://github.com/flex-development/mkbuild/issues/12)) ([cff3812](https://github.com/flex-development/mkbuild/commit/cff38122a9d1521d9364fc7c6770cd762c6748f0))
* **deps:** bump flex-development/dist-tag-action from 1.1.0 to 1.1.1 ([#13](https://github.com/flex-development/mkbuild/issues/13)) ([28ee8df](https://github.com/flex-development/mkbuild/commit/28ee8df69b00be0adf5f0e46543f14eb96a308af))


### :pencil: Documentation

* add `module type` badge ([bd9814f](https://github.com/flex-development/mkbuild/commit/bd9814f3a5366bee74b97870e5349d6b59767c39))
* features ([2eecc98](https://github.com/flex-development/mkbuild/commit/2eecc98e289835f74fe3214791a0718ff257a9b3))
* remove "built with" section in `README` ([36af097](https://github.com/flex-development/mkbuild/commit/36af0975ca143e4e9e5f3237d71568ca60094296))
* remove starter todo list ([4e6959f](https://github.com/flex-development/mkbuild/commit/4e6959f7f8b6f3d4840433e938ca3947db5cd51d))
* update project description ([cd8ee28](https://github.com/flex-development/mkbuild/commit/cd8ee28635f02e9fd6c94209140b47a1158cf2f1))
* usage ([ba6861a](https://github.com/flex-development/mkbuild/commit/ba6861ab81f47bd2644ff36097cb695ec87d48cb))


### :sparkles: Features

* auto-insert `require` definition when creating esm bundles ([b584192](https://github.com/flex-development/mkbuild/commit/b584192816d48085407487df05203de243631f4d))
* bundling ([#10](https://github.com/flex-development/mkbuild/issues/10)) ([10f79b5](https://github.com/flex-development/mkbuild/commit/10f79b5bb4a38e88c5d173c7832c402a5971b835))
* file-to-file transpilation ([#4](https://github.com/flex-development/mkbuild/issues/4)) ([1601d26](https://github.com/flex-development/mkbuild/commit/1601d268bce74abafab6a4b0d0e244b35dd1e808))
* infer build entry from build config ([5168c94](https://github.com/flex-development/mkbuild/commit/5168c9466e33dc7b4325d1a1c53f14e18892ce25))
* **cli:** cli ([9c82c3b](https://github.com/flex-development/mkbuild/commit/9c82c3b24887cb596f66e5d924bb86f12b6f3186))
* **esbuild:** source map support ([#8](https://github.com/flex-development/mkbuild/issues/8)) ([fd58b93](https://github.com/flex-development/mkbuild/commit/fd58b93450f5352c29c511b2af394d794b22227e))
* **options:** default `dts` based on `typescript` install ([2af6d0e](https://github.com/flex-development/mkbuild/commit/2af6d0e6d77a50c5481d3c1d111841f90f1943a4))
* **options:** options ([#3](https://github.com/flex-development/mkbuild/issues/3)) ([b12fa72](https://github.com/flex-development/mkbuild/commit/b12fa72123b782757dc365d5af11e2ac816a8c80))
* **plugins:** [`create-require`] recalculate output file size ([6f62642](https://github.com/flex-development/mkbuild/commit/6f62642a5121c44ff9aa79a6cca3418166ceddc6))
* **plugins:** `create-require` ([885b805](https://github.com/flex-development/mkbuild/commit/885b805db5eefb42fb8b92a4f1736b14e7a23058))


### :bug: Fixes

* **config:** prevent `import.meta.url` from being rewritten ([3e9c7c8](https://github.com/flex-development/mkbuild/commit/3e9c7c881cbc93156fe31176c7a0090e698dfac6))
* **config:** prevent json imports from being converted into data urls ([63b1261](https://github.com/flex-development/mkbuild/commit/63b126136d2564c71253f1e22eb1317a0ac983c0))


### :house_with_garden: Housekeeping

* update `eslint.globals.JSX` logic ([c997476](https://github.com/flex-development/mkbuild/commit/c9974764b81a684adeb1352b71597d223a3cbd71))
* update eslint extensions ([95963c6](https://github.com/flex-development/mkbuild/commit/95963c6d7bec157f31f2d8adefcf656d450b3a08))
* **deps-dev:** resolve esbuild to 0.15.9 ([c0acee4](https://github.com/flex-development/mkbuild/commit/c0acee43767f4a977ad80393d2a6f3075dfaa078))
* **esm:** cleanup ([0e1abd2](https://github.com/flex-development/mkbuild/commit/0e1abd2bc63613cb1c11a8fbebe4767489b626a5))
* **github:** update text file extensions in `.gitattributes` ([ff6d830](https://github.com/flex-development/mkbuild/commit/ff6d83096305fdaa512d884688a450a5170fb391))
* **pkg:** check test coverage in `check:ci` script ([799bb8c](https://github.com/flex-development/mkbuild/commit/799bb8c299cc7f4372a97aacc255d23e40de2383))
* **pkg:** check types build in `check:ci` script ([e357301](https://github.com/flex-development/mkbuild/commit/e35730159a30a1bbae84bfe39625b751b1440ff6))
* **pkg:** convert `bugs` and `repository` field to strings ([aff2cd7](https://github.com/flex-development/mkbuild/commit/aff2cd70bb5071e94400c3305b786d234c343b1a))
* **pkg:** update `keywords` ([98fe7c3](https://github.com/flex-development/mkbuild/commit/98fe7c340b50f105d32ad0d402c4c22ff28f7bbd))
* **tests:** cleanup test environment ([34a0fb0](https://github.com/flex-development/mkbuild/commit/34a0fb0f6b73038734b2ab818df29fd2f8cae841))
* **tests:** remove `.env.test` ([0132bd3](https://github.com/flex-development/mkbuild/commit/0132bd352191a09bb80414ccfeb41e43b82eb1c0))
* **ts:** set `module` to `NodeNext` ([2917af4](https://github.com/flex-development/mkbuild/commit/2917af4ea5ae200f46565b3c0cbf6f32cc685577))
* **vscode:** cleanup settings ([4827c7c](https://github.com/flex-development/mkbuild/commit/4827c7cc70ad601d1bb512292954e9e85436de36))


### :zap: Refactors

* **node:** add `dependencies` check to default `Entry#createRequire` logic ([0341d74](https://github.com/flex-development/mkbuild/commit/0341d74841628627cfc83527b341c33ffcd6be3f))
* **options:** `declaration?` -> `dts?` ([3ddb296](https://github.com/flex-development/mkbuild/commit/3ddb29625b6c1220a84b7f35336758a40d05ae17))
* **utils:** [`esbuilder`] let esbuild externalize node built-ins ([200d360](https://github.com/flex-development/mkbuild/commit/200d360bda3ca7accd5cf7251d6322adeacb4c50))
* **utils:** [`esbuilder`] remove `TS_NODE_PROJECT` check for tsconfig-paths plugin ([c863c7e](https://github.com/flex-development/mkbuild/commit/c863c7e1467b799609ac084b197ef9f0a4a03cec))
* **utils:** [`extractStatements`] follow `unsupported-dynamic-import` rule ([ee2110b](https://github.com/flex-development/mkbuild/commit/ee2110ba7abb7214b30a92eb4b72ad9532b7a377))

