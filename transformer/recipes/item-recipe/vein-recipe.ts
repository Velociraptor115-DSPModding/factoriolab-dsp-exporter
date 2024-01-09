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

const veinFactoriolabIdMapping = {
  1: 'iron-vein',
  2: 'copper-vein',
  3: 'silicium-vein',
  4: 'titanium-vein',
  5: 'stone-vein',
  6: 'coal-vein',
  7: 'crude-oil-seep',
  8: 'fire-ice-vein',
  9: 'kimberlite-vein',
  10: 'fractal-silicon-vein',
  11: 'organic-crystal-vein',
  12: 'optical-grating-crystal-vein',
  13: 'spiniform-stalagmite-crystal-vein',
  14: 'unipolar-magnet-vein',
}

const rareVeinIds = Object.keys(veinFactoriolabIdMapping).map(x => parseInt(x)).filter(x => x >= 8)

export const veinMiningRecipes = [
  ...veins.filter(x => x.ID !== oilSeepId).map(vein => ({
    id: veinFactoriolabIdMapping[vein.ID],
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
    id: veinFactoriolabIdMapping[oilSeepId],
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

