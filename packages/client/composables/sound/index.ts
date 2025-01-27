/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-use-before-define */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck all file
import type { Howl } from 'howler'
import { onMounted, ref, unref, watch } from 'vue-demi'
import type { MaybeRef } from '@vueuse/core'
import type {
  ComposableOptions,
  HowlStatic,
  PlayFunction,
  PlayOptions,
  ReturnedValue,
} from './types'

export function useSound(
  url: MaybeRef<string>,
  {
    volume = 1,
    playbackRate = 1,
    soundEnabled = true,
    interrupt = false,
    onload,
    ...delegated
  }: ComposableOptions = {},
) {
  const HowlConstructor = ref<HowlStatic | null>(null)
  const isPlaying = ref<boolean>(false)
  const duration = ref<number | null>(null)
  const sound = ref<Howl | null>(null)

  onMounted(() => {
    import('howler').then((mod) => {
      HowlConstructor.value = mod.Howl

      sound.value = new HowlConstructor.value({
        src: [unref(url)],
        volume: unref(volume),
        rate: unref(playbackRate),
        onload: handleLoad,
        ...delegated,
      })
    })
  })

  const handleLoad = function () {
    if (typeof onload === 'function') {
      // @ts-expect-error this
      onload.call(this)
    }

    duration.value = duration.value ? duration.value * 1000 : 0
  }

  watch(
    () => [url],
    () => {
      if (HowlConstructor && HowlConstructor.value && sound && sound.value) {
        sound.value = new HowlConstructor.value({
          src: [unref(url)],
          volume: unref(volume),
          rate: unref(playbackRate),
          onload: handleLoad,
          ...delegated,
        })
      }
    },
  )

  watch(
    () => [unref(volume), unref(playbackRate)],
    () => {
      if (sound.value) {
        sound.value.volume(unref(volume))
        sound.value.rate(unref(playbackRate))
      }
    },
  )

  const play: PlayFunction = (options?: PlayOptions) => {
    if (typeof options === 'undefined')
      options = {}

    if (!sound.value || (!soundEnabled && !options.forceSoundEnabled))
      return

    if (interrupt)
      sound.value.stop()

    if (options.playbackRate)
      sound.value.rate(options.playbackRate)

    sound.value.play(options.id)

    sound.value.once('end', () => {
      if (sound && sound.value && !sound.value.playing())
        isPlaying.value = false
    })

    isPlaying.value = true
  }

  const stop = (id?: number) => {
    if (!sound.value)
      return

    sound.value.stop(typeof id === 'number' ? id : undefined)

    isPlaying.value = false
  }

  const pause = (id?: number) => {
    if (!sound.value)
      return

    sound.value.pause(typeof id === 'number' ? id : undefined)

    isPlaying.value = false
  }

  const returnedValue: ReturnedValue = {
    play,
    sound,
    isPlaying,
    duration,
    pause,
    stop,
  }

  return returnedValue
}
