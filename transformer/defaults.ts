import { items } from "./items"
import itemsR from "../dsp-data/items.json"
import { mapping } from "../mapping"

const belts = items.filter(x => x.belt?.speed > 0 && x.category === "buildings")
const minBelt = belts.reduce((a, b) => a.belt.speed < b.belt.speed ? a : b).id
const maxBelt = belts.reduce((a, b) => a.belt.speed > b.belt.speed ? a : b).id

function equalArrayValues<T>(a: T[], b: T[]) {
  return (a.length === b.length) && a.every(x => b.includes(x))
}

const machinesWithUpgrades = (
  itemsR
    .filter(x => x.Upgrades?.length ?? 0 > 0)
    .filter(x => !x.prefabDesc.isBelt && !x.prefabDesc.isInserter)
    .map(x => ({
      items: x.Upgrades!.map(y => mapping.items[y]),
    }))
    .filter((x, idx, arr) => arr.findIndex(y => equalArrayValues(x.items, y.items)) === idx)
    .map(x => ({
      items: x.items,
      min: x.items[0],
      max: x.items[x.items.length - 1],
    }))
)

export const defaults = {
  modIds: [],
  minBelt,
  maxBelt,
  fuel: "coal",
  excludedRecipes: [
    "ice-giant",
    "carbon-nanotube-advanced",
    "particle-container-advanced",
    "photon-combiner-advanced",
    "crystal-silicon-advanced",
    "critical-photon-graviton",
    "casimir-crystal-advanced",
    "diamond-advanced",
    "gas-giant",
    "graphene-advanced",
    "fire-ice-vein",
    "x-ray-cracking",
    "organic-crystal-original",
    "silicon-ore"
  ],
  minMachineRank: machinesWithUpgrades.map(x => x.min),
  maxMachineRank: machinesWithUpgrades.map(x => x.max),
  moduleRank: [
    "proliferator-3-products"
  ]
}
