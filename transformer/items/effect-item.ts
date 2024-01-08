import cargo from "../../dsp-data/cargo.json"
import items from "../../dsp-data/items.json"
import { mapping } from "../../mapping"

const sprayCoaters = items.filter(x => x.prefabDesc.isSpraycoster)
const incItemIds = sprayCoaters.flatMap(x => x.prefabDesc.incItemId)
const incItems = items.filter(x => incItemIds.includes(x.ID))

type ProliferatorItem = typeof incItems[number]

const commonEffects = {
  module: {
    consumption: (inc: ProliferatorItem) => cargo.powerTable[inc.Ability!] / 1000,
    sprays: (inc: ProliferatorItem) => inc.HpMax,
    proliferator: (inc: ProliferatorItem) => mapping.items[inc.ID],
  }
}

const effects = {
  "products": {
    nameExt: "Products",
    module: {
      ...commonEffects.module,
      productivity: (inc: ProliferatorItem) => cargo.incTableMilli[inc.Ability!],
      limitation: (inc: ProliferatorItem) => "productivity",
    }
  },
  "speed": {
    nameExt: "Speedup",
    module: {
      ...commonEffects.module,
      speed: (inc: ProliferatorItem) => cargo.accTableMilli[inc.Ability!],
    }
  }
}

export const effectItems = Object.entries(effects).flatMap(([effectId, effect]) => incItems.map(inc => ({
  category: "effects",
  id: `${mapping.items[inc.ID]}-${effectId}`,
  name: `${inc.name} (${effect.nameExt})`,
  module: Object.fromEntries(Object.entries(effect.module).map(([prop, fn]) => [prop, fn(inc) ])),
})))
