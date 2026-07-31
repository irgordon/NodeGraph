import { mkdir, open, rename, unlink } from 'fs/promises'
import * as path from 'path'
import { randomUUID } from 'crypto'

export interface AtomicWriteHooks {
  beforeReplace?(target: string, temporary: string): Promise<void>
}

export type AtomicWriteGuard = () => Promise<void>

export interface AtomicJsonWrite {
  target: string
  value: unknown
}

export class AtomicJsonWriter {
  constructor(private readonly hooks: AtomicWriteHooks = {}) {}

  public async write(
    target: string,
    value: unknown,
    guard?: AtomicWriteGuard
  ): Promise<void> {
    const content = `${JSON.stringify(value, null, 2)}\n`
    await this.writeText(target, content, guard)
  }

  public async writeText(
    target: string,
    content: string,
    guard?: AtomicWriteGuard
  ): Promise<void> {
    const temporary = buildTemporaryPath(target)
    await mkdir(path.dirname(target), { recursive: true })
    try {
      await writeAndFlush(temporary, content)
      await this.hooks.beforeReplace?.(target, temporary)
      await guard?.()
      await rename(temporary, target)
      await flushDirectory(path.dirname(target))
    } catch (error) {
      try {
        await removeTemporaryFile(temporary)
      } catch (cleanupError) {
        throw new AtomicWriteCleanupError(error, cleanupError)
      }
      throw error
    }
  }

  public async remove(target: string): Promise<void> {
    try {
      await unlink(target)
      await flushDirectory(path.dirname(target))
    } catch (error) {
      if (!isMissingFile(error)) throw error
    }
  }

  public async writeBatch(writes: AtomicJsonWrite[]): Promise<void> {
    const prepared = writes.map(prepareBatchWrite)
    try {
      await stageBatch(prepared)
      await this.verifyBatch(prepared)
      await replaceBatch(prepared)
    } catch (error) {
      await rollbackBatch(prepared, error)
      throw error
    }
    await cleanupBatch(prepared)
  }

  private async verifyBatch(writes: PreparedWrite[]): Promise<void> {
    for (const write of writes) {
      await this.hooks.beforeReplace?.(write.target, write.temporary)
    }
  }
}

interface PreparedWrite {
  target: string
  temporary: string
  backup: string
  content: string
  backedUp: boolean
  replaced: boolean
}

function buildTemporaryPath(target: string): string {
  const name = `.${path.basename(target)}.${randomUUID()}.tmp`
  return path.join(path.dirname(target), name)
}

function prepareBatchWrite(write: AtomicJsonWrite): PreparedWrite {
  return {
    target: write.target,
    temporary: buildTemporaryPath(write.target),
    backup: buildBackupPath(write.target),
    content: `${JSON.stringify(write.value, null, 2)}\n`,
    backedUp: false,
    replaced: false,
  }
}

function buildBackupPath(target: string): string {
  const name = `.${path.basename(target)}.${randomUUID()}.backup`
  return path.join(path.dirname(target), name)
}

async function stageBatch(writes: PreparedWrite[]): Promise<void> {
  for (const write of writes) {
    await mkdir(path.dirname(write.target), { recursive: true })
    await writeAndFlush(write.temporary, write.content)
  }
}

async function replaceBatch(writes: PreparedWrite[]): Promise<void> {
  for (const write of writes) {
    write.backedUp = await moveExistingTarget(write.target, write.backup)
    await rename(write.temporary, write.target)
    write.replaced = true
  }
}

async function moveExistingTarget(target: string, backup: string): Promise<boolean> {
  try {
    await rename(target, backup)
    return true
  } catch (error) {
    if (isMissingFile(error)) return false
    throw error
  }
}

async function rollbackBatch(writes: PreparedWrite[], originalError: unknown): Promise<void> {
  try {
    for (const write of [...writes].reverse()) await restoreBatchWrite(write)
  } catch (cleanupError) {
    throw new AtomicWriteCleanupError(originalError, cleanupError)
  }
}

async function restoreBatchWrite(write: PreparedWrite): Promise<void> {
  if (write.replaced) await removeTemporaryFile(write.target)
  if (write.backedUp) await rename(write.backup, write.target)
  await removeTemporaryFile(write.temporary)
}

async function cleanupBatch(writes: PreparedWrite[]): Promise<void> {
  for (const write of writes) {
    await removeTemporaryFile(write.temporary)
    await removeTemporaryFile(write.backup)
    await flushDirectory(path.dirname(write.target))
  }
}

export class AtomicWriteCleanupError extends Error {
  constructor(
    public readonly cause: unknown,
    public readonly cleanupCause: unknown
  ) {
    super('atomic-write-cleanup-failed')
  }
}

async function writeAndFlush(target: string, content: string): Promise<void> {
  const handle = await open(target, 'wx')
  try {
    await handle.writeFile(content, 'utf8')
    await handle.sync()
  } finally {
    await handle.close()
  }
}

async function flushDirectory(directory: string): Promise<void> {
  try {
    const handle = await open(directory, 'r')
    try {
      await handle.sync()
    } finally {
      await handle.close()
    }
  } catch {
    // Directory fsync is not supported on every platform.
  }
}

async function removeTemporaryFile(target: string): Promise<void> {
  try {
    await unlink(target)
  } catch (error) {
    if (!isMissingFile(error)) throw error
  }
}

function isMissingFile(error: unknown): boolean {
  return typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
}
