<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
import { useHead } from '@vueuse/head'
import { isDark } from './composables'
// github corners is web component, use null to not render reverse attribute

useHead({
  title: 'ADV.JS Editor',
  meta: [
    { name: 'description', content: 'ADV.JS 在线编辑器' },
  ],
})
</script>

<template>
  <github-corners repo="YunYouJun/advjs/tree/main/packages/parser" blank :reverse="isDark || null" />
  <router-view />
</template>
