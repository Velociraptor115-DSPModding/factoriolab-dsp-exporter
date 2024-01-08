export type CompareFn<T> = (a: T, b: T) => number
export type Projection<T> = (x: T) => string | number | boolean

export function compare<T>(comparers: CompareFn<T>[]): CompareFn<T> {
  return function compositeComparer(a: T, b: T) {
    let cmp = 0
    for (const comparer of comparers) {
      cmp = comparer(a, b)
      if (cmp != 0) {
        return cmp
      }
    }
    return cmp
  }
}

export function compareBy<T>(projections: Projection<T>[]): CompareFn<T> {
  return function compositeComparer(a: T, b: T) {
    let cmp = 0
    for (const projection of projections) {
      cmp = defaultCompare(projection(a), projection(b))
      if (cmp != 0) {
        return cmp
      }
    }
    return cmp
  }
}

function defaultCompare<T extends string | number | boolean>(a: T, b: T) {
  if (typeof a === "string" || typeof b === "string") {
    return defaultCompareString(String(a), String(b))
  }
  return defaultCompareNumber(Number(a), Number(b))
}

function defaultCompareNumber(a: number, b: number): number {
  return a - b
}

function defaultCompareString(a: string, b: string): number {
  return a.localeCompare(b)
}
