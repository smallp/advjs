import type { Plugin } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { notNullish } from '@antfu/utils'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import LinkAttributes from 'markdown-it-link-attributes'
import Markdown from 'vite-plugin-vue-markdown'
import VueI18n from '@intlify/vite-plugin-vue-i18n'

import type { AdvPluginOptions, AdvServerOptions, ResolvedAdvOptions } from '../options'
import { customElements } from '../constants'
import { createConfigPlugin } from './extendConfig'
// import { createClientSetupPlugin } from './setupClient'
import { createUnocssPlugin } from './unocss'
import { createAdvLoader } from './loaders'

export async function ViteAdvPlugin(
  options: ResolvedAdvOptions,
  pluginOptions: AdvPluginOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serverOptions: AdvServerOptions = {},
): Promise<Plugin[]> {
  const {
    vue: vueOptions = {},
    components: componentsOptions = {},
  } = pluginOptions

  const {
    clientRoot,
    roots,
  } = options

  const vuePlugin = Vue({
    include: [/\.vue$/, /\.md$/],
    exclude: [],
    template: {
      compilerOptions: {
        isCustomElement(tag) {
          return customElements.has(tag)
        },
      },
      ...vueOptions?.template,
    },
    ...vueOptions,
  })

  return [
    await createUnocssPlugin(options, pluginOptions),

    vuePlugin,
    createAdvLoader(options, vuePlugin),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
      dirs: roots.map(root => `${root}/pages`),
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts({
      layoutsDirs: roots.map(root => `${root}/layouts`),
    }),

    // createSlidesLoader(options, pluginOptions, serverOptions, VuePlugin, MarkdownPlugin),

    Components({
      extensions: ['vue', 'md', 'ts'],

      dirs: roots.map(root => `${root}/components`).concat([
        `${clientRoot}/builtin`,
      ]),

      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      exclude: [],

      ...componentsOptions,
    }),

    // https://github.com/antfu/vite-plugin-vue-markdown
    Markdown({
      wrapperClasses: 'markdown-body',
      headEnabled: true,
      markdownItSetup(md) {
        md.use(LinkAttributes, {
          pattern: /^https?:\/\//,
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
      // avoid conflict with adv
      exclude: ['**/*.adv.md'],
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: roots.map(root => `${root}/locales/**`),
    }),

    // todo download remote assets

    createConfigPlugin(options),
  ]
    .flat()
    .filter(notNullish)
}
