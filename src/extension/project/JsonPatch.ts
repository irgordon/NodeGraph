import { canonicalJson } from './canonical'
import { JsonValue, MutationOperation } from './types'

export class JsonPatchError extends Error {
  constructor(public readonly code: string, public readonly pointer: string) {
    super(`${code}: ${pointer}`)
  }
}

export function applyJsonPatch(document: unknown, operations: MutationOperation[]): unknown {
  let candidate = cloneJson(document)
  for (const operation of operations) candidate = applyOperation(candidate, operation)
  return candidate
}

function applyOperation(document: unknown, operation: MutationOperation): unknown {
  if (operation.path === '') return applyRootOperation(document, operation)
  const segments = parsePointer(operation.path)
  const parent = resolveParent(document, segments, operation.path)
  const key = segments[segments.length - 1]
  if (operation.op === 'add') return applyAdd(document, parent, key, operation)
  if (operation.op === 'remove') return applyRemove(document, parent, key, operation.path)
  if (operation.op === 'replace') return applyReplace(document, parent, key, operation)
  applyTest(parent, key, operation)
  return document
}

function applyRootOperation(document: unknown, operation: MutationOperation): unknown {
  if (operation.op === 'remove') throw new JsonPatchError('root-remove-forbidden', operation.path)
  if (operation.op === 'test') {
    if (!equalJson(document, operation.value)) throw new JsonPatchError('test-failed', operation.path)
    return document
  }
  return cloneJson(operation.value)
}

function parsePointer(pointer: string): string[] {
  if (!pointer.startsWith('/')) throw new JsonPatchError('invalid-json-pointer', pointer)
  return pointer.slice(1).split('/').map(segment => validateSegment(decodeSegment(segment), pointer))
}

function decodeSegment(segment: string): string {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~')
}

function validateSegment(segment: string, pointer: string): string {
  if (['__proto__', 'prototype', 'constructor'].includes(segment)) {
    throw new JsonPatchError('unsafe-json-pointer', pointer)
  }
  return segment
}

function resolveParent(document: unknown, segments: string[], pointer: string): unknown {
  let current = document
  for (const segment of segments.slice(0, -1)) current = readChild(current, segment, pointer)
  return current
}

function readChild(parent: unknown, key: string, pointer: string): unknown {
  if (Array.isArray(parent)) return parent[parseArrayIndex(key, parent.length, pointer)]
  if (isObject(parent) && hasOwn(parent, key)) return parent[key]
  throw new JsonPatchError('path-not-found', pointer)
}

function applyAdd(
  document: unknown,
  parent: unknown,
  key: string,
  operation: MutationOperation
): unknown {
  if (Array.isArray(parent)) parent.splice(parseAddIndex(key, parent.length, operation.path), 0, cloneJson(operation.value))
  else if (isObject(parent)) parent[key] = cloneJson(operation.value)
  else throw new JsonPatchError('invalid-patch-parent', operation.path)
  return document
}

function applyRemove(document: unknown, parent: unknown, key: string, pointer: string): unknown {
  if (Array.isArray(parent)) parent.splice(parseArrayIndex(key, parent.length, pointer), 1)
  else if (isObject(parent) && hasOwn(parent, key)) delete parent[key]
  else throw new JsonPatchError('path-not-found', pointer)
  return document
}

function applyReplace(
  document: unknown,
  parent: unknown,
  key: string,
  operation: MutationOperation
): unknown {
  ensureChildExists(parent, key, operation.path)
  if (Array.isArray(parent)) parent[parseArrayIndex(key, parent.length, operation.path)] = cloneJson(operation.value)
  else if (isObject(parent)) parent[key] = cloneJson(operation.value)
  return document
}

function applyTest(parent: unknown, key: string, operation: MutationOperation): void {
  const actual = readChild(parent, key, operation.path)
  if (!equalJson(actual, operation.value)) throw new JsonPatchError('test-failed', operation.path)
}

function ensureChildExists(parent: unknown, key: string, pointer: string): void {
  if (Array.isArray(parent)) {
    parseArrayIndex(key, parent.length, pointer)
    return
  }
  if (!isObject(parent) || !hasOwn(parent, key)) throw new JsonPatchError('path-not-found', pointer)
}

function parseAddIndex(key: string, length: number, pointer: string): number {
  if (key === '-') return length
  const index = Number(key)
  if (!Number.isInteger(index) || index < 0 || index > length) {
    throw new JsonPatchError('invalid-array-index', pointer)
  }
  return index
}

function parseArrayIndex(key: string, length: number, pointer: string): number {
  const index = Number(key)
  if (!Number.isInteger(index) || index < 0 || index >= length) {
    throw new JsonPatchError('invalid-array-index', pointer)
  }
  return index
}

function cloneJson(value: unknown): unknown {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value)) as JsonValue
}

function equalJson(left: unknown, right: unknown): boolean {
  return canonicalJson(left) === canonicalJson(right)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function hasOwn(value: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key)
}
