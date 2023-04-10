## [1.0.0-alpha.20](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.19...1.0.0-alpha.20) (2023-04-10)


### :package: Build

* **deps-dev:** bump esbuild from 0.17.15 to 0.17.16 ([3d87eee](https://github.com/flex-development/mkbuild/commit/3d87eee043a91cb7813a3a91d9bd2fa472a6d4fb))
* **deps-peer:** bump esbuild from >=0.17.15 to >=0.17.16 ([69610a0](https://github.com/flex-development/mkbuild/commit/69610a0b4f01a282be6bf8dc3e2ee139431f2f42))
* **deps:** bump @flex-development/toggle-pkg-type from 1.1.1 to 2.0.0 ([36117e9](https://github.com/flex-development/mkbuild/commit/36117e9acabae95e37e69c6fb5dfe2fc99a2ecee))
* **deps:** bump consola from 2.15.3 to 3.0.0-3 ([78b5666](https://github.com/flex-development/mkbuild/commit/78b5666ae50d5db4bb6e24089f3dfa0e79c20e6c))


### :robot: Continuous Integration

* **workflows:** [`cache-cleanup`] fix branch checkout ([50a20ce](https://github.com/flex-development/mkbuild/commit/50a20ce4bff749f8f2ebc54abdaf094a58c22b86))
* **workflows:** [`ci`] check for test files ([5578022](https://github.com/flex-development/mkbuild/commit/5578022f15f2554b33720df77a4ea75e940092e8))
* **workflows:** [`release`] checkout release commit from `main` ([0edd574](https://github.com/flex-development/mkbuild/commit/0edd57436a48456baf7209dceb8ffcd5a0463b22))


### :bug: Fixes

* **plugins:** [`filter`] filter output file metadata ([7efead9](https://github.com/flex-development/mkbuild/commit/7efead95d1feaa19f3b395932bc243d0b2e32045))


### :house_with_garden: Housekeeping

* sync config files ([0740dcc](https://github.com/flex-development/mkbuild/commit/0740dcc653ec543b8416e066d025c5e00c17fbf9))
* **github:** delete branch on merge ([5e929c4](https://github.com/flex-development/mkbuild/commit/5e929c460700f33b2e6fc76bbb53893f9c83757c))

## [1.0.0-alpha.19](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.18...1.0.0-alpha.19) (2023-04-08)


### :package: Build

* output `utf8` ([9b3eba3](https://github.com/flex-development/mkbuild/commit/9b3eba3652ae14c2822539cfca9e57996959879c))


### :sparkles: Features

* serve mode + live reload ([f47bbf0](https://github.com/flex-development/mkbuild/commit/f47bbf072d6d4c45fc2f9de59dadc61e77e1a0d4))

## [1.0.0-alpha.18](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.17...1.0.0-alpha.18) (2023-04-07)


### :bug: Fixes

* **cli:** terminate `watch` mode via esbuild ([34ef996](https://github.com/flex-development/mkbuild/commit/34ef996197443dcd2b51987731537314d9831a57))

## [1.0.0-alpha.17](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.16...1.0.0-alpha.17) (2023-04-07)


### ⚠ BREAKING CHANGES

* **utils:** [`analyzeOutputs`] intake `esbuild.Metafile['outputs']`
* **cli:** reimplement with `nest-commander`
* watch mode

### :package: Build

* **deps-dev:** Bump @commitlint/cli from 17.4.4 to 17.5.0 ([#149](https://github.com/flex-development/mkbuild/issues/149)) ([05ac930](https://github.com/flex-development/mkbuild/commit/05ac9309a2d5cfda5d170857baf1f0f36c559f95))
* **deps-dev:** Bump @commitlint/cli from 17.5.0 to 17.5.1 ([#170](https://github.com/flex-development/mkbuild/issues/170)) ([570fc4d](https://github.com/flex-development/mkbuild/commit/570fc4d307c0b8e20fa10a75231e3f545c00b1c3))
* **deps-dev:** Bump @faker-js/faker from 8.0.0-alpha.0 to 8.0.0-alpha.1 ([#153](https://github.com/flex-development/mkbuild/issues/153)) ([cd18a56](https://github.com/flex-development/mkbuild/commit/cd18a5668263b39be075b3e20fd535c8dfa023ea))
* **deps-dev:** Bump @faker-js/faker from 8.0.0-alpha.1 to 8.0.0-alpha.2 ([#161](https://github.com/flex-development/mkbuild/issues/161)) ([20dda4f](https://github.com/flex-development/mkbuild/commit/20dda4fec4292fed45b6027504cd94ccd3b890df))
* **deps-dev:** Bump @graphql-eslint/eslint-plugin from 3.16.1 to 3.17.0 ([#162](https://github.com/flex-development/mkbuild/issues/162)) ([f54d814](https://github.com/flex-development/mkbuild/commit/f54d8145c207b2170dc6589bcbbbb8cba55ff4bd))
* **deps-dev:** Bump @graphql-eslint/eslint-plugin from 3.17.0 to 3.18.0 ([#175](https://github.com/flex-development/mkbuild/issues/175)) ([918ddbd](https://github.com/flex-development/mkbuild/commit/918ddbd6d54b4e9e666f3cc3742fbaf21788d7c6))
* **deps-dev:** Bump @nestjs/common from 9.3.12 to 9.4.0 ([#190](https://github.com/flex-development/mkbuild/issues/190)) ([1d77592](https://github.com/flex-development/mkbuild/commit/1d775925bebaaf47c7c67586e4a9976f028fdc99))
* **deps-dev:** Bump @nestjs/core from 9.3.12 to 9.4.0 ([#188](https://github.com/flex-development/mkbuild/issues/188)) ([a4c126a](https://github.com/flex-development/mkbuild/commit/a4c126ac0cc12f00d0aa0792132512209865ecdd))
* **deps-dev:** Bump @nestjs/testing from 9.3.12 to 9.4.0 ([#189](https://github.com/flex-development/mkbuild/issues/189)) ([0f4c23a](https://github.com/flex-development/mkbuild/commit/0f4c23a65ae4b03a1eb7924d23340409ef942a8e))
* **deps-dev:** Bump @typescript-eslint/eslint-plugin from 5.54.0 to 5.54.1 ([#109](https://github.com/flex-development/mkbuild/issues/109)) ([0552329](https://github.com/flex-development/mkbuild/commit/0552329fecb6cb7b861b3c43743981fa00a6d1cd))
* **deps-dev:** Bump @typescript-eslint/eslint-plugin from 5.54.1 to 5.55.0 ([#130](https://github.com/flex-development/mkbuild/issues/130)) ([7538774](https://github.com/flex-development/mkbuild/commit/75387745409e065b5c6aefb569948911881c7cbc))
* **deps-dev:** Bump @typescript-eslint/eslint-plugin from 5.55.0 to 5.56.0 ([#146](https://github.com/flex-development/mkbuild/issues/146)) ([15b7592](https://github.com/flex-development/mkbuild/commit/15b75920d6b1644695b7d8988fe5e2704411cc4b))
* **deps-dev:** Bump @typescript-eslint/eslint-plugin from 5.56.0 to 5.57.0 ([#163](https://github.com/flex-development/mkbuild/issues/163)) ([87dbb30](https://github.com/flex-development/mkbuild/commit/87dbb3031c844696e757a710b2718b25724d24af))
* **deps-dev:** Bump @typescript-eslint/eslint-plugin from 5.57.0 to 5.57.1 ([#183](https://github.com/flex-development/mkbuild/issues/183)) ([89e90e7](https://github.com/flex-development/mkbuild/commit/89e90e7b84b927ff1eaea20c23bda52d61c370f1))
* **deps-dev:** Bump @typescript-eslint/parser from 5.54.0 to 5.54.1 ([#117](https://github.com/flex-development/mkbuild/issues/117)) ([af4373d](https://github.com/flex-development/mkbuild/commit/af4373d8ae8036de868505d00e106f062a02ca0e))
* **deps-dev:** Bump @typescript-eslint/parser from 5.54.1 to 5.55.0 ([#129](https://github.com/flex-development/mkbuild/issues/129)) ([6e942d4](https://github.com/flex-development/mkbuild/commit/6e942d4ac30d1074ecc5f6761dee340d14f11ca6))
* **deps-dev:** Bump @typescript-eslint/parser from 5.55.0 to 5.56.0 ([#145](https://github.com/flex-development/mkbuild/issues/145)) ([a8ea6ab](https://github.com/flex-development/mkbuild/commit/a8ea6abeb5e0ba738de72249e9edcbda44bacf14))
* **deps-dev:** Bump @typescript-eslint/parser from 5.56.0 to 5.57.0 ([#165](https://github.com/flex-development/mkbuild/issues/165)) ([a746722](https://github.com/flex-development/mkbuild/commit/a746722c3ef43990cb2ce9118049b703ef247afd))
* **deps-dev:** Bump @typescript-eslint/parser from 5.57.0 to 5.57.1 ([#184](https://github.com/flex-development/mkbuild/issues/184)) ([56965d5](https://github.com/flex-development/mkbuild/commit/56965d552082c7a306999c4200bfe25b58fadb64))
* **deps-dev:** Bump @vitest/coverage-c8 from 0.29.2 to 0.29.7 ([#141](https://github.com/flex-development/mkbuild/issues/141)) ([d26aa4d](https://github.com/flex-development/mkbuild/commit/d26aa4d3a66cfac8635977e35ae198e1084b45f2))
* **deps-dev:** Bump @vitest/ui from 0.29.2 to 0.29.7 ([#140](https://github.com/flex-development/mkbuild/issues/140)) ([fdcca4f](https://github.com/flex-development/mkbuild/commit/fdcca4ffcdd2fc4e8b8a1fe972677fbd842092b1))
* **deps-dev:** Bump @vitest/ui from 0.29.7 to 0.29.8 ([#169](https://github.com/flex-development/mkbuild/issues/169)) ([124260c](https://github.com/flex-development/mkbuild/commit/124260c84c7bebdf47eb856227aa187a94262ecb))
* **deps-dev:** Bump cspell from 6.27.0 to 6.28.0 ([#107](https://github.com/flex-development/mkbuild/issues/107)) ([2b51662](https://github.com/flex-development/mkbuild/commit/2b5166233a2794d010cba67e4d2de30cc080d1c0))
* **deps-dev:** Bump cspell from 6.28.0 to 6.29.0 ([#124](https://github.com/flex-development/mkbuild/issues/124)) ([09f0354](https://github.com/flex-development/mkbuild/commit/09f035441f41882e2561832e175bc6321d8fa6d5))
* **deps-dev:** Bump cspell from 6.29.0 to 6.29.3 ([#131](https://github.com/flex-development/mkbuild/issues/131)) ([9774100](https://github.com/flex-development/mkbuild/commit/9774100d75225d261217ea538b8eb2efd45684ee))
* **deps-dev:** Bump cspell from 6.29.3 to 6.30.2 ([#150](https://github.com/flex-development/mkbuild/issues/150)) ([1f85ddd](https://github.com/flex-development/mkbuild/commit/1f85ddd186fe007092f38fa06b3d3393d5f63fb6))
* **deps-dev:** Bump cspell from 6.30.2 to 6.31.1 ([#159](https://github.com/flex-development/mkbuild/issues/159)) ([c759852](https://github.com/flex-development/mkbuild/commit/c759852cd9cd4196c86df568ef44f9445604ea21))
* **deps-dev:** Bump esbuild from 0.17.10 to 0.17.11 ([#105](https://github.com/flex-development/mkbuild/issues/105)) ([4563c32](https://github.com/flex-development/mkbuild/commit/4563c32b0bfd7bfba98587719b975962c5d03dd1))
* **deps-dev:** Bump esbuild from 0.17.11 to 0.17.14 ([#160](https://github.com/flex-development/mkbuild/issues/160)) ([07dc606](https://github.com/flex-development/mkbuild/commit/07dc606cfc2a7074edd0834577adf7ead3a5b72d))
* **deps-dev:** Bump esbuild from 0.17.14 to 0.17.15 ([#179](https://github.com/flex-development/mkbuild/issues/179)) ([ac680af](https://github.com/flex-development/mkbuild/commit/ac680afc8182026999e701eb66ea02e1c63b8b25))
* **deps-dev:** Bump eslint from 8.35.0 to 8.36.0 ([#126](https://github.com/flex-development/mkbuild/issues/126)) ([ae0a0ef](https://github.com/flex-development/mkbuild/commit/ae0a0efb8dd227e736d292f7acdcd810fb0cc34f))
* **deps-dev:** Bump eslint from 8.36.0 to 8.37.0 ([#173](https://github.com/flex-development/mkbuild/issues/173)) ([abe652d](https://github.com/flex-development/mkbuild/commit/abe652d3d0755a7646419362c1b7bc975a54fa6c))
* **deps-dev:** Bump eslint-config-prettier from 8.6.0 to 8.7.0 ([#111](https://github.com/flex-development/mkbuild/issues/111)) ([9e15ccc](https://github.com/flex-development/mkbuild/commit/9e15ccc7f03c6bdabb70f745e0201a8c4cfe6296))
* **deps-dev:** Bump eslint-config-prettier from 8.7.0 to 8.8.0 ([#155](https://github.com/flex-development/mkbuild/issues/155)) ([6dbeeed](https://github.com/flex-development/mkbuild/commit/6dbeeedc7c8449a4fe8f28f2eef55a54577100b9))
* **deps-dev:** Bump eslint-plugin-jsdoc from 40.0.1 to 40.0.2 ([#128](https://github.com/flex-development/mkbuild/issues/128)) ([5236bac](https://github.com/flex-development/mkbuild/commit/5236bac1c0287e8125d07ec2e5861a96964a8ba1))
* **deps-dev:** Bump eslint-plugin-jsdoc from 40.0.2 to 40.1.0 ([#172](https://github.com/flex-development/mkbuild/issues/172)) ([8c22b4f](https://github.com/flex-development/mkbuild/commit/8c22b4faf2d6b91d626a83dde8590aaa0fe504a0))
* **deps-dev:** Bump eslint-plugin-jsdoc from 40.1.0 to 40.1.1 ([#178](https://github.com/flex-development/mkbuild/issues/178)) ([b870673](https://github.com/flex-development/mkbuild/commit/b8706733fd533237a1f9b621fddffa6a610fe0d9))
* **deps-dev:** Bump eslint-plugin-jsonc from 2.6.0 to 2.7.0 ([#151](https://github.com/flex-development/mkbuild/issues/151)) ([7919791](https://github.com/flex-development/mkbuild/commit/7919791dcae510793598183a7af88b15c42451d1))
* **deps-dev:** Bump eslint-plugin-markdownlint from 0.4.0 to 0.4.1 ([#115](https://github.com/flex-development/mkbuild/issues/115)) ([0dc0bd6](https://github.com/flex-development/mkbuild/commit/0dc0bd6d1a0bcdca3d28c4d9422ee30cb1312985))
* **deps-dev:** Bump eslint-plugin-unicorn from 45.0.2 to 46.0.0 ([#104](https://github.com/flex-development/mkbuild/issues/104)) ([037ae73](https://github.com/flex-development/mkbuild/commit/037ae73449790d1fc66ee8d9bc18a4a866bfb02f))
* **deps-dev:** Bump graphql-config from 4.4.1 to 4.5.0 ([#110](https://github.com/flex-development/mkbuild/issues/110)) ([a621234](https://github.com/flex-development/mkbuild/commit/a621234af0d9b0c67755d580d9fb6bcba52fa60c))
* **deps-dev:** Bump jsonc-eslint-parser from 2.1.0 to 2.2.0 ([#120](https://github.com/flex-development/mkbuild/issues/120)) ([168cce6](https://github.com/flex-development/mkbuild/commit/168cce6ae180a9f109b928a361387877b4f7df80))
* **deps-dev:** Bump lint-staged from 13.1.2 to 13.2.0 ([#125](https://github.com/flex-development/mkbuild/issues/125)) ([842ab95](https://github.com/flex-development/mkbuild/commit/842ab95b6cf7c6eaa143aa773eedb097718e445f))
* **deps-dev:** Bump memfs from 3.4.13 to 3.5.0 ([#192](https://github.com/flex-development/mkbuild/issues/192)) ([54e17b8](https://github.com/flex-development/mkbuild/commit/54e17b86719f26c99b422a41759c5ed690c1fdc1))
* **deps-dev:** Bump prettier from 2.8.4 to 2.8.6 ([#147](https://github.com/flex-development/mkbuild/issues/147)) ([c80339e](https://github.com/flex-development/mkbuild/commit/c80339ea90c7eecaa017fdd878809a810e4e84fd))
* **deps-dev:** Bump prettier from 2.8.6 to 2.8.7 ([#164](https://github.com/flex-development/mkbuild/issues/164)) ([cfe6550](https://github.com/flex-development/mkbuild/commit/cfe65503af0bc78f8b554532247c6ea3a0667ebe))
* **deps-dev:** Bump pretty-format from 29.4.3 to 29.5.0 ([#114](https://github.com/flex-development/mkbuild/issues/114)) ([8ac60d9](https://github.com/flex-development/mkbuild/commit/8ac60d9bf98ff344944ba579f41487f7cb18601c))
* **deps-dev:** Bump rxjs from 8.0.0-alpha.7 to 8.0.0-alpha.8 ([#187](https://github.com/flex-development/mkbuild/issues/187)) ([8a6deea](https://github.com/flex-development/mkbuild/commit/8a6deeab3a3315d4f65ba6a12d3bc289ac673e1f))
* **deps-dev:** bump typescript from 5.1.0-dev.20230301 to 5.0.3 ([bb640bf](https://github.com/flex-development/mkbuild/commit/bb640bf18196b4fcf3765c92e24f2556b7475d07))
* **deps-dev:** Bump vite from 4.1.4 to 4.2.1 ([#154](https://github.com/flex-development/mkbuild/issues/154)) ([571bc8a](https://github.com/flex-development/mkbuild/commit/571bc8a777a94e9c453322cba53ca5b3d5018c19))
* **deps-dev:** Bump vite-tsconfig-paths from 4.0.5 to 4.0.7 ([#132](https://github.com/flex-development/mkbuild/issues/132)) ([fdeca0c](https://github.com/flex-development/mkbuild/commit/fdeca0ccac60749c7b7b371596896f44d793483a))
* **deps-dev:** Bump vite-tsconfig-paths from 4.0.7 to 4.0.8 ([#186](https://github.com/flex-development/mkbuild/issues/186)) ([e8cc68c](https://github.com/flex-development/mkbuild/commit/e8cc68c3e24a7ab7133ede0235549ef6415f058d))
* **deps-dev:** Bump vitest from 0.29.2 to 0.29.7 ([#143](https://github.com/flex-development/mkbuild/issues/143)) ([bbb7c4b](https://github.com/flex-development/mkbuild/commit/bbb7c4b5ecd83dc568a454c70f483d4b1e5e1d6a))
* **deps-dev:** Bump yaml-eslint-parser from 1.1.0 to 1.2.0 ([#119](https://github.com/flex-development/mkbuild/issues/119)) ([7e632c0](https://github.com/flex-development/mkbuild/commit/7e632c0dca00824e51fa7f6ee7fa06fe0abf34ed))
* **deps-peer:** bump esbuild from >=0.17.14 to >=0.17.15 ([a3a0d54](https://github.com/flex-development/mkbuild/commit/a3a0d549a9930f8a4c650278983add144448ca82))
* **deps:** Bump cosmiconfig from 8.1.0 to 8.1.3 ([#177](https://github.com/flex-development/mkbuild/issues/177)) ([d248a7a](https://github.com/flex-development/mkbuild/commit/d248a7acc823092cfe14c8bb6d7df39a35e3ab1b))
* **deps:** Bump radash from 10.7.0 to 10.7.1 ([#113](https://github.com/flex-development/mkbuild/issues/113)) ([306b178](https://github.com/flex-development/mkbuild/commit/306b178410a2ab498ae155b9185a9aacf9665820))
* **deps:** Bump radash from 10.7.1 to 10.8.1 ([#176](https://github.com/flex-development/mkbuild/issues/176)) ([42b88f5](https://github.com/flex-development/mkbuild/commit/42b88f546ae2c92560b96bb70d59f433f7623905))


### :robot: Continuous Integration

* **deps:** Bump actions/add-to-project from 0.4.1 to 0.5.0 ([#182](https://github.com/flex-development/mkbuild/issues/182)) ([20feff0](https://github.com/flex-development/mkbuild/commit/20feff0ca49e3a89f91e2ccab56f4e3008a95c78))
* **deps:** Bump actions/cache from 3.2.6 to 3.3.1 ([#122](https://github.com/flex-development/mkbuild/issues/122)) ([4426201](https://github.com/flex-development/mkbuild/commit/4426201200c76b98ff88ad7282469084c708fe54))
* **deps:** Bump actions/checkout from 3.3.0 to 3.4.0 ([#134](https://github.com/flex-development/mkbuild/issues/134)) ([0d14fcd](https://github.com/flex-development/mkbuild/commit/0d14fcddcb266260b77f1cc7f5373fd91cae94be))
* **deps:** Bump actions/checkout from 3.4.0 to 3.5.0 ([#156](https://github.com/flex-development/mkbuild/issues/156)) ([36dfdd1](https://github.com/flex-development/mkbuild/commit/36dfdd186b38a7c71c5905bdcd0aab811e045d99))
* **deps:** Bump actions/github-script from 6.4.0 to 6.4.1 ([#191](https://github.com/flex-development/mkbuild/issues/191)) ([9aacaf4](https://github.com/flex-development/mkbuild/commit/9aacaf423342663adb81acfa9ae675468f8dae84))
* **workflows:** [`auto-merge`] use `secrets.PAT_REPO` ([cf6a0bf](https://github.com/flex-development/mkbuild/commit/cf6a0bf4d60af0a42ec57356eef112475d060ff6))
* **workflows:** [`ci`] add `jobs.build.steps.pkg-size-report` ([b193660](https://github.com/flex-development/mkbuild/commit/b1936604b2ed7b4bc813cf1e91167d81259e65ef))
* **workflows:** add `cache-cleanup` ([ac7e325](https://github.com/flex-development/mkbuild/commit/ac7e3254b50548cc1c41844e6f7c152911055d9f))
* **workflows:** add `infrastructure` ([55d0661](https://github.com/flex-development/mkbuild/commit/55d06614523a2f553f3dd4b7b3d1e021a3a5f7af))
* **workflows:** improve docs, formatting, and security ([ae66b37](https://github.com/flex-development/mkbuild/commit/ae66b37fbc25a921f379ac556d39c7e86e099544))


### :sparkles: Features

* watch mode ([f1decde](https://github.com/flex-development/mkbuild/commit/f1decde8597173569c69f8df8b013559231ff18b))
* **cli:** [options] allow object and regex types ([23cbf6b](https://github.com/flex-development/mkbuild/commit/23cbf6bbacbcbfa8209a8cebed5c4f7a61c301b6))
* **internal:** `gitignore` ([e4c83c0](https://github.com/flex-development/mkbuild/commit/e4c83c03702ee9c75d65fc02e6599fd33d53bc3f))


### :house_with_garden: Housekeeping

* sync config files ([8061fee](https://github.com/flex-development/mkbuild/commit/8061fee226c6791f46e4f0e2bedb5259abfb5445))
* **tests:** [plugins] format option suite names ([bd03054](https://github.com/flex-development/mkbuild/commit/bd03054c008d20c14820f06f134b28144ba08927))


### :fire: Performance Improvements

* **tests:** [`make`] improve test speeds ([e69e826](https://github.com/flex-development/mkbuild/commit/e69e826dfb6739adaa628a1abccf842c6c0f73ab))


### :mechanical_arm: Refactors

* cache cleaned output directories ([52bf5d8](https://github.com/flex-development/mkbuild/commit/52bf5d8a3180400e3b65f0413e38d2f59bf25818))
* **cli:** `--help` + `--version` flag logic ([7201b91](https://github.com/flex-development/mkbuild/commit/7201b9175aba75f516ab3bfb2f5b50bda0666a75))
* **cli:** combine short options as booleans ([e8f4718](https://github.com/flex-development/mkbuild/commit/e8f4718870ffe3fdfa085cfc52dd6ed21ada63b7))
* **cli:** reimplement with `nest-commander` ([9bc1543](https://github.com/flex-development/mkbuild/commit/9bc154356970c5da1a14b60a0917b33139dff68c))
* **utils:** [`analyzeOutputs`] intake `esbuild.Metafile['outputs']` ([f467b4b](https://github.com/flex-development/mkbuild/commit/f467b4bae340a83d126c8dc80b75af0a912d7ff7))

## [1.0.0-alpha.16](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.15...1.0.0-alpha.16) (2023-03-03)


### :package: Build

* **deps:** Bump @flex-development/mlly from 1.0.0-alpha.14 to 1.0.0-alpha.15 ([#101](https://github.com/flex-development/mkbuild/issues/101)) ([38d5a59](https://github.com/flex-development/mkbuild/commit/38d5a5982c70c4f896c6a0df661388e51ec3628f))


### :robot: Continuous Integration

* **workflows:** add `auto-merge` ([f8d3c62](https://github.com/flex-development/mkbuild/commit/f8d3c6240fd31d5ae89a949bf2e2ebec39956612))

## [1.0.0-alpha.15](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.14...1.0.0-alpha.15) (2023-03-03)


### :package: Build

* **deps-dev:** Bump @graphql-eslint/eslint-plugin from 3.16.0 to 3.16.1 ([#99](https://github.com/flex-development/mkbuild/issues/99)) ([669c2b7](https://github.com/flex-development/mkbuild/commit/669c2b7c2639344ae491cc4e732be6c0639d26c5))
* **deps-dev:** Bump @typescript-eslint/eslint-plugin from 5.53.0 to 5.54.0 ([#95](https://github.com/flex-development/mkbuild/issues/95)) ([c59b7de](https://github.com/flex-development/mkbuild/commit/c59b7de11279af1b126c5f5243fd458d10766f67))
* **deps-dev:** Bump @typescript-eslint/parser from 5.53.0 to 5.54.0 ([#94](https://github.com/flex-development/mkbuild/issues/94)) ([eba1278](https://github.com/flex-development/mkbuild/commit/eba12787e5c19acb96496f4570c5f924c1bc43f1))
* **deps-dev:** Bump @vitest/ui from 0.28.5 to 0.29.1 ([#90](https://github.com/flex-development/mkbuild/issues/90)) ([a92483f](https://github.com/flex-development/mkbuild/commit/a92483f1e24d7e9908737884c190e4fdd0b96ac8))
* **deps-dev:** Bump cspell from 6.26.3 to 6.27.0 ([#88](https://github.com/flex-development/mkbuild/issues/88)) ([8cea99d](https://github.com/flex-development/mkbuild/commit/8cea99da81febc1cc2b759694438e81761d6fcdc))
* **deps:** bump @flex-development/mlly from 1.0.0-alpha.13 to 1.0.0-alpha.14 ([e839b54](https://github.com/flex-development/mkbuild/commit/e839b54c3169ebf9a1b812848d3d2791d9a62016))
* **deps:** Bump cosmiconfig from 8.0.0 to 8.1.0 ([#87](https://github.com/flex-development/mkbuild/issues/87)) ([409461a](https://github.com/flex-development/mkbuild/commit/409461a10ffd3b35925fb1120f407c820f4a1ad2))


### :robot: Continuous Integration

* **deps:** Bump actions/add-to-project from 0.4.0 to 0.4.1 ([#93](https://github.com/flex-development/mkbuild/issues/93)) ([c7d963d](https://github.com/flex-development/mkbuild/commit/c7d963dc81a21e5078423450d58966c61590e440))
* **workflows:** [`ci`] add `commitlint` job ([a31805b](https://github.com/flex-development/mkbuild/commit/a31805bbeed419125513f52901aecc9453aa1fa2))
* **workflows:** [`ci`] make jobs dependant on `gitguardian` ([d139c70](https://github.com/flex-development/mkbuild/commit/d139c7025ca6002b2bae995f25b7f1505823c091))


### :house_with_garden: Housekeeping

* sync config files ([aa46fa3](https://github.com/flex-development/mkbuild/commit/aa46fa3c220d3fe6a98b140d5cd87ed186767d16))

## [1.0.0-alpha.14](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.13...1.0.0-alpha.14) (2023-02-24)


### :package: Build

* externalize `node-fetch` ([ad6d562](https://github.com/flex-development/mkbuild/commit/ad6d562eca65b1674cba1f86f77279a6780c276a))
* **deps-dev:** Bump @commitlint/cli from 17.4.2 to 17.4.4 ([#67](https://github.com/flex-development/mkbuild/issues/67)) ([3fff4e0](https://github.com/flex-development/mkbuild/commit/3fff4e0c1f3f7165de6f1fde3ff22a9f47592d65))
* **deps-dev:** Bump @commitlint/config-conventional from 17.4.2 to 17.4.4 ([#66](https://github.com/flex-development/mkbuild/issues/66)) ([608d8c4](https://github.com/flex-development/mkbuild/commit/608d8c49d21cbc1bf701b2806ce69f2b48a9539b))
* **deps-dev:** Bump @types/eslint from 8.21.0 to 8.21.1 ([#58](https://github.com/flex-development/mkbuild/issues/58)) ([0652191](https://github.com/flex-development/mkbuild/commit/0652191f1af2469b7783aaf44ebdbf4bf278e35b))
* **deps-dev:** Bump @types/node from 18.13.0 to 18.14.0 ([#69](https://github.com/flex-development/mkbuild/issues/69)) ([e668044](https://github.com/flex-development/mkbuild/commit/e668044a21ddb8bd353315c6a52c99db7c39c6e0))
* **deps-dev:** Bump @typescript-eslint/eslint-plugin from 5.52.0 to 5.53.0 ([#75](https://github.com/flex-development/mkbuild/issues/75)) ([9b587e6](https://github.com/flex-development/mkbuild/commit/9b587e62425617a7390632dfff4b1dbb814dadc7))
* **deps-dev:** Bump @typescript-eslint/parser from 5.51.0 to 5.52.0 ([#60](https://github.com/flex-development/mkbuild/issues/60)) ([f6b89c5](https://github.com/flex-development/mkbuild/commit/f6b89c5b3ddfe253669e70933af034d9358594e9))
* **deps-dev:** Bump @typescript-eslint/parser from 5.52.0 to 5.53.0 ([#77](https://github.com/flex-development/mkbuild/issues/77)) ([e12b278](https://github.com/flex-development/mkbuild/commit/e12b2789aef18e2d52a286016fcfb57638c76f2f))
* **deps-dev:** Bump cspell from 6.24.0 to 6.26.3 ([#64](https://github.com/flex-development/mkbuild/issues/64)) ([833edb8](https://github.com/flex-development/mkbuild/commit/833edb8103d012e6535d9881c10dccffe7b435ce))
* **deps-dev:** Bump esbuild from 0.17.8 to 0.17.9 ([#71](https://github.com/flex-development/mkbuild/issues/71)) ([f44dc3e](https://github.com/flex-development/mkbuild/commit/f44dc3e95db56ebf19abb8f05dab33edbfade380))
* **deps-dev:** Bump esbuild from 0.17.9 to 0.17.10 ([#74](https://github.com/flex-development/mkbuild/issues/74)) ([195e606](https://github.com/flex-development/mkbuild/commit/195e6060490495834c7069f3151d2591ed4584c8))
* **deps-dev:** Bump pretty-format from 29.4.2 to 29.4.3 ([#68](https://github.com/flex-development/mkbuild/issues/68)) ([4dcee03](https://github.com/flex-development/mkbuild/commit/4dcee03861b7385ee9768cddbd3b8bab0ae265b9))
* **deps-dev:** Bump typescript from 5.0.0-dev.20230213 to 5.0.0-dev.20230221 ([#78](https://github.com/flex-development/mkbuild/issues/78)) ([d748ff1](https://github.com/flex-development/mkbuild/commit/d748ff174b1d3bff44b22898483c84663a6787c2))
* **deps-dev:** Bump typescript from 5.0.0-dev.20230221 to 5.0.0-dev.20230222 ([#82](https://github.com/flex-development/mkbuild/issues/82)) ([185924c](https://github.com/flex-development/mkbuild/commit/185924c317113f9a32175b5f0c4560f053455a02))
* **deps-dev:** bump typescript from 5.0.0-dev.20230222 to 5.0.0-dev.20230224 ([fc2d542](https://github.com/flex-development/mkbuild/commit/fc2d542a36c7c1c79fac082cca8a727628e54d66))
* **deps-dev:** Bump vite from 4.1.1 to 4.1.2 ([#70](https://github.com/flex-development/mkbuild/issues/70)) ([3ef6a90](https://github.com/flex-development/mkbuild/commit/3ef6a90bf0bcd30013389a427b312815a59f4fbd))
* **deps-dev:** Bump vite from 4.1.2 to 4.1.3 ([#76](https://github.com/flex-development/mkbuild/issues/76)) ([47606af](https://github.com/flex-development/mkbuild/commit/47606afacc1d21a367024111bfa9c6998aafa928))
* **deps-dev:** Bump vite from 4.1.3 to 4.1.4 ([#80](https://github.com/flex-development/mkbuild/issues/80)) ([6fd8b81](https://github.com/flex-development/mkbuild/commit/6fd8b815af9b898608612722ae9c78181f12f38e))
* **deps-peer:** bump esbuild from >=0.17.8 to >=0.17.9 ([cd43825](https://github.com/flex-development/mkbuild/commit/cd438258117cab1d47100fe077d35cf27ad5a538))
* **deps:** bump @flex-development/mlly from 1.0.0-alpha.11 to 1.0.0-alpha.13 ([9a5018a](https://github.com/flex-development/mkbuild/commit/9a5018a07626b07b53598ae53e1d255dd65a8c3c))
* **deps:** Bump @flex-development/tsconfig-utils from 1.1.1 to 1.1.2 ([#83](https://github.com/flex-development/mkbuild/issues/83)) ([1c9daeb](https://github.com/flex-development/mkbuild/commit/1c9daeb47b72e29ecc458e34dd75bb5ab2d300cd))
* **yarn:** bump yarn from 4.0.0-rc.34 to 4.0.0-rc.39 ([5c68260](https://github.com/flex-development/mkbuild/commit/5c68260cc2196ccdede622032911ba78a0ce92c2))


### :robot: Continuous Integration

* [[@dependabot](https://github.com/dependabot)] fix private registry updates ([69618f1](https://github.com/flex-development/mkbuild/commit/69618f140558c99c29e144d86d4beacca7b8055a))
* **deps:** Bump actions/cache from 3.2.5 to 3.2.6 ([#79](https://github.com/flex-development/mkbuild/issues/79)) ([5bd78f0](https://github.com/flex-development/mkbuild/commit/5bd78f078f88bd8ce1828cc87993d99c349f5924))
* **workflows:** [`ci`] use `github.event.pull_request.head.sha` for codecov ([e7cf854](https://github.com/flex-development/mkbuild/commit/e7cf854d049b70ff7c0f55e740837e5008aa99ef))


### :sparkles: Features

* toggle package `type` ([755b9a7](https://github.com/flex-development/mkbuild/commit/755b9a7de67c58416d9b80beef17439df7e28c43))


### :house_with_garden: Housekeeping

* update config files ([461e99d](https://github.com/flex-development/mkbuild/commit/461e99d1497c70c1bb9245ed284bbe55c17644f8))
* **github:** merge `pre-push` workflow into `commit-msg` workflow ([a5ec9a0](https://github.com/flex-development/mkbuild/commit/a5ec9a0261f6ca6bd670e9a5dfad40febb999632))


### :zap: Refactors

* **loader:** prepare for use in tests across node versions ([0148197](https://github.com/flex-development/mkbuild/commit/0148197ea6777bcc26f7ee6434c5de3cd3e08c93))


### :white_check_mark: Testing

* improve tests to catch erroneous build logic ([d85ecb2](https://github.com/flex-development/mkbuild/commit/d85ecb239cb29e08f7344197bff7a4e9f5e6ca70))

## [1.0.0-alpha.13](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.12...1.0.0-alpha.13) (2023-02-17)


### :bug: Fixes

* **options:** default `source` ([8730e90](https://github.com/flex-development/mkbuild/commit/8730e90fab707e5e064184a378a24f1096778ec3))

## [1.0.0-alpha.12](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.11...1.0.0-alpha.12) (2023-02-16)


### ⚠ BREAKING CHANGES

* **exports:** remove `./plugins/*`

### :package: Build

* preserve symbol names in bundle output ([bca9aa1](https://github.com/flex-development/mkbuild/commit/bca9aa1f6bb3cc02a7be7b59831d45e983a5b32b))
* **deps-dev:** Bump @graphql-eslint/eslint-plugin from 3.15.0 to 3.16.0 ([#47](https://github.com/flex-development/mkbuild/issues/47)) ([9a4fc0a](https://github.com/flex-development/mkbuild/commit/9a4fc0a86edd6d58e3152f3e0b8b8b14acd00eec))
* **deps-dev:** Bump @typescript-eslint/eslint-plugin from 5.51.0 to 5.52.0 ([#56](https://github.com/flex-development/mkbuild/issues/56)) ([c09abaa](https://github.com/flex-development/mkbuild/commit/c09abaa2f1ffdc89efbe81166a86073c765188a4))
* **deps-dev:** bump @vitest/coverage-c8 from 0.28.4 to 0.28.5 ([2e02663](https://github.com/flex-development/mkbuild/commit/2e02663497894e414da2dcc50f8a381047c2ceda))
* **deps-dev:** bump @vitest/spy from 0.28.4 to 0.28.5 ([cbf297d](https://github.com/flex-development/mkbuild/commit/cbf297d6075621d6e478bc774f027db0e0c2c4df))
* **deps-dev:** bump @vitest/ui from 0.28.4 to 0.28.5 ([b0b075a](https://github.com/flex-development/mkbuild/commit/b0b075aa3430881d74e6a8421a7ff076dd6daf6b))
* **deps-dev:** Bump cspell from 6.23.0 to 6.24.0 ([#52](https://github.com/flex-development/mkbuild/issues/52)) ([b2e404f](https://github.com/flex-development/mkbuild/commit/b2e404f8817db7b86399dc470766c4721f8622bb))
* **deps-dev:** Bump esbuild from 0.17.7 to 0.17.8 ([#50](https://github.com/flex-development/mkbuild/issues/50)) ([d2445d4](https://github.com/flex-development/mkbuild/commit/d2445d4bbea506b5ed1231fb74319da60c9f3129))
* **deps-dev:** Bump lint-staged from 13.1.1 to 13.1.2 ([#53](https://github.com/flex-development/mkbuild/issues/53)) ([85eb9b3](https://github.com/flex-development/mkbuild/commit/85eb9b309be26045013ba881dc2aa5fd7f4d2dd6))
* **deps-dev:** Bump tempfile from 4.0.0 to 5.0.0 ([#48](https://github.com/flex-development/mkbuild/issues/48)) ([b9212bc](https://github.com/flex-development/mkbuild/commit/b9212bc1f6b974072eb9699387dc07b07fd518ad))
* **deps-dev:** Bump typescript from 5.0.0-dev.20230211 to 5.0.0-dev.20230213 ([#51](https://github.com/flex-development/mkbuild/issues/51)) ([fe222ec](https://github.com/flex-development/mkbuild/commit/fe222ec37695244ce0068c18cc0c89ba9cd3272e))
* **deps-dev:** bump vitest from 0.28.4 to 0.28.5 ([a3fa3fa](https://github.com/flex-development/mkbuild/commit/a3fa3fa3ee6ae352d95bbbd72c86af28bedf9f02))
* **deps-peer:** bump esbuild from >=0.17.7 to >=0.17.8 ([a1eee55](https://github.com/flex-development/mkbuild/commit/a1eee552ed865456e6acafffee82016314174452))
* **exports:** remove `./plugins/*` ([9119481](https://github.com/flex-development/mkbuild/commit/911948167e525ff8e8dfb9ab01178615e6e5982c))


### :robot: Continuous Integration

* **deps:** Bump actions/cache from 3.2.4 to 3.2.5 ([#45](https://github.com/flex-development/mkbuild/issues/45)) ([cc0732c](https://github.com/flex-development/mkbuild/commit/cc0732cff30519cb26dd1f5fddfa6b6be88c76f5))
* **workflows:** [`dependabot-auto`] remove `enable-auto-merge` job conditional ([4323177](https://github.com/flex-development/mkbuild/commit/432317730d3ad89dc65260703dc35b2609af1260))


### :sparkles: Features

* **plugins:** `decorators` ([c9d1e56](https://github.com/flex-development/mkbuild/commit/c9d1e56b1ea53432e3c35cacefeddac430cb413a))


### :bug: Fixes

* **options:** bundle defaults ([51c88a9](https://github.com/flex-development/mkbuild/commit/51c88a9ef1c5f03b7bc1bae6b2b06223d9194214))


### :zap: Refactors

* **cli:** improve error logs ([c405798](https://github.com/flex-development/mkbuild/commit/c405798a6f0a001459fede43f7898fd55a9392d0))
* **cli:** set exit code on error ([4587a9d](https://github.com/flex-development/mkbuild/commit/4587a9dc9441716a36197bb753702a5b3dd6f541))

## [1.0.0-alpha.11](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.10...1.0.0-alpha.11) (2023-02-12)


### :bug: Fixes

* dts-only write ([fcd4c51](https://github.com/flex-development/mkbuild/commit/fcd4c519e3c1935483c9672806a51e704906464d))

## [1.0.0-alpha.10](https://github.com/flex-development/mkbuild/compare/1.0.0-alpha.9...1.0.0-alpha.10) (2023-02-12)


### :package: Build

* **deps-peer:** bump esbuild from >=0.15.0 to >=0.17.7 ([75c620a](https://github.com/flex-development/mkbuild/commit/75c620a5fc1afe27f1a4de7c41f4347f06cea39f))
* **deps:** Bump cosmiconfig from 7.0.1 to 8.0.0 ([#42](https://github.com/flex-development/mkbuild/issues/42)) ([ab75b8c](https://github.com/flex-development/mkbuild/commit/ab75b8c4d8d57016e8808c48dbf72b30866551d2))
* **deps:** Bump pretty-bytes from 6.0.0 to 6.1.0 ([#41](https://github.com/flex-development/mkbuild/issues/41)) ([91df1e8](https://github.com/flex-development/mkbuild/commit/91df1e80010c04caca58feec58b5f8020b9edf93))
* **deps:** replace `pkg-types` with `@flex-development/pkg-types` ([29cbd06](https://github.com/flex-development/mkbuild/commit/29cbd06c3c870eeb9761067c5bdbf77ee9ed511a))


### :robot: Continuous Integration

* [[@dependabot](https://github.com/dependabot)] fix npm package-ecosystem x yarn integration ([0586b03](https://github.com/flex-development/mkbuild/commit/0586b034e5f34d9e74e7fcb0db6c25857bfee888))
* **deps:** bump actions/add-to-project from 0.3.0 to 0.4.0 ([#34](https://github.com/flex-development/mkbuild/issues/34)) ([3f99321](https://github.com/flex-development/mkbuild/commit/3f99321f855c1df7b1f0be30b0732626d50d1842))
* **deps:** bump actions/checkout from 3.1.0 to 3.2.0 ([#36](https://github.com/flex-development/mkbuild/issues/36)) ([e007d3b](https://github.com/flex-development/mkbuild/commit/e007d3b406e9e5dc74ab1a0693aa5ea4904b1cb1))
* **deps:** bump actions/checkout from 3.2.0 to 3.3.0 ([#37](https://github.com/flex-development/mkbuild/issues/37)) ([bc6e3b7](https://github.com/flex-development/mkbuild/commit/bc6e3b701d4d08beab0a1e0a59972ce5dd730478))
* **deps:** bump actions/github-script from 6.3.3 to 6.4.0 ([#40](https://github.com/flex-development/mkbuild/issues/40)) ([df77c5a](https://github.com/flex-development/mkbuild/commit/df77c5aca350f4b94923c6aa3ff4784366d2756d))
* **deps:** bump actions/setup-node from 3.5.0 to 3.6.0 ([#38](https://github.com/flex-development/mkbuild/issues/38)) ([0df7e82](https://github.com/flex-development/mkbuild/commit/0df7e821834e9a1ade4ecd4cb7ed19ddb5827bea))
* **deps:** bump dependabot/fetch-metadata from 1.3.5 to 1.3.6 ([#39](https://github.com/flex-development/mkbuild/issues/39)) ([16c9abf](https://github.com/flex-development/mkbuild/commit/16c9abf178265428688f559576932738b8fd42e3))
* **deps:** bump dessant/lock-threads from 3.0.0 to 4.0.0 ([#35](https://github.com/flex-development/mkbuild/issues/35)) ([252f8d3](https://github.com/flex-development/mkbuild/commit/252f8d3060c86d0301651ec85c8d77d6df2a8c12))
* **deps:** bump flex-development/dist-tag-action from 1.1.1 to 1.1.2 ([#33](https://github.com/flex-development/mkbuild/issues/33)) ([442728b](https://github.com/flex-development/mkbuild/commit/442728bc1f90b67f7af4cf60b67cbc8441e73879))
* **deps:** bump octokit/graphql-action from 2.2.22 to 2.2.23 ([#24](https://github.com/flex-development/mkbuild/issues/24)) ([e5cd5ef](https://github.com/flex-development/mkbuild/commit/e5cd5efd1012891bd8fb73cd5f40796feff348ca))
* **workflows:** [`add-to-project`] add items from repo admin account ([1bc490e](https://github.com/flex-development/mkbuild/commit/1bc490e3a5bb8445038e2feb29e85571f78293e1))
* **workflows:** [`add-to-project`] run workflow when pr is synchronized ([51b4a93](https://github.com/flex-development/mkbuild/commit/51b4a935848309ce29b0686e96366e311b1c0e8e))
* **workflows:** [`approve-pr`] refactor approval step conditional ([29c8556](https://github.com/flex-development/mkbuild/commit/29c85569cfe805f9fcec91cc7f51559afe8b9ed6))
* **workflows:** [`ci`] split ci job into multiple jobs ([80c8fde](https://github.com/flex-development/mkbuild/commit/80c8fde580b4d40eb2c5ee2df8797c42374e6de2))
* **workflows:** [`ci`] upload coverage report to codecov ([3bdf063](https://github.com/flex-development/mkbuild/commit/3bdf063bc9ebb18fae169d1b79316404990d1a91))
* **workflows:** [`dependabot-auto`] sign lockfile fix commit ([e0a3c1d](https://github.com/flex-development/mkbuild/commit/e0a3c1da1c508e4644949f07133f70e20e5681a4))
* **workflows:** [`integrity`] update `pull_request` event activity types ([0ddb1e6](https://github.com/flex-development/mkbuild/commit/0ddb1e68c7146a159708ead3b5fa7f88fbd1809c))
* **workflows:** add `typescript-canary` ([4f5a3f1](https://github.com/flex-development/mkbuild/commit/4f5a3f1da82a6f4fd2750cb3122e6e852d612e62))
* **workflows:** use environment files ([048e470](https://github.com/flex-development/mkbuild/commit/048e470ef10a074fc45140fc70b0f9740294555d))


### :pencil: Documentation

* add "contributor covenant code of conduct" ([98f96dd](https://github.com/flex-development/mkbuild/commit/98f96ddd2772a293e4ca11f3890b634647c17e46))


### :sparkles: Features

* **options:** `write?` ([fd5b227](https://github.com/flex-development/mkbuild/commit/fd5b227f8806c16a9e80756ad4d0c36884479ee0))


### :bug: Fixes

* **bundle:** `outbase` support ([b908fd5](https://github.com/flex-development/mkbuild/commit/b908fd501a24b1cef0ffcb53066948d43c3cd0bb))
* **install:** [git] make `postinstall` script work with git install ([56ba06b](https://github.com/flex-development/mkbuild/commit/56ba06bdbcd69c95fb522c615759620fa6e8f11f))


### :house_with_garden: Housekeeping

* update project architecture ([77d6a43](https://github.com/flex-development/mkbuild/commit/77d6a438d5a6a206ccf73f2e57543dfae28c1e17))
* **github:** add "package manager" dropdown to bug report template ([a972b1b](https://github.com/flex-development/mkbuild/commit/a972b1bcbdc8f5e8d39d3372255b79608ce5ce43))
* **github:** add "typescript version" input to bug report template ([997e725](https://github.com/flex-development/mkbuild/commit/997e725658b09880352f56882cc3c0bc743b6c9c))
* **github:** add commit scope `build` ([9302f17](https://github.com/flex-development/mkbuild/commit/9302f17d1b3d2b4fda1d754725354b689281da98))
* **github:** add commit scope `bundle` ([4c541c8](https://github.com/flex-development/mkbuild/commit/4c541c8bd5100f2077a91fd0e1cfa5d961aab53d))
* **github:** add commit scope `install` ([498c709](https://github.com/flex-development/mkbuild/commit/498c709cdca52333b44c1a5fe6e2cb6234843de1))
* **github:** add commit scope `internal` ([0e6bc3c](https://github.com/flex-development/mkbuild/commit/0e6bc3cbfdd2ae24ebe8870675aad335d7873c71))
* **github:** add commit scope `loader` ([f42a4ab](https://github.com/flex-development/mkbuild/commit/f42a4ab20ef6fad11d0c23e9e59d3f17f9c84af6))
* **github:** add commit scope `nvm` ([099fa5b](https://github.com/flex-development/mkbuild/commit/099fa5b4240269b38939ccf4fc56015783673551))
* **github:** add commit scope `spelling` ([ca38cee](https://github.com/flex-development/mkbuild/commit/ca38cee137c7d04dbb011ee86fd906c304c4d605))
* **github:** add commit scope `transpile` ([bdb4999](https://github.com/flex-development/mkbuild/commit/bdb4999462ef129337170366719284020a9f9e78))
* **github:** add label `scope:install` ([5137ad7](https://github.com/flex-development/mkbuild/commit/5137ad79461b112fc8c1e2b9929d5d850b4cf0ad))
* **github:** add label `status:triaged ([077cbce](https://github.com/flex-development/mkbuild/commit/077cbceaea79ef0adce608339aff9e900d73b5f5))
* **github:** configure sponsor button ([7943874](https://github.com/flex-development/mkbuild/commit/7943874f68ba7c21c7e6329999a5a98413d1c669))
* **github:** remove "tests" section from pull request template ([bc53f6b](https://github.com/flex-development/mkbuild/commit/bc53f6bd6a0510f1ad4d5fc9e63217dec5710126))
* **tests:** codecov integration ([79fff1e](https://github.com/flex-development/mkbuild/commit/79fff1eba58717c78c867b992bf2e12632faf471))


### :zap: Refactors

* dependencies + project architecture ([da965b7](https://github.com/flex-development/mkbuild/commit/da965b7f6b888aeb1ca5530639d65db3b69e71a7))


### :white_check_mark: Testing

* **ts:** add type tests ([c34bb91](https://github.com/flex-development/mkbuild/commit/c34bb91e642cfd0aea594724d5c009655b09a3d2))

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
