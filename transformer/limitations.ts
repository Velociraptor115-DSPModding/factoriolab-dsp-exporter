import { recipes } from "./recipes"
import recipesR from "../dsp-data/recipes.json"
import { mapping } from '../mapping'

const recipeMapping = Object.entries(mapping.recipes)
function recipeDspIdForFactorioLabId(factorioLabId: string): number | undefined {
    const match = recipeMapping.find(([ dspId, facId]) => facId === factorioLabId)
    if (match) {
        return Number(match[0])
    }
}

const idsToManuallyRemove = [
    "accumulator-discharge",
    "critical-photon",
    "critical-photon-graviton",
    "deuterium-fractionation",
]

export const limitations = {
    productivity: recipes.filter(recipe => {
        const dspId = recipeDspIdForFactorioLabId(recipe.id)
        if (!dspId) {
            return true
        }
        const recipeR = recipesR.find(x => x.ID === dspId)
        if (!recipeR) {
            return true
        }
        if (!recipeR.productive) {
            return false
        }
        return true
    }).map(x => x.id).filter(x => !idsToManuallyRemove.includes(x)).sort()
}
