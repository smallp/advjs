<script setup lang="ts">
import { speak } from '@advjs/shared/speech'
import { computed, ref, watch } from 'vue'
import type { AdvAst } from '@advjs/types'
import { useMagicKeys } from '@vueuse/core'
import { useAdvCtx } from '~/setup'
import { useSettingsStore } from '~/stores/settings'
import { useAppStore } from '~/stores/app'

const props = defineProps<{
  node: AdvAst.Child
}>()

const $adv = useAdvCtx()
const keys = useMagicKeys()
const { space } = keys
const app = useAppStore()

const settings = useSettingsStore()

const curDialog = computed(() => $adv.store.cur.dialog)

// 局部 words order，与全局 order 相区别
const iOrder = ref(0)

watch(
  () => curDialog.value.children[iOrder.value]?.value,
  (val) => {
    // 若开启了语音合成
    if (settings.storage.speech) {
      speechSynthesis.cancel()
      speak(val, settings.storage.speechOptions.lang || 'zh-CN')
    }
  },
)

const end = ref(false)
const animation = ref(true)

const next = async () => {
  // 该回首页了
  if ($adv.store.status.isEnd)
    return $adv.nav.next()

  if (!end.value && animation.value) {
    animation.value = false
    return
  }
  else {
    // reset
    animation.value = true
    end.value = false
  }

  if (curDialog.value.children) {
    const length = curDialog.value.children.length

    if (iOrder.value + 1 > length - 1) {
      await $adv.nav.next()
      iOrder.value = 0
    }
    else {
      iOrder.value++
    }
  }
}

watch(space, (v) => {
  if (v && !app.showHistory && !app.showSaveMenu && !app.showLoadMenu && $adv.store.curNode?.type !== 'choices')
    next()
})

const curCharacter = computed(() => curDialog.value.character)

const characterAvatar = computed(() => {
  const advConfig = $adv.config
  const curName = curCharacter.value ? curCharacter.value.name : ''
  const avatar = advConfig.characters.find(item => item.name === curName || item.alias === curName || (Array.isArray(item.alias) && item.alias.includes(curName)))?.avatar
  const prefix = advConfig.cdn.enable ? advConfig.cdn.prefix || '' : ''
  return avatar ? prefix + avatar : ''
})

// 当前对话框中的台词
const curWords = computed(() => {
  if (props.node && props.node.type === 'text')
    return props.node.value

  return curDialog.value.children[iOrder.value]?.value
})

// trigger transition
const transitionFlag = ref(true)
watch(() => curCharacter.value.name, () => {
  transitionFlag.value = false
  setTimeout(() => {
    transitionFlag.value = true
  }, 1)
})
</script>

<template>
  <div class="dialog-box select-none cursor-pointer" grid="~ cols-12" gap="12" @click="next">
    <div v-if="curCharacter" class=" col-span-3 text-right">
      <template v-if="$adv.config.showCharacterAvatar && characterAvatar">
        <div flex="~ col" class="justify-center items-end">
          <img class="w-25 h-25 shadow rounded" object="cover top" :src="characterAvatar">
          <span class="w-25" m="t-2" text="center gray-400">{{ curCharacter.name }}</span>
        </div>
      </template>
      <template v-else>
        <Transition name="fade">
          <span v-if="transitionFlag" class="dialog-name">{{ curCharacter.name }}</span>
        </Transition>
      </template>
    </div>
    <div class="dialog-content col-span-9 text-left pr-24" :class="`text-${settings.storage.text.curFontSize}`">
      <PrintWords
        :animation="animation"
        :speed="settings.storage.text.curSpeed"
        :words="curWords" @end="end = true"
      />
      <span v-if="!$adv.store.status.isEnd" class="typed-cursor">
        ▼
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.dialog-box {
  width: 100%;
  height: 40%;

  position: absolute;
  right: 0;
  bottom: -1px;

  background-image: linear-gradient(
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.9) 30%,
    black 100%
  );
  padding-top: 4rem;

  .dialog-name {
    color: gray;
    font-size: 2rem;
  }

  .dialog-content {
    color: white;
    margin-top: 0.3rem;
  }
}
</style>
