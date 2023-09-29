# unplugin-svg-transformer

<!-- ![Banner with printer shop picture in background and Typescriptable Laravel title](docs/banner.jpg) -->

[![unplugin][unplugin-version-src]][unplugin-version-href]
[![version][version-src]][version-href]
[![downloads][downloads-src]][downloads-href]
[![license][license-src]][license-href]

[![tests][tests-src]][tests-href]
[![codecov][codecov-src]][codecov-href]
[![style][style-src]][style-href]

> **Warning**
>
> EXPERIMENTAL: This project is still in early development, and may face breaking changes in the future.

Import easily your SVG. Powered by [unplugin](https://github.com/unjs/unplugin).

Use SVG into modern tools is not easy, especially when you want to use SVG as component. This plugin will parse your SVG files and create a cache file to import them easily with a library index file. It works with any framework with Vite/Webpack, but some components are ready-to-use for Vue and React. You could also create your own component for your favorite framework. Built for TypeScript, but works with JavaScript.

> Designed to be a replacement of [`kiwilan/nuxt-svg-transformer`](https://github.com/kiwilan/nuxt-svg-transformer), a Nuxt module.

```ts
import type { SvgName } from 'unplugin-svg-transformer/icons'
import { importSvg, svgList } from 'unplugin-svg-transformer/icons'

const icon: SvgName = 'svg-name'
const svg = await importSvg('svg-name') // param fully typed (SvgName), string output
const list = svgList // as Record<SvgName, () => Promise<{ default: string }>>
```

## Features

- 🟨 [unplugin](https://github.com/unjs/unplugin): [Vite](https://vitejs.dev/), [Rollup](https://rollupjs.org/guide/en/), [Webpack](https://webpack.js.org/), [esbuild](https://esbuild.github.io/) support
- 🪄 Not a SVG loader, but a SVG transformer
- 🔥 Hot reloading when SVG added or removed
- 🗃️ Index to list all SVG to import them easily
- 🗂 Seperated cache SVG files
- 🚚 Can be import into any JS / TS file
- 📦 Components ready, no import needed, SVG directly injected
  - [Vue 3](https://vuejs.org/) / [Nuxt 3](https://nuxt.com) component
  - [React](https://react.dev/) component
  - [Svelte](https://svelte.dev/) not included, here is an example [`./examples/svelte/src/lib/SvgIcon.svelte`](./examples/svelte/src/lib/SvgIcon.svelte)
- 🐘 [Laravel Inertia](https://inertiajs.com/) compatible with [`laravel-vite-plugin`](https://github.com/laravel/vite-plugin) as Vite plugin
- 🎨 Options to add or clear `style` and `class` global attributes
- 🦾 SVG typed (`typescript` required)

### Roadmap

- [ ] Add Nuxt 2 support
- [ ] Add more tests
- [ ] Add SVGO support
- [ ] Add options of `nuxt-svg-transformer` module
- [ ] Add default SVG option

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
import svgTransformer from 'unplugin-svg-transformer/vite'

export default defineConfig({
  plugins: [
    svgTransformer({
      /* options */
    }),
  ],
})
```

Examples:

- [`examples/vue3`](./examples/vue3)
- [`examples/react`](./examples/react)
- [`examples/svelte`](./examples/svelte)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import svgTransformer from 'unplugin-svg-transformer/rollup'

export default {
  plugins: [
    svgTransformer({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-svg-transformer/webpack')({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  buildModules: [
    'unplugin-svg-transformer/nuxt', // https://github.com/kiwilan/unplugin-svg-transformer
  ],
  svgTransformer: {
    /* options */
  },
})
```

> This module works for Nuxt 3 only

Example: [`examples/nuxt3`](./examples/nuxt3)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-svg-transformer/webpack')({
        /* options */
      }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import svgTransformer from 'unplugin-svg-transformer/esbuild'

build({
  plugins: [
    svgTransformer({
      /* options */
    }),
  ],
})
```

<br></details>

## Usage

`unplugin-svg-transformer` works with any framework with Vite/Webpack, but some components are ready-to-use for Vue and React. You could also create your own component for your favorite framework (only Javascript, TypeScript, Vue 3, React, Svelte and Nuxt 3 have been tested).

### Options

- `svgDir`: `string` - Directory to watch SVG files. Default: `./src/svg` (for Nuxt 3, it's `./assets/svg`)
- `libraryDir`: `string` - Directory to create library file. Default: `./src` (for Nuxt 3, it's `./.nuxt`)
- `useTypes`: `boolean` - Use TypeScript or JavaScript. Default: `true`
- `global`: `boolean` - Add `icons.d.ts`, global type file at root of project. Default: `false` (you might have to add `include: ["icons.d.ts"]` into `tsconfig.json`)
- `cacheDir`: `string` - Directory to create cache files. Default: `./node_modules/unplugin-svg-transformer/cache`

> **Note**
>
> For Nuxt users, only `svgDir` option is available because Nuxt 3 use TypeScript by default and cache is set to `.nuxt`.

### Add your SVG files

In plugin options, you can add a directory to watch SVG files: `svgDir`. By default, it's `./src/svg` (for Nuxt 3, it's `./assets/svg`). Just put your SVG files into this directory and they will be parsed and added to library file, `icons.ts`.

> **Note**
>
> You can use SVG nested directories, but you can't have two SVG files with the same name.

An example of `svgDir` directory:

```bash
├── src
│   ├── svg
│   │   ├── download.svg
│   │   ├── social
│   │   │   └── twitter.svg
│   │   └── vite.svg
│   └── ...
└── ...
```

This example will give you this list: `['download', 'social/twitter', 'vite']`.

> **Note**
>
> A symlink of this directory will be created into `unplugin-svg-transformer/cache`.

### Library file

In plugin options, you can add a directory to choose where to create library file: `libraryDir`. By default, it's `./src` (for Nuxt 3, it's `./.nuxt`). A library file will be created, `icons.ts` (or `icons.js` if `useTypes` is set to `false`), into this directory. This file will list all SVG files, used by `importSvg` function.

With TypeScript, `SvgName` type is available. And with JavaScript or TypeScript, you can use `svgList` and `importSvg` function. SVG list is updated when you add, remove or update a SVG file.

> **Note**
>
> A symlink of this file will be created into `unplugin-svg-transformer/icons`.

An example of `icons.ts` file:

```ts
export type SvgName = 'download' | 'social/twitter' | 'vite' | 'default'
export const svgList: Record<SvgName, () => Promise<{ default: string }>> = {
  'download': () => import('../node_modules/unplugin-svg-transformer/cache/download'),
  'social/twitter': () => import('../node_modules/unplugin-svg-transformer/cache/social/twitter'),
  'vite': () => import('../node_modules/unplugin-svg-transformer/cache/vite'),
  'default': () => import('../node_modules/unplugin-svg-transformer/cache/default'),
}

export async function importSvg(name: SvgName): Promise<string> {
  // ...
}

if (typeof window !== 'undefined') {
  window.svgList = svgList
  window.importSvg = importSvg
}
```

### Import SVG

You can easily import a SVG file with `importSvg` function from `unplugin-svg-transformer/icons` and use `SvgName` type (globally registered) to validate your SVG file name. `svgList` function list all SVG files, used by `importSvg` function.

```ts
import type { SvgName } from 'unplugin-svg-transformer/icons'
import { importSvg, svgList } from 'unplugin-svg-transformer/icons'

const icon: SvgName = 'svg-name'
const icon = await importSvg('svg-name')
// or
const icon = ''
importSvg('svg-name').then((svg) => {
  icon = svg
})
```

You can use [`Window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) to access `svgList` and `importSvg` functions (not SSR compatible).

```ts
const svg = await window.importSvg('svg-name')
```

#### Ready-to-use components

With some frameworks, you don't have to create your own component, you can use ready-to-use components.

> **Warning**
>
> Assure you have import `unplugin-svg-transformer/icons` into `main.ts` or `app.ts` (or `app.js`) when you use ready-to-use components: `import 'unplugin-svg-transformer/icons'` (except for Nuxt).
>
>```ts
>// main.ts
>import 'unplugin-svg-transformer/icons'
>```

- For Vue 3, you can use a plugin to register globally `SvgIcon` component with `SvgTransformerPlugin` from `unplugin-svg-transformer/vue` and use `SvgIcon` component directly. But you can just import `SvgIcon` component from `unplugin-svg-transformer/vue` and use `SvgIcon` component.
- For React, you can import `SvgIcon` component from `unplugin-svg-transformer/react`
- For Nuxt 3, you have a globally registered `SvgIcon` component, you can use `SvgIcon` component directly. You have an alias to use easily icons: `#icons`, same as `unplugin-svg-transformer/icons`.

All ready-to-use components have a `name` prop, based on SVG file name. You can use `name` prop to validate SVG file name.

#### Create your own component

- For Svelte, no component available, you have to create your own, you can use example: [`./examples/svelte/src/lib/SvgIcon.svelte`](./examples/svelte/src/lib/SvgIcon.svelte)
- For vanilla JS or TS, you can import `importSvg` function from `unplugin-svg-transformer/icons` to import SVG file.

### TypeScript

> **Note**
>
> You can use JavaScript only with `useTypes` option set to `false`.

You can use `SvgName` type to validate your SVG file name.

```ts
import type { SvgName } from 'unplugin-svg-transformer/icons'

const icon: SvgName = 'svg-name'
```

If you use Vite (with Vue, React or Svelte) or Nuxt, `SvgName` is globally imported by default. But if you use another bundler or vanilla JS/TS and you want to globally import `SvgName`, you can add `global` option to `true` in plugin options to create `icons.d.ts` at root of project to add `SvgName` globally. You might have to add `include: ["icons.d.ts"]` into `tsconfig.json`.

```ts
// vite.config.ts
import svgTransformer from 'unplugin-svg-transformer/vite'

export default defineConfig({
  plugins: [
    svgTransformer({
      global: true,
    }),
  ],
})
```

### Advanced examples

#### Vue 3

An example with Vue 3 and Vite.

<details>
<summary>Vue 3</summary><br>

You can skip `SvgTransformerPlugin` registration, this plugin will only load `SvgIcon` component globally, you can import `SvgIcon` component from `unplugin-svg-transformer/vue` and use `SvgIcon` component. But you have to import `unplugin-svg-transformer/icons` in `main.ts` if you want to use `SvgIcon` component.

```diff
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
+import { SvgTransformerPlugin } from 'unplugin-svg-transformer/vue'
+import "unplugin-svg-transformer/icons";

createApp(App)
+ .use(SvgTransformerPlugin)
  .mount("#app");
```

<br></details>

#### Inertia

An example with [Laravel Jetstream](https://jetstream.laravel.com/) ([Inertia](https://inertiajs.com/)) and Vite. This example will use TypeScript, but it works with JavaScript. For TypeScript, you will have to create `tsconfig.json` file at root of project, here a [example](https://gist.github.com/ewilan-riviere/616dc2bb9da36e4ed77068628719a00a).

<details>
<summary>Inertia</summary><br>

Example here with Laravel Jetstream,

> **Note**
>
> This example use Vue 3, but it works with React or Svelte.

To use TypeScript, update `vite.config.js` to `vite.config.ts` and just add `unplugin-svg-transformer/vite` to `plugins` array.

> **Warning**
>
> Don't forget to replace `resources/js/app.js` to `resources/js/app.ts` into `laravel-vite-plugin` options.

```diff
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";
+import svgTransformer from "unplugin-svg-transformer/vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/resources/js",
      "~": "/",
    },
  },
  plugins: [
    laravel({
+     input: ["resources/js/app.ts"],
      ssr: "resources/js/ssr.js",
      refresh: true,
    }),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
+   svgTransformer({
+     svgDir: "./resources/js/Svg",
+     libraryDir: "./resources/js",
+     global: true,
+   }),
  ],
});
```

Just replace `app.js` to `app.ts` into `resources/js` (and root Blade file).

```diff
// app.ts
import type { DefineComponent } from "vue";
import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
+import { SvgTransformerPlugin } from "unplugin-svg-transformer/vue";
+import 'unplugin-svg-transformer/icons'

createInertiaApp({
  title: (title) => `${title} - App Name`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.vue`,
      import.meta.glob("./Pages/**/*.vue")
    ) as Promise<DefineComponent>,
  setup({ el, App, props, plugin }) {
    const app = createApp({ render: () => h(App, props) })
      .use(plugin)
+     .use(SvgTransformerPlugin);

    app.mount(el);
  },
});
```

And you can use globally registered `SvgIcon` component.

```vue
<template>
  <div>
    <SvgIcon name="svg-name" />
  </div>
</template>
```

<br></details>

## Testing

```bash
pnpm test
```

### Local

```bash
pnpm package
```

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

- [`ewilan-riviere`](https://github.com/ewilan-riviere): author
- [`antfu`](https://github.com/antfu/unplugin-starter): for the starter template

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

[<img src="https://user-images.githubusercontent.com/48261459/201463225-0a5a084e-df15-4b11-b1d2-40fafd3555cf.svg" height="120rem" width="100%" />](https://github.com/kiwilan)

[unplugin-version-src]: https://img.shields.io/badge/dynamic/json?label=unplugin&query=dependencies[%27unplugin%27]&url=https://raw.githubusercontent.com/kiwilan/unplugin-svg-transformer/main/package.json&color=F0DB4F&labelColor=18181b
[unplugin-version-href]: https://github.com/unjs/unplugin
[version-src]: https://img.shields.io/npm/v/unplugin-svg-transformer.svg?style=flat-square&color=F0DB4F&labelColor=18181b
[version-href]: https://www.npmjs.com/package/unplugin-svg-transformer
[downloads-src]: https://img.shields.io/npm/dm/unplugin-svg-transformer?style=flat-square&colorA=18181B&colorB=F0DB4F
[downloads-href]: https://npmjs.com/package/unplugin-svg-transformer
[license-src]: https://img.shields.io/github/license/kiwilan/unplugin-svg-transformer.svg?style=flat-square&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/kiwilan/unplugin-svg-transformer/blob/main/README.md
[tests-src]: https://img.shields.io/github/actions/workflow/status/kiwilan/unplugin-svg-transformer/tests.yml?branch=main&label=tests&style=flat-square&colorA=18181B
[tests-href]: https://github.com/kiwilan/unplugin-svg-transformer/actions/workflows/tests.yml
[codecov-src]: https://codecov.io/gh/kiwilan/unplugin-svg-transformer/branch/main/graph/badge.svg?token=epJribIFGR
[codecov-href]: https://codecov.io/gh/kiwilan/unplugin-svg-transformer
[style-src]: https://antfu.me/badge-code-style.svg
[style-href]: https://github.com/antfu/eslint-config
