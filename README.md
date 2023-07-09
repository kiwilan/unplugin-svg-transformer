# unplugin-svg-transformer

<!-- ![Banner with printer shop picture in background and Typescriptable Laravel title](docs/banner.jpg) -->

[![unplugin][unplugin-version-src]][unplugin-version-href]
[![version][version-src]][version-href]
[![downloads][downloads-src]][downloads-href]
[![license][license-src]][license-href]
[![tests][tests-src]][tests-href]
[![codecov][codecov-src]][codecov-href]

> **Warning**
>
> EXPERIMENTAL: This project is still in early development, and may face breaking changes in the future.

Import easily your SVG. Powered by [unplugin](https://github.com/unjs/unplugin).

Use SVG with frontend framework like Vue, React, Svelte is not easy, especially when you want to use SVG as component. This plugin will help you to import SVG as component. But you can also just use this plugin as a SVG loader, and create your own component.

> Designed to be a replacement of [`kiwilan/nuxt-svg-transformer`](https://github.com/kiwilan/nuxt-svg-transformer), a Nuxt module.

## Features

- 🟨 [unplugin](https://github.com/unjs/unplugin): [Vite](https://vitejs.dev/), [Rollup](https://rollupjs.org/guide/en/), [Webpack](https://webpack.js.org/), [esbuild](https://esbuild.github.io/) support
- 🔥 Hot reloading when SVG updated
- 🤙🏻 Reactivity option
- 🗃️ Index to list all SVG to import them easily
- 🗂 Seperated cache SVG files
- 🚚 Can be import into any JS / TS file to be use as a SVG loader
- 📦 Components ready, no import needed, SVG directly injected
  - [Vue 3](https://v3.vuejs.org/) / [Nuxt 3](https://nuxt.com) component
  - [React](https://react.dev/) component
- 🎨 Options to add or clear `style` and `class` global attributes
- 🦾 SVG typed, validate by `name` prop (`typescript` required)

### Roadmap

- [ ] fix delete svg bug
- [ ] Nuxt 2 module
- [ ] unplugin tests

## Install

```bash
npm i unplugin-svg-transformer -D
# or
pnpm install unplugin-svg-transformer -D
# or
yarn add unplugin-svg-transformer -D
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
// nuxt.config.ts
export default defineNuxtConfig({
  buildModules: [
    "unplugin-svg-transformer/nuxt", // https://github.com/kiwilan/unplugin-svg-transformer
  ],
  // Default options
  svgTransformer: {
    iconsDir: "./assets/icons",
    libraryDir: "./src",
    gitignorePath: "./.gitignore",
    typescript: true,
    windowInject: true,
  },
});
```

> This module works for Nuxt 3

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

### Vue 3 / Inertia

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import SvgIcon from "./components/SvgIcon.vue";
import SvgTransformer from "unplugin-svg-transformer/vite";

createApp(App)
  .use(svgTransformer, IconList)
  .component("svg-icon", SvgIcon)
  .mount("#app");
```

#### Inertia

Example here with Laravel Jetstream.

````ts
// app.ts
import type { DefineComponent } from 'vue'
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { SvgTransformer } from 'unplugin-svg-transformer/vue'
import { IconList } from 'unplugin-svg-transformer/icons'

createInertiaApp({
  title: title => `${title} - P1PDD`,
  resolve: name => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')) as Promise<DefineComponent>,
  setup({ el, App, props, plugin }) {
    const pinia = createPinia()
    const app = createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(SvgTransformer, IconList)

    app.mount(el)
  },
})

```vue
<template>
  <div>
    <svg-icon name="logo" />
  </div>
</template>
````

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

[unplugin-version-src]: https://img.shields.io/static/v1?style=flat-square&label=unplugin&message=v1.3&color=F0DB4F&labelColor=18181B
[unplugin-version-href]: https://github.com/unjs/unplugin
[version-src]: https://img.shields.io/npm/v/unplugin-svg-transformer.svg?style=flat-square&color=F0DB4F&labelColor=18181b
[version-href]: https://www.npmjs.com/package/unplugin-svg-transformer
[downloads-src]: https://img.shields.io/npm/dm/unplugin-svg-transformer?style=flat-square&colorA=18181B&colorB=F0DB4F
[downloads-href]: https://npmjs.com/package/unplugin-svg-transformer
[license-src]: https://img.shields.io/github/license/kiwilan/unplugin-svg-transformer.svg?style=flat-square&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/kiwilan/unplugin-svg-transformer/blob/main/README.md
[tests-src]: https://img.shields.io/github/actions/workflow/status/kiwilan/unplugin-svg-transformer/ci.yml?branch=main&label=tests&style=flat-square&colorA=18181B
[tests-href]: https://github.com/kiwilan/unplugin-svg-transformer/actions/workflows/ci.yml
[codecov-src]: https://codecov.io/gh/kiwilan/unplugin-svg-transformer/branch/main/graph/badge.svg?token=epJribIFGR
[codecov-href]: https://codecov.io/gh/kiwilan/unplugin-svg-transformer
