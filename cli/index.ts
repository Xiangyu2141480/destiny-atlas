#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { generateDestinyReport } from '../src/engines/report'
import type { BirthInput } from '../src/types'

const [, , inputPath, outputPath] = process.argv
if (!inputPath) {
  console.error('Usage: npm run cli -- <input.json> [output.json]')
  process.exit(1)
}

try {
  const input = JSON.parse(await readFile(resolve(inputPath), 'utf8')) as BirthInput
  const report = generateDestinyReport(input)
  const json = `${JSON.stringify(report, null, 2)}\n`
  if (outputPath) {
    await writeFile(resolve(outputPath), json, 'utf8')
    console.error(`Destiny Atlas report written to ${resolve(outputPath)}`)
  } else {
    process.stdout.write(json)
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(2)
}
