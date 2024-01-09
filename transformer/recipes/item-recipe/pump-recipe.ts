import items from '../../../dsp-data/items.json'
import themes from '../../../dsp-data/themes.json'
import { mapping } from '../../../mapping'

const allWaterItemIds = themes.map(x => x.WaterItemId).filter(x => x && x > 0).filter((x, idx, arr) => arr.indexOf(x) === idx)
const waterItems = allWaterItemIds.map(waterItemId => items.find(x => x.ID === waterItemId)!)

const startingWaterItemIds = [
  1000
]

const pumpRecipeIdMap = {
  1000: 'ocean',
  1116: 'sulphuric-acid-vein',
}

const pumpRecipeNameMap = {
  1000: 'Ocean',
  1116: 'Sulphuric Acid Ocean',
}

const pumpMachines = (
  items
    .filter(x => x.prefabDesc.minerType === "Water")
    .sort((a, b) => a.ID - b.ID)
    .map(x => mapping.items[x.ID])
)

export const pumpRecipes = waterItems.map(waterItem => ({
  id: pumpRecipeIdMap[waterItem.ID] ?? mapping.items[waterItem.ID],
  name: pumpRecipeNameMap[waterItem.ID] ?? waterItem.name,
  cost: startingWaterItemIds.includes(waterItem.ID) ? 1 : 100,
  time: 1.2,
  in: {},
  out: {
    [mapping.items[waterItem.ID]]: 1
  },
  producers: pumpMachines,
  row: 0,
  category: "components",
  isMining: true,
}))
