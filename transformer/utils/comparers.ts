import { compareBy } from './comparison'

export const compareFactoriolabArrayElements = compareBy([
  (x: any)  => x?.category ?? "",
  (x: any)  => x?.parsedGridIndex?.row ?? (x?.row + 1) ?? 0,
  (x: any)  => x?.parsedGridIndex?.column ?? 10000,
  (x: any)  => x?.existingIndex ?? 0,
  (x: any)  => x?.id ?? "",
])

export const compareFactoriolabCategoryAndIds = compareBy([
  (x: any)  => x?.category ?? "",
  (x: any)  => x?.id ?? "",
])
