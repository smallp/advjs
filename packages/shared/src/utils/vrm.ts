/**
 * 检查模型格式
 * @param file
 * @returns
 */
export function checkModelFormat(file: File) {
  if (!file.name.endsWith('.vrm'))
    return false
  return true
}
