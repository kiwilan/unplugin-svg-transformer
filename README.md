![Banner with unplugin logo and unplugin-svg-transformer title, a SVG logo inserted for svg in title](docs/banner.jpg)

# unplugin-svg-transformer

[![unplugin][unplugin-version-src]][unplugin-version-href]
[![version][version-src]][version-href]
[![downloads][downloads-src]][downloads-href]
[![license][license-src]][license-href]

[![tests][tests-src]][tests-href]
[![codecov][codecov-src]][codecov-href]
[![style][style-src]][style-href]

Import easily your SVG. Powered by [unplugin](https://github.com/unjs/unplugin).

> Designed to be a replacement of [`kiwilan/nuxt-svg-transformer`](https://github.com/kiwilan/nuxt-svg-transformer), a Nuxt module.

Use SVG into modern tools is not easy, especially when you want to use SVG as component. **This plugin will parse your SVG files** and **create a cache file** to **import them easily with a library index file**. It **works with any framework with Vite/Webpack**, but some components are ready-to-use for Vue, Nuxt and React. You could also create your own component for your favorite framework. **Built for TypeScript, but works with JavaScript**.

> **Note**
>
> If you want to use SVG from icon sets, you should use [`unplugin-icons`](https://github.com/unplugin/unplugin-icons), a very good plugin from [unplugin](https://github.com/unplugin). `unplugin-svg-transformer` is only for custom SVG.

```ts
import type { SvgName } from "unplugin-svg-transformer/icons";
import { importSvg, svgList } from "unplugin-svg-transformer/icons";

const icon: SvgName = "svg-name";
const svg = await importSvg("svg-name"); // param fully typed (SvgName), string output
const list = svgList; // as Record<SvgName, () => Promise<{ default: string }>>
```

> **Note**
>
> A demo is available on [Stackblitz](https://stackblitz.com/github/ewilan-riviere/unplugin-svg-transformer-example) or directly on [github.com/ewilan-riviere/unplugin-svg-transformer-example](https://github.com/ewilan-riviere/unplugin-svg-transformer-example).

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
import svgTransformer from "unplugin-svg-transformer/vite";

export default defineConfig({
  plugins: [
    svgTransformer({
      /* options */
    }),
  ],
});
```

Examples for Vue, React and Svelte:

- [`live/vue3`](./live/vue3)
- [`live/react`](./live/react)
- [`live/svelte`](./live/svelte)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import svgTransformer from "unplugin-svg-transformer/rollup";

export default {
  plugins: [
    svgTransformer({
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
  svgTransformer: {
    /* options */
  },
});
```

> This module works for Nuxt 3 only

Example: [`live/nuxt3`](./live/nuxt3)

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
import svgTransformer from "unplugin-svg-transformer/esbuild";

build({
  plugins: [
    svgTransformer({
      /* options */
    }),
  ],
});
```

<br></details>

## Usage

`unplugin-svg-transformer` works with any framework with Vite/Webpack, but some components are ready-to-use for Vue and React. You could also create your own component for your favorite framework (only Javascript, TypeScript, Vue 3, React, Svelte and Nuxt 3 have been tested).

### Options

> **Note**
>
> Nuxt 3 have some built-in options defined statically, because it uses amazing Nuxt 3 features. If ✅ option is available, otherwise is static.

|           Name           |          Type           |                                         Description                                          |                    Default                     |       Nuxt        |
| :----------------------: | :---------------------: | :------------------------------------------------------------------------------------------: | :--------------------------------------------: | :---------------: |
|        `cacheDir`        |        `string`         |                         SVG files will be added to cache directory.                          | `./node_modules/unplugin-svg-components/cache` |  `./.nuxt/icons`  |
|        `fallback`        |        `string`         |                       Default SVG displayed when the SVG is not found.                       |                `<svg>...</svg>`                |        ✅         |
|         `global`         |        `boolean`        |                    Create `icons.d.ts` file at the root of your project.                     |                    `false`                     |                   |
|       `libraryDir`       |        `string`         |                         Directory where `icons.ts` will be created.                          |                    `./src`                     |     `./.nuxt`     |
|         `svgDir`         |        `string`         |                         Directory where your SVG files are located.                          |                  `./src/svg`                   | ✅ `./assets/svg` |
|    `svg.classDefault`    |       `string[]`        |                               Add default classes to all SVG.                                |                  `undefined`                   |        ✅         |
|     `svg.clearSize`      | `all`, `parent`, `none` | Clear `width` and `height` attributes from SVG (can be all, just parent on `<svg>` or none). |                     `none`                     |        ✅         |
|     `svg.clearClass`     | `all`, `parent`, `none` |             Clear classes from SVG (can be all, just parent on `<svg>` or none).             |                     `none`                     |        ✅         |
|     `svg.clearStyle`     | `all`, `parent`, `none` |          Clear inline styles from SVG (can be all, just parent on `<svg>` or none).          |                     `none`                     |        ✅         |
|    `svg.currentColor`    |        `boolean`        |               Add `fill="currentColor"` or `stroke="currentColor"` to all SVG.               |                    `false`                     |        ✅         |
| `svg.inlineStyleDefault` |       `string[]`        |                             Add default inline style to all SVG.                             |                  `undefined`                   |        ✅         |
|    `svg.sizeInherit`     |        `boolean`        |                     Add inline style `height: inherit; width: inherit;`.                     |                    `false`                     |        ✅         |
|       `svg.title`        |        `boolean`        |                                   Add title to SVG string.                                   |                    `false`                     |        ✅         |
|        `useTypes`        |        `boolean`        |               Use types, if you want to use JavaScript instead of TypeScript.                |                     `true`                     |      `true`       |
|        `warning`         |        `boolean`        |                         Trigger a warning when the SVG is not found.                         |                    `false`                     |        ✅         |

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

### Library file

In plugin options, you can add a directory to choose where to create library file: `libraryDir`. By default, it's `./src` (for Nuxt 3, it's `./.nuxt`). A library file will be created, `icons.ts` (or `icons.js` if `useTypes` is set to `false`), into this directory. This file will list all SVG files, used by `importSvg` function.

With TypeScript, `SvgName` type is available. And with JavaScript or TypeScript, you can use `svgList` and `importSvg` function. SVG list is updated when you add, remove or update a SVG file.

> **Note**
>
> A symlink of this file will be created into `unplugin-svg-transformer/icons`.

An example of `icons.ts` file:

```ts
export type SvgName = "download" | "social/twitter" | "vite" | "default";
export const options = {...};
export const svgList: Record<SvgName, () => Promise<{ default: string }>> = {
  download: () => import(".../cache/download"),
  "social/twitter": () => import(".../cache/social/twitter"),
  vite: () => import(".../cache/vite"),
  default: () => import(".../cache/default"),
};

export async function importSvg(name: SvgName): Promise<string> {
  // ...
}

if (typeof window !== "undefined") {
  window.ust.options = options;
  window.ust.svgList = svgList;
  window.ust.importSvg = importSvg;
}
```

### Import SVG

You can easily import a SVG file with `importSvg` function from `unplugin-svg-transformer/icons` and use `SvgName` type (globally registered) to validate your SVG file name. `svgList` function list all SVG files, used by `importSvg` function.

```ts
import type { SvgName } from "unplugin-svg-transformer/icons";
import { importSvg, options, svgList } from "unplugin-svg-transformer/icons";

// `SvgName` type represents SVG file name
const icon: SvgName = "svg-name";
// importSvg function is async, you can use `await` or `then` method
const icon = await importSvg("svg-name");
// or
const icon = "";
importSvg("svg-name").then((svg) => {
  icon = svg;
});

const fallback = options.fallback; // All options are available
```

You can use [`Window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) to access `svgList` and `importSvg` functions from `ust` (not SSR compatible).

```ts
const svg = await window.ust.importSvg("svg-name");
```

#### Ready-to-use components

With some frameworks, you don't have to create your own component, you can use ready-to-use components.

> **Warning**
>
> Assure you have import `unplugin-svg-transformer/icons` into `main.ts` or `app.ts` (or `app.js`) when you use ready-to-use components: `import 'unplugin-svg-transformer/icons'` (except for Nuxt). Why? Because ready-to-use components use `window` to access to `importSvg` function (of course for Nuxt 3, you don't have to import `unplugin-svg-transformer/icons` because component use `#icons` alias).
>
> ```ts
> // main.ts
> import "unplugin-svg-transformer/icons";
> ```

- For Vue 3, you can use a plugin to register globally `SvgIcon` component with `SvgTransformerPlugin` from `unplugin-svg-transformer/vue` and use `SvgIcon` component directly. But you can just import `SvgIcon` component from `unplugin-svg-transformer/vue` and use `SvgIcon` component.
- For React, you can import `SvgIcon` component from `unplugin-svg-transformer/react`.
- For Nuxt 3, you have a globally registered `SvgIcon` component, you can use `SvgIcon` component directly. You have an alias to use easily icons: `#icons`, same as `unplugin-svg-transformer/icons`.

All ready-to-use components have a `name` prop, based on SVG file name. You can use `name` prop to validate SVG file name.

| Prop name  | Prop type | Required |                          Prop description                           |
| :--------: | :-------: | :------: | :-----------------------------------------------------------------: |
|   `name`   | `SvgName` |    ✅    |                            SVG file name                            |
|  `title`   | `string`  |          |                         Add `title` to SVG                          |
| `reactive` | `boolean` |          | Add `watch` to update SVG if `name` update (not available on React) |

#### Create your own component

- For Svelte, no component available, you have to create your own, you can use example: [`./examples/svelte/src/lib/SvgIcon.svelte`](./examples/svelte/src/lib/SvgIcon.svelte).
- For vanilla JS or TS, you can import `importSvg` function from `unplugin-svg-transformer/icons` to import SVG file.
- For Vue or React, you can create your own component like with Svelte.

### TypeScript or JavaScript

To use JavaScript only, set `useTypes` option to `false`, but this plugin is built for TypeScript first. You can use `SvgName` type to validate your SVG file name.

```ts
import type { SvgName } from "unplugin-svg-transformer/icons";

const icon: SvgName = "svg-name";
```

If you use only JavaScript you can import your SVG with same way without type validation.

#### Global type

If you use Vite (with Vue, React or Svelte) or Nuxt, `SvgName` is globally imported by default. But if you use another bundler or vanilla JS/TS and you want to globally import `SvgName`, you can add `global` option to `true` in plugin options to create `icons.d.ts` at root of project to add `SvgName` globally. You might have to add `include: ["icons.d.ts"]` into `tsconfig.json`.

> **Note**
>
> With Vue, React and Svelte, this plugin use `vite-env.d.ts` to add `SvgName` globally, `global` option is not needed (same for Nuxt).

```jsonc
// tsconfig.json, if you enabled `global` option.
{
  "include": ["icons.d.ts"]
}
```

And enable `global` option in plugin options.

```ts
// vite.config.ts (or webpack.config.js, rollup.config.js, ...)
import svgTransformer from "unplugin-svg-transformer/vite";

export default defineConfig({
  plugins: [
    svgTransformer({
      global: true,
    }),
  ],
});
```

### Advanced examples

#### Vue 3

An example with Vue 3 and Vite.

<details>
<summary>Click to see example</summary><br>

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
<summary>Click to see example</summary><br>

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

#### React

An example with React and Vite.

<details>
<summary>Click to see example</summary><br>

You have to import `unplugin-svg-transformer/icons` only once in `main.tsx` (or `app.tsx`), you can use `SvgIcon` component if you import it from `unplugin-svg-transformer/react`.

```diff
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
+import { SvgIcon } from 'unplugin-svg-transformer/react'
import './index.css'
+import 'unplugin-svg-transformer/icons'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    hello
+   <SvgIcon name="svg-name" className='icon' />
  </React.StrictMode>,
)
```

<br></details>

#### Nuxt 3

An example with Nuxt 3.

<details>
<summary>Click to see example</summary><br>

Installation on Nuxt 3 is easily with `nuxt.config.ts` file.

```ts
// nuxt.config.ts
import { defineNuxtConfig } from "nuxt3";

export default defineNuxtConfig({
  buildModules: [
    "unplugin-svg-transformer/nuxt", //
  ],
  svgTransformer: {
    /* options */
  },
});
```

And you can use globally registered `SvgIcon` component or `#icons` alias.

```vue
<script setup lang="ts">
import { importSvg } from "#icons"; // `#icons` alias

const svg = ref<string>("");
importSvg("svg-name").then((icon) => {
  svg.value = icon;
});
</script>

<template>
  <div>
    <div v-html="svg" />
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

- [UnJS](https://github.com/unjs): UnJS team for [`unplugin`](https://github.com/unjs/unplugin)
- [`ewilan-riviere`](https://github.com/ewilan-riviere): author
- [`antfu`](https://github.com/antfu/unplugin-starter): for the starter template, `@antfu/eslint-config` and his amazing work

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

[<img src="https://user-images.githubusercontent.com/48261459/201463225-0a5a084e-df15-4b11-b1d2-40fafd3555cf.svg" height="120rem" width="100%" />](https://github.com/kiwilan)

[unplugin-version-src]: https://img.shields.io/badge/dynamic/json?label=unplugin&query=dependencies[%27unplugin%27]&url=https://raw.githubusercontent.com/kiwilan/unplugin-svg-transformer/main/package.json&style=flat-square&colorA=18181B&colorB=F0DB4F
[unplugin-version-href]: https://github.com/unjs/unplugin
[version-src]: https://img.shields.io/npm/v/unplugin-svg-transformer.svg?style=flat-square&colorA=18181B&colorB=F0DB4F
[version-href]: https://www.npmjs.com/package/unplugin-svg-transformer
[downloads-src]: https://img.shields.io/npm/dm/unplugin-svg-transformer?style=flat-square&colorA=18181B&colorB=F0DB4F
[downloads-href]: https://npmjs.com/package/unplugin-svg-transformer
[license-src]: https://img.shields.io/github/license/kiwilan/unplugin-svg-transformer.svg?style=flat-square&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/kiwilan/unplugin-svg-transformer/blob/main/README.md
[tests-src]: https://img.shields.io/github/actions/workflow/status/kiwilan/unplugin-svg-transformer/tests.yml?branch=main&label=tests&style=flat-square&colorA=18181B
[tests-href]: https://github.com/kiwilan/unplugin-svg-transformer/actions/workflows/tests.yml
[codecov-src]: https://img.shields.io/codecov/c/gh/kiwilan/unplugin-svg-transformer/main?style=flat-square&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/kiwilan/unplugin-svg-transformer
[style-src]: https://antfu.me/badge-code-style.svg
[style-href]: https://github.com/antfu/eslint-config
