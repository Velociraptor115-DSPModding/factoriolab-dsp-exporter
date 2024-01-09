import recipesR from '../../../dsp-data/recipes.json'
import itemsR from '../../../dsp-data/items.json'
import { mapping } from '../../../mapping'
import { parseGridIndex } from '../../utils/grid-index-parser'

const fractionatorMachines = itemsR.filter(x => x.prefabDesc.isFractionator)
const fractionatorMachinesRecipeType = [...new Set<string>(fractionatorMachines.map(x => x.prefabDesc.assemblerRecipeType!))]
const fractionatorMachinesRecipeTypeMap = Object.fromEntries(fractionatorMachinesRecipeType.map(recipeType => [
  recipeType,
  fractionatorMachines
    .filter(x => x.prefabDesc.assemblerRecipeType === recipeType)
    .sort((a, b) => a.ID - b.ID)
    .map(x => mapping.items[x.ID])
]))

function isComponentItemID(ID) {
  const gridIndex = itemsR.find(item => item.ID === ID)?.GridIndex ?? 0
  return gridIndex >= 1000 && gridIndex < 2000
}

function mapDspfractionatorRecipes(recipes) {
  return recipes.filter(x => fractionatorMachinesRecipeType.includes(x.Type)).map(x => {
    const factoriolabId = mapping.recipes[x.ID]
    const name = x.name
    const category = x.Results.every(isComponentItemID) ? "components" : "buildings"
    const isMining = undefined
    const isTechnology = undefined
    const unlockedBy = x.preTech?.ID ? mapping.techs[x.preTech.ID] : undefined
    const items = Object.fromEntries(x.Items.map((itemId, idx) => [mapping.items[itemId], x.ResultCounts[idx] / x.ItemCounts[idx]]))
    const results = Object.fromEntries(x.Results.map((itemId, idx) => [mapping.items[itemId], x.ResultCounts[idx] / x.ItemCounts[idx]]))
    const parsedGridIndex = parseGridIndex(x.GridIndex)
    const row = parsedGridIndex.row
    return {
      id: factoriolabId,
      name,
      cost: undefined,
      time: x.TimeSpend,
      in: items,
      out: results,
      producers: fractionatorMachinesRecipeTypeMap[x.Type],
      row,
      category,
      isMining,
      unlockedBy,
      isTechnology,
      parsedGridIndex,
    }
  })
}

export const fractionatorRecipes = mapDspfractionatorRecipes(recipesR)
