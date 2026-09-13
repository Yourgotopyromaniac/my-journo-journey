#!/usr/bin/env node
/**
 * Plain English check for learner-facing text (docs/REQUIREMENTS.md, section 4.1).
 * Scans lessons, week files, the glossary and page copy for banned words, em dashes
 * and very long sentences. Fails the build on errors; long sentences are warnings.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const TARGETS = ['src/content', 'src/features', 'src/app']
const EXTENSIONS = ['.mdx', '.ts', '.tsx']
const MAX_WORDS = 30

const BANNED = [
  'delve',
  'tapestry',
  'landscape',
  'realm',
  'embark',
  'unlock',
  'empower',
  'elevate',
  'leverage',
  'robust',
  'seamless',
  'foster',
  'pivotal',
  'crucial',
  'nuanced',
  'testament',
  'vibrant',
  'game-changer',
  'game changer',
  "let's dive",
  'dive in',
  'fast-paced',
  'in conclusion',
  "it's worth noting",
  'it is worth noting',
  'arguably',
]

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walk(path)
    return EXTENSIONS.some((ext) => path.endsWith(ext)) ? [path] : []
  })
}

/** Pulls out the human-readable text: MDX prose, and string literals in TS/TSX. */
function extractText(path, source) {
  if (path.endsWith('.mdx')) {
    return source
      .replace(/^import .*$/gm, '')
      .replace(/https?:\/\/\S+/g, '')
      .split('\n')
  }
  const strings = []
  const re = /(['"`])((?:\\.|(?!\1)[^\\\n])*)\1|>([^<>{}\n]{3,})</g
  for (const line of source.split('\n')) {
    let m
    const found = []
    while ((m = re.exec(line))) {
      const text = m[2] ?? m[3] ?? ''
      // Skip class names, paths, ids and other code-like strings.
      if (/^[\w\-:/.[\]#@()%&=,*!]+$/.test(text) || /^(https?:|\/|\.\/|@\/)/.test(text)) continue
      found.push(text)
    }
    strings.push(found.join(' '))
  }
  return strings
}

let errors = 0
let warnings = 0

for (const target of TARGETS) {
  for (const file of walk(join(ROOT, target))) {
    const rel = relative(ROOT, file)
    const lines = extractText(file, readFileSync(file, 'utf8'))
    lines.forEach((line, i) => {
      if (!line.trim()) return
      const lower = line.toLowerCase()
      if (line.includes('—')) {
        console.error(`error  ${rel}:${i + 1}  em dash found. Use a full stop, comma or brackets.`)
        errors++
      }
      for (const word of BANNED) {
        const re = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, 'i')
        if (re.test(lower)) {
          console.error(`error  ${rel}:${i + 1}  avoid "${word}"`)
          errors++
        }
      }
      if (file.endsWith('.mdx') && !/^\s*[<{]/.test(line)) {
        for (const sentence of line.split(/(?<=[.!?]["”’)]?)\s+/)) {
          const words = sentence.replace(/[*_`#>[\]()]/g, '').trim().split(/\s+/).filter(Boolean)
          if (words.length > MAX_WORDS) {
            console.warn(`warn   ${rel}:${i + 1}  long sentence (${words.length} words): "${sentence.slice(0, 60)}..."`)
            warnings++
          }
        }
      }
    })
  }
}

console.log(`Content check: ${errors} error(s), ${warnings} warning(s).`)
process.exit(errors ? 1 : 0)
