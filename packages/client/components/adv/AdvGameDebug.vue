<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type * as BABYLON from '@babylonjs/core'
import type { CameraInfo } from '@advjs/shared/debug/camera'
import { captureCameraInfo } from '@advjs/shared/debug/camera'
import { useBabylonStore } from '~/stores/babylon'
import { useAppStore } from '~/stores/app'
import { useAdvCtx } from '~/setup'

const $adv = useAdvCtx()

const app = useAppStore()

const el = ref<HTMLElement | null>(null)
const open = ref(false)

const bStore = useBabylonStore()

const cameraInfo = ref<CameraInfo>({
  target: {
    x: 0,
    y: 0,
    z: 0,
  },
  alpha: 0,
  beta: 0,
  radius: 0,
})

watch(open, (value) => {
  if (!value)
    el.value!.scrollTop = 0
})

const type = ref('')

const setCameraInfo = (camera: BABYLON.ArcRotateCamera) => {
  type.value = 'camera'

  if (!camera)
    return
  const info = captureCameraInfo(camera)
  if (info)
    cameraInfo.value = info
}

const sceneCamera = computed(() => bStore.instance?.scene?.activeCamera as BABYLON.ArcRotateCamera)
const vrmCamera = computed(() => bStore.instance?.vrmScene?.activeCamera as BABYLON.ArcRotateCamera)

const debugInfo = computed(() => {
  let data = {}

  if (type.value === 'store')
    data = $adv.config
  else if (type.value === 'camera')
    data = cameraInfo
  return JSON.stringify(data, null, 2)
})
</script>

<template>
  <AdvDebug>
    <AdvIconButton @click="type = 'store'">
      <div i-ri-database-line />
    </AdvIconButton>
    <AdvIconButton @click="setCameraInfo(sceneCamera)">
      <div i-ri-camera-line />
    </AdvIconButton>
    <AdvIconButton @click="setCameraInfo(vrmCamera)">
      <div i-ri-shield-user-line />
    </AdvIconButton>
    <AdvIconButton title="切换背景图" @click="app.toggleBg()">
      <div i-ri-image-line />
    </AdvIconButton>
    <pre class="block text-left">{{ debugInfo }}</pre>
  </AdvDebug>
</template>

<style scoped>
.block {
  margin: 2px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  padding: 8px 16px;
  font-family: Hack, monospace;
  font-size: 13px;
}

.block + .block {
  margin-top: 8px;
}
</style>
