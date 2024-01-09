import recipesR from '../../../dsp-data/recipes.json'
import itemsR from '../../../dsp-data/items.json'
import { mapping } from '../../../mapping'
import { parseGridIndex } from '../../utils/grid-index-parser'
import { performManualInterventions } from '../../utils/manual-intervention'

const researchRecipeType = "Research"
const assemblerMachines = itemsR.filter(x => x.prefabDesc.isAssembler || x.prefabDesc.isLab)
const assemblerMachinesRecipeType = [...new Set<string>(assemblerMachines.map(x => x.prefabDesc.isLab ? researchRecipeType : x.prefabDesc.assemblerRecipeType!))]
const assemblerMachinesRecipeTypeMap = Object.fromEntries(assemblerMachinesRecipeType.map(recipeType => [
  recipeType,
  assemblerMachines
    .filter(x => (x.prefabDesc.isLab ? researchRecipeType : x.prefabDesc.assemblerRecipeType) === recipeType)
    .sort((a, b) => a.ID - b.ID)
    .map(x => mapping.items[x.ID])
]))

function isComponentItemID(ID) {
  const gridIndex = itemsR.find(item => item.ID === ID)?.GridIndex ?? 0
  return gridIndex >= 1000 && gridIndex < 2000
}

function mapDspAssemblerRecipes(recipes) {
  return recipes.filter(x => assemblerMachinesRecipeType.includes(x.Type)).map(x => {
    const factoriolabId = mapping.recipes[x.ID]
    const name = x.name
    const category = x.Results.every(isComponentItemID) ? "components" : "buildings"
    const isMining = undefined
    const isTechnology = undefined
    const unlockedBy = x.preTech?.ID ? mapping.techs[x.preTech.ID] : undefined
    const items = Object.fromEntries(x.Items.map((itemId, idx) => [mapping.items[itemId], x.ItemCounts[idx]]))
    const results = Object.fromEntries(x.Results.map((itemId, idx) => [mapping.items[itemId], x.ResultCounts[idx]]))
    const parsedGridIndex = parseGridIndex(x.GridIndex)
    const row = parsedGridIndex.row
    return {
      id: factoriolabId,
      name,
      cost: undefined,
      time: x.TimeSpend / 60,
      in: items,
      out: results,
      producers: assemblerMachinesRecipeTypeMap[x.Type],
      row,
      category,
      isMining,
      unlockedBy,
      isTechnology,
      parsedGridIndex,
    }
  })
}

const manualInterventions = {
  alterations: [
    {
      id: "mass-energy-storage",
      alter: x => ({ ...x, cost: 100 })
    }
  ]
}

export const assemblerRecipes = performManualInterventions(mapDspAssemblerRecipes(recipesR), manualInterventions)
