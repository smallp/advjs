<script lang="ts" setup>
import { useAppStore } from '~/stores/app'

const app = useAppStore()

const onClick = () => {
  app.rotate()
}
</script>

<template>
  <AdvIconButton @click="onClick()">
    <div i-ri-clockwise-line />
  </AdvIconButton>
</template>
