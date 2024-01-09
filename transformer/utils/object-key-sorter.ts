type KeyValue = {
  key: string
  value: any
}

export function keyOrder(keys: string[]) {
  return function compareKeyValue(a: KeyValue, b: KeyValue) {
    const aIndex = keys.indexOf(a.key)
    const bIndex = keys.indexOf(b.key)
    if (aIndex === -1 && bIndex === -1) {
      return a.key.localeCompare(b.key)
    }
    if (aIndex === -1) {
      return 1
    }
    if (bIndex === -1) {
      return -1
    }
    return aIndex - bIndex
  }
}
