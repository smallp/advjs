import fs from 'fs'
// import { dirname } from 'path'
import type { AdvThemeMeta } from '@advjs/types'
import { parse } from './core'
export * from './core'

export function load(filepath: string, themeMeta?: AdvThemeMeta, content?: string) {
  // const dir = dirname(filepath)
  const markdown = content ?? fs.readFileSync(filepath, 'utf-8')

  const data = parse(markdown, filepath)

  const entries = new Set([
    filepath,
  ])
  data.entries = Array.from(entries)

  // todo add 'src' for child frontmatter

  return data
}
