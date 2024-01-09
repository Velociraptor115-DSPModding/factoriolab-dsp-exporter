import { readFileSync, writeFileSync } from 'node:fs'
import { data } from '../transformer/data'
import { compareFactoriolabArrayElements, compareFactoriolabCategoryAndIds } from '../transformer/utils/comparers'
import { stableStringify } from '../transformer/utils/stable-stringify'

function introduceExistingIndex(data) {
  return {
    ...data,
    items: data.items.map((x, i) => ({ ...x, existingIndex: i })),
    recipes: data.recipes.map((x, i) => ({ ...x, existingIndex: i })),
  }
}

function normalizeData(data, sortFn) {
  const items = [...data.items].sort(sortFn).map(x => ({ ...x, parsedGridIndex: undefined, existingIndex: undefined }))
  const recipes = [...data.recipes].sort(sortFn).map(x => ({ ...x, parsedGridIndex: undefined, existingIndex: undefined }))
  const icons = [...data.icons].sort(sortFn)
  const limitations = {
    productivity: [...data.limitations.productivity].sort()
  }
  const defaults = {
    ...data.defaults,
    minMachineRank: [...data.defaults.minMachineRank].sort(),
    maxMachineRank: [...data.defaults.maxMachineRank].sort(),
    moduleRank: [...data.defaults.moduleRank].sort(),
    excludedRecipes: [...data.defaults.excludedRecipes].sort(),
  }

  return {
    ...data,
    items,
    recipes,
    icons,
    limitations,
    defaults
  }
}

function adjustForCompare(data) {
  return {
    ...data,
    items: data.items.map(x => ({ ...x, name: undefined, stack: undefined, row: undefined })),
    // items: data.items.map(x => ({ id: x.id, name: x.name?.toLowerCase() })),
    // items: [ ],
    icons: [ ],
    recipes: data.recipes.map(x => ({ ...x, name: undefined, row: undefined, producers: x.producers[0] })),
    // recipes: data.recipes.map(x => ({ id: x.id, producers: x.producers })),
    // recipes: [ ],
    // limitations: { },
    // version: undefined,
    // defaults: undefined
  }
}

const dataJson = stableStringify(adjustForCompare(normalizeData(data, compareFactoriolabArrayElements)))
writeFileSync('./compare/generated-data.json', dataJson)
const dataJsonIdOrdered = stableStringify(adjustForCompare(normalizeData(data, compareFactoriolabCategoryAndIds)))
writeFileSync('./compare/generated-data-id-ordered.json', dataJsonIdOrdered)

const factoriolabRawJson = JSON.parse(readFileSync('./factoriolab.json', { encoding: 'utf8' }))
const factoriolabJson = stableStringify(adjustForCompare(normalizeData(introduceExistingIndex(factoriolabRawJson), compareFactoriolabArrayElements)))
writeFileSync('./compare/factoriolab-data.json', factoriolabJson)
const factoriolabJsonIdOrdered = stableStringify(adjustForCompare(normalizeData(introduceExistingIndex(factoriolabRawJson), compareFactoriolabCategoryAndIds)))
writeFileSync('./compare/factoriolab-data-id-ordered.json', factoriolabJsonIdOrdered)
