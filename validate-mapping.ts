import { mapping } from "./mapping";
import items from './dsp-data/items.json'
import recipes from './dsp-data/recipes.json'
import techs from './dsp-data/techs.json'

function sortNullableNumber(a, b) {
  const aId = a ? a : 1000000
  const bId = b ? b : 1000000
  if (aId < bId) {
      return -1
  } else if (aId > bId) {
      return 1
  } else {
      return 0
  }
}

const itemIds = items.map(x => x.ID).sort(sortNullableNumber)
const recipeIds = recipes.map(x => x.ID).sort(sortNullableNumber)
const techIds = techs.map(x => x.ID).sort(sortNullableNumber)

const mappingDspItemIds = Object.keys(mapping.items).map(x => parseInt(x)).sort(sortNullableNumber)
const mappingDspRecipeIds = Object.keys(mapping.recipes).map(x => parseInt(x)).sort(sortNullableNumber)
const mappingDspTechIds = Object.keys(mapping.techs).map(x => parseInt(x)).sort(sortNullableNumber)

console.log('Unmapped DSP Item Ids - BEGIN')
console.log(itemIds.filter(x => !mappingDspItemIds.includes(x)).join('\n'))
console.log('Unmapped DSP Item Ids - END')

console.log('Unmapped DSP Recipe Ids - BEGIN')
console.log(recipeIds.filter(x => !mappingDspRecipeIds.includes(x)).join('\n'))
console.log('Unmapped DSP Recipe Ids - END')

console.log('Unmapped DSP Tech Ids - BEGIN')
console.log(techIds.filter(x => !mappingDspTechIds.includes(x)).join('\n'))
console.log('Unmapped DSP Tech Ids - END')
