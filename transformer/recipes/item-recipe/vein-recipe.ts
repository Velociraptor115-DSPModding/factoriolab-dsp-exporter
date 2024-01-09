import items from "../../../dsp-data/items.json"
import veins from "../../../dsp-data/veins.json"
import { mapping } from "../../../mapping"

const veinMiningMachines = (
  items
    .filter(x => x.prefabDesc.minerType === "Vein")
    .sort((a, b) => a.ID - b.ID)
    .map(x => mapping.items[x.ID])
)

const oilExtractorMachines = (
  items
    .filter(x => x.prefabDesc.minerType === "Oil")
    .sort((a, b) => a.ID - b.ID)
    .map(x => mapping.items[x.ID])
)

const oilSeepId = 7
const oilSeep = veins.find(x => x.ID === oilSeepId)!

const rareVeinIds = Object.keys(mapping.veins).map(x => parseInt(x)).filter(x => x >= 8)

export const veinMiningRecipes = [
  ...veins.filter(x => x.ID !== oilSeepId).map(vein => ({
    id: mapping.veins[vein.ID],
    name: vein.name,
    cost: rareVeinIds.includes(vein.ID) ? 200 : 100,
    time: 2,
    in: {},
    out: {
      [mapping.items[vein.MiningItem]]: 1
    },
    producers: veinMiningMachines,
    row: 0,
    category: "components",
    isMining: true,
  })),
  {
    id: mapping.veins[oilSeepId],
    name: oilSeep.name,
    cost: 100,
    time: 1,
    in: {},
    out: {
      [mapping.items[oilSeep.MiningItem]]: 1
    },
    producers: oilExtractorMachines,
    row: 0,
    category: "components",
    isMining: true,
  }
]

