import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createHead } from '@vueuse/head'

import { createApp } from 'vue'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
// your custom styles here
import './styles/index.css'
import 'uno.css'

import 'wc-github-corners'

const routes = setupLayouts(generatedRoutes)
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App)
const head = createHead()
app.use(router)
app.use(head)
Object.values(import.meta.globEager('./modules/*.ts')).map(i =>
  i.install?.({ app, isClient: typeof window !== 'undefined', router }),
)
app.mount('#app')
