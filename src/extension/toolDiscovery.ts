import { spawnSync } from 'child_process'

const TOOL_TIMEOUT_MS = 5000

export function runTool(command: string, args: string[]): string {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    shell: false,
    timeout: TOOL_TIMEOUT_MS,
    windowsHide: true,
  })
  if (result.error || result.status !== 0) return ''
  return [result.stdout, result.stderr]
    .filter(Boolean)
    .join('\n')
    .trim()
}

export function checkTool(command: string, args: string[]): boolean {
  return runTool(command, args) !== ''
}
