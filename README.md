# unplugin SVG Transformer

<!-- ![Banner with printer shop picture in background and Typescriptable Laravel title](docs/banner.jpg) -->

[![unplugin][unplugin-version-src]][unplugin-version-href]
[![version][version-src]][version-href]
[![downloads][downloads-src]][downloads-href]
[![license][license-src]][license-href]
[![tests][tests-src]][tests-href]
[![codecov][codecov-src]][codecov-href]

EXPERIMENTAL. Import easily your SVG with Vite.

## Features

// TODO

### Roadmap

// TODO

## Install

```bash
npm i unplugin-svg-transformer
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import SvgTransformer from "unplugin-svg-transformer/vite";

export default defineConfig({
  plugins: [
    SvgTransformer({
      /* options */
    }),
  ],
});
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import SvgTransformer from "unplugin-svg-transformer/rollup";

export default {
  plugins: [
    SvgTransformer({
      /* options */
    }),
  ],
};
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require("unplugin-svg-transformer/webpack")({
      /* options */
    }),
  ],
};
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    [
      "unplugin-svg-transformer/nuxt",
      {
        /* options */
      },
    ],
  ],
};
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require("unplugin-svg-transformer/webpack")({
        /* options */
      }),
    ],
  },
};
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from "esbuild";
import SvgTransformer from "unplugin-svg-transformer/esbuild";

build({
  plugins: [SvgTransformer()],
});
```

<br></details>

## Usage

// TODO

## Testing

```bash
pnpm test
```

### Local

In `package.json`:

```json
{
  "devDependencies": {
    "unplugin-svg-transformer": "file:~/unplugin-svg-transformer.tgz"
  }
}
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Credits

- [Ewilan Riviere](https://github.com/ewilan-riviere)
- [antfu/unplugin-svg-transformer](https://github.com/antfu/unplugin-svg-transformer)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

[<img src="https://user-images.githubusercontent.com/48261459/201463225-0a5a084e-df15-4b11-b1d2-40fafd3555cf.svg" height="120rem" width="100%" />](https://github.com/kiwilan)

https://img.shields.io/npm/v/unplugin?style=flat&colorA=18181B&colorB=F0DB4F

[unplugin-version-src]: https://img.shields.io/static/v1?style=flat-square&label=unplugin&message=v1.3&color=F0DB4F&labelColor=18181B
[unplugin-version-href]: https://github.com/unjs/unplugin
[version-src]: https://img.shields.io/npm/v/@kiwilan/unplugin-svg-transformer.svg?style=flat-square&color=F0DB4F&labelColor=18181b
[version-href]: https://www.npmjs.com/package/@kiwilan/unplugin-svg-transformer
[downloads-src]: https://img.shields.io/npm/dm/unplugin-svg-transformer?style=flat-square&colorA=18181B&colorB=F0DB4F
[downloads-href]: https://npmjs.com/package/unplugin-svg-transformer
[license-src]: https://img.shields.io/github/license/kiwilan/unplugin-svg-transformer.svg?style=flat-square&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/kiwilan/unplugin-svg-transformer/blob/main/README.md
[tests-src]: https://img.shields.io/github/actions/workflow/status/kiwilan/unplugin-svg-transformer/ci.yml?branch=main&label=tests&style=flat-square&colorA=18181B
[tests-href]: https://github.com/kiwilan/unplugin-svg-transformer/actions/workflows/ci.yml
[codecov-src]: https://codecov.io/gh/kiwilan/unplugin-svg-transformer/branch/main/graph/badge.svg?token=epJribIFGR
[codecov-href]: https://codecov.io/gh/kiwilan/unplugin-svg-transformer
