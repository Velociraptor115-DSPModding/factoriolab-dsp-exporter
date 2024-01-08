import itemsR from '../../dsp-data/items.json'
import { mapping } from '../../mapping'
import { parseGridIndex } from '../utils/grid-index-parser'

const gravitonLensId = 'graviton-lens'
const gravitonLensFuel = {
  "category": "lens",
  "value": 1
}

function genFuel(id: string, fuelType?: number, heatValue?: { value: string }) {
  if (id === gravitonLensId) {
    return gravitonLensFuel
  }
  const category = (
    fuelType === 1 ? "chemical" :
    fuelType === 2 ? "nuclear" :
    fuelType === 4 ? "antimatter" :
    fuelType === 8 ? "accumulator" :
    undefined
  )
  if (category) {
    return {
      category,
      value: Number(heatValue!.value) / 1000000
    }
  }
}

function mapDspComponents(items) {
  return items.filter(x => x.GridIndex >= 1000 && x.GridIndex < 2000).map(x => {
    const factoriolabId = mapping.items[x.ID]
    const name = x.name
    const page = Math.floor(x.GridIndex / 1000)
    const row = Math.floor((x.GridIndex - (page * 1000)) / 100) - 1
    const fuel = genFuel(factoriolabId, x.FuelType, { value: x.HeatValue })
    return {
      category: "components",
      id: factoriolabId,
      name,
      row,
      stack: x.StackSize,
      fuel,
      parsedGridIndex: parseGridIndex(x.GridIndex)
    }
  })
}

export const componentItems = mapDspComponents(itemsR)
