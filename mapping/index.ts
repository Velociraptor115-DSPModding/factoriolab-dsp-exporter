import { factoriolabPath, useFactoriolabMapping } from "../external-dependencies";
import { join } from "node:path"
import { readFileSync } from "node:fs"

import type { DspItemId, DspRecipeId, DspTechId, FactorioLabId } from "../types";


export type DspFactorioLabMappingEntry<K extends string | number, V> = {
  [k in K]: V
}

export type DspFactorioLabMapping = {
  recipes: DspFactorioLabMappingEntry<DspRecipeId, FactorioLabId>
  items: DspFactorioLabMappingEntry<DspItemId, FactorioLabId>
  techs: DspFactorioLabMappingEntry<DspTechId, FactorioLabId>
}

function loadMappingJson(mapFilePath) {
  const mappingDataStr = readFileSync(mapFilePath, { encoding: 'utf8' })
  return JSON.parse(mappingDataStr) as DspFactorioLabMapping
}

const mapFilePath = (
  useFactoriolabMapping
    ? join(factoriolabPath, 'src', 'data', 'dsp', 'map.json')
    : join(__dirname, 'dsp-factoriolab-mapping.json')
)

export const mapping = loadMappingJson(mapFilePath)
