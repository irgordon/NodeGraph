#!/usr/bin/env node
'use strict'

const esbuild = require('esbuild')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')

const temporaryRoot = fs.mkdtempSync(
  path.join(os.tmpdir(), 'nodegraph-phase2-tests-')
)
const bundlePath = path.join(temporaryRoot, 'phase2.test.cjs')

try {
  esbuild.buildSync({
    entryPoints: [path.join(process.cwd(), 'tools', 'phase2.test.ts')],
    outfile: bundlePath,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node20',
    sourcemap: 'inline',
  })
  const result = spawnSync(process.execPath, ['--test', bundlePath], {
    cwd: process.cwd(),
    stdio: 'inherit',
  })
  process.exitCode = result.status ?? 1
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true })
}
