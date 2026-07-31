export function cleanMetadataValue(value: string): string {
  return value.normalize('NFC').trim()
}

export function cleanMetadataValues(values: string[]): string[] {
  const unique = new Map<string, string>()
  for (const value of values) {
    const cleaned = cleanMetadataValue(value)
    const key = normalizeMetadataSearch(cleaned)
    if (cleaned && !unique.has(key)) unique.set(key, cleaned)
  }
  return [...unique.values()]
}

export function normalizeMetadataSearch(value: string): string {
  return cleanMetadataValue(value).toLowerCase()
}
