import type { Options } from 'html2canvas'
import html2canvas from 'html2canvas'
import dayjs from 'dayjs'

/**
 * 将 DataUrl 下载为图片
 * @param dataUrl
 */
export const downloadDataUrlAsImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}

/**
 * 截图
 */
export const screenshot = async (el: HTMLElement, options: Partial<Options> = {}) => {
  const canvas = await html2canvas(el, options)
  return canvas.toDataURL()
}

/**
 * 获取游戏视图窗口 DOM
 * @returns
 */
export const getGameViewDom = () => {
  const advContent = document.querySelector('.adv-game') as HTMLElement
  return advContent
}

/**
 * 游戏截图并下载
 */
export const screenshotGame = async (options: Partial<Options> = {}) => {
  const advContent = getGameViewDom()
  if (advContent) {
    const dataUrl = await screenshot(advContent, options)
    downloadDataUrlAsImage(dataUrl, `advjs-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}`)
  }
}

/**
 * 获取游戏缩略图
 * @param options
 */
export const screenshotGameThumb = async (options: Partial<Options> = {}) => {
  const advContent = getGameViewDom()
  const dataUrl = await screenshot(advContent, Object.assign({ scale: 0.2 }, options))
  return dataUrl
}
