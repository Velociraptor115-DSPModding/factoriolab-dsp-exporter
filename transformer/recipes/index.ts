import { compareFactoriolabArrayElements } from '../utils/comparers'
import { assemblerRecipes } from './item-recipe/assembler-recipe'
import { fractionatorRecipes } from './item-recipe/fractionator-recipe'
import { exchangerRecipes } from './item-recipe/exchanger-recipe'
import { rayReceiverRecipes } from './item-recipe/ray-receiver-recipe'
import { orbitalCollectorRecipes } from './item-recipe/orbital-collector-recipe'
import { veinMiningRecipes } from './item-recipe/vein-recipe'
import { pumpRecipes } from './item-recipe/pump-recipe'
import { techRecipes } from './tech-recipe'


export const recipes = [
  ...assemblerRecipes,
  ...fractionatorRecipes,
  ...exchangerRecipes,
  ...rayReceiverRecipes,
  ...orbitalCollectorRecipes,
  ...veinMiningRecipes,
  ...pumpRecipes,
  ...techRecipes,
].sort(compareFactoriolabArrayElements)
