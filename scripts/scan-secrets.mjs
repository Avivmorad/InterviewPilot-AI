import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { extname } from 'node:path'

const patterns = [
  {
    name: 'Google API key',
    pattern: /AIza[0-9A-Za-z_-]{35}/g,
  },
  {
    name: 'Groq API key',
    pattern: /gsk_[A-Za-z0-9_-]{20,}/g,
  },
  {
    name: 'OpenAI-style secret key',
    pattern: /sk-[A-Za-z0-9_-]{20,}/g,
  },
]

const textExtensions = new Set([
  '.cjs',
  '.css',
  '.env',
  '.gitignore',
  '.html',
  '.json',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
  '.yml',
  '.yaml',
])

function isTextFile(filePath) {
  const extension = extname(filePath).toLowerCase()

  return textExtensions.has(extension) || !extension
}

const trackedFiles = execFileSync('git', ['ls-files', '-z'], { encoding: 'buffer' })
  .toString('utf8')
  .split('\0')
  .filter(Boolean)

const findings = []

for (const filePath of trackedFiles) {
  if (!isTextFile(filePath)) {
    continue
  }

  const buffer = readFileSync(filePath)

  if (buffer.includes(0)) {
    continue
  }

  const content = buffer.toString('utf8')

  for (const { name, pattern } of patterns) {
    for (const match of content.matchAll(pattern)) {
      findings.push({
        filePath,
        name,
        value: match[0],
      })
    }
  }
}

if (findings.length > 0) {
  console.error('Potential secrets found:')
  for (const finding of findings) {
    console.error(`- ${finding.name} in ${finding.filePath}: ${finding.value}`)
  }
  process.exit(1)
}

console.log('No tracked secrets found.')
