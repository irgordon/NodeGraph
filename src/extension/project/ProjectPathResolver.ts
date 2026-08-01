import { access, lstat, realpath } from 'fs/promises'
import * as path from 'path'

type PathOperations = Pick<typeof path, 'isAbsolute' | 'relative' | 'sep'>

export class ProjectPathError extends Error {
  constructor(public readonly code: string, candidate: string) {
    super(`${code}: ${candidate}`)
  }
}

export class ProjectPathResolver {
  public async canonicalRoot(projectRoot: string): Promise<string> {
    return realpath(projectRoot)
  }

  public async resolve(
    projectRoot: string,
    candidate: string,
    requireExisting = false
  ): Promise<string> {
    assertProjectRelativeSyntax(candidate)
    const canonicalRoot = await this.canonicalRoot(projectRoot)
    const lexicalTarget = resolveLexicalTarget(canonicalRoot, candidate)
    const canonicalTarget = await resolveCanonicalTarget(lexicalTarget)
    assertContained(canonicalRoot, canonicalTarget, candidate)
    if (requireExisting) await access(canonicalTarget)
    return canonicalTarget
  }

  public async resolveFromFile(
    projectRoot: string,
    containingFile: string,
    relativeReference: string,
    requireExisting = false
  ): Promise<{ relativePath: string; target: string }> {
    assertProjectRelativeSyntax(containingFile)
    assertProjectRelativeSyntax(relativeReference)
    const relativePath = joinFromContainingFile(containingFile, relativeReference)
    const target = await this.resolve(projectRoot, relativePath, requireExisting)
    return { relativePath, target }
  }
}

export function assertProjectRelativeSyntax(candidate: string): void {
  if (!candidate) throw new ProjectPathError('invalid-project-path', candidate)
  if (path.posix.isAbsolute(candidate) || path.win32.isAbsolute(candidate)) {
    throw new ProjectPathError('absolute-path', candidate)
  }
  if (candidate.includes('\\') || candidate.includes('\0')) {
    throw new ProjectPathError('invalid-project-path', candidate)
  }
  if (candidate.split('/').some(isUnsafeSegment)) {
    throw new ProjectPathError('path-traversal', candidate)
  }
}

function resolveLexicalTarget(canonicalRoot: string, candidate: string): string {
  const target = path.resolve(canonicalRoot, ...candidate.split('/'))
  assertContained(canonicalRoot, target, candidate)
  return target
}

function joinFromContainingFile(containingFile: string, relativeReference: string): string {
  const directory = path.posix.dirname(containingFile)
  return directory === '.'
    ? relativeReference
    : path.posix.join(directory, relativeReference)
}

function isUnsafeSegment(segment: string): boolean {
  return segment === '' || segment === '.' || segment === '..'
}

async function resolveCanonicalTarget(target: string): Promise<string> {
  const ancestor = await findExistingAncestor(target)
  const canonicalAncestor = await realpath(ancestor)
  return path.resolve(canonicalAncestor, path.relative(ancestor, target))
}

async function findExistingAncestor(target: string): Promise<string> {
  let candidate = target
  while (!(await exists(candidate))) candidate = path.dirname(candidate)
  return candidate
}

async function exists(candidate: string): Promise<boolean> {
  try {
    await lstat(candidate)
    return true
  } catch {
    return false
  }
}

function assertContained(root: string, target: string, candidate: string): void {
  if (!isPathContained(root, target)) {
    throw new ProjectPathError('path-outside-project', candidate)
  }
}

export function isPathContained(
  root: string,
  target: string,
  operations: PathOperations = path
): boolean {
  const relative = operations.relative(root, target)
  return relative !== '..' &&
    !relative.startsWith(`..${operations.sep}`) &&
    !operations.isAbsolute(relative)
}
