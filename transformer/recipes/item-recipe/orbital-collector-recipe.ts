import itemsR from '../../../dsp-data/items.json'
import recipesR from '../../../dsp-data/recipes.json'
import themesR from '../../../dsp-data/themes.json'
import { mapping } from '../../../mapping'
import { parseGridIndex } from '../../utils/grid-index-parser'
import { performManualInterventions, alterIdTo } from '../../utils/manual-intervention'

const knownGasThemesToReferenceGasThemeMapping = {
  2: 2,
  3: 2,
  4: 4,
  5: 4,
  21: 2,
}

const referenceGasThemeFactoriolabIds = {
  2: 'gas-giant',
  4: 'ice-giant',
}

const referenceGasThemeFactoriolabNames = {
  2: 'Gas Giant',
  4: 'Ice Giant',
}

const orbitalCollectors = itemsR.filter(x => x.prefabDesc.isCollectStation)
const allGasThemes = themesR.filter(x => x.PlanetType === 'Gas')
const referenceGasThemes = allGasThemes.filter(x => (knownGasThemesToReferenceGasThemeMapping[x.ID] ?? x.ID) === x.ID)
const maxRowsInRecipe = recipesR.map(x => parseGridIndex(x.GridIndex ?? 0).row).reduce((a, b) => Math.max(a, b), 0)

const manualInterventions = {
  alterations: [
    {
      id: 'ice-giant-fire-ice',
      alter: alterIdTo('ice-giant-gas-hydrate')
    }
  ]
}

export const orbitalCollectorRecipes = performManualInterventions(orbitalCollectors.flatMap(orbitalCollector => {
  const stationCollectSpeed = orbitalCollector.prefabDesc.stationCollectSpeed!
  const collectorWorkEnergyPerSecond = orbitalCollector.prefabDesc.workEnergyPerTick! * 60
  // const collectorWorkCost = collectorWorkEnergyPerSecond / stationCollectSpeed
  const collectorWorkCost = 0

  const orbitalCollectorRecipe = recipesR.find(x => x.Results.includes(orbitalCollector.ID))!
  const orbitalCollectorRecipePreTech = orbitalCollectorRecipe.preTech?.ID ? mapping.techs[orbitalCollectorRecipe.preTech.ID] : undefined

  return referenceGasThemes.flatMap(referenceGasTheme => {
    const gasItems = referenceGasTheme.GasItems!.map(id => itemsR.find(x => x.ID === id)!)
    const gasTotalHeatValue = gasItems.map((gasItem, idx) => referenceGasTheme.GasSpeeds![idx] * gasItem.HeatValue!).reduce((a, b) => a + b, 0)

    const gasSpeeds = gasItems.map((gasItem, idx) => referenceGasTheme.GasSpeeds![idx] * stationCollectSpeed * (1 - (collectorWorkCost / gasTotalHeatValue)))

    const gasDetails = gasItems.map((gasItem, idx) => ({
      factoriolabId: mapping.items[gasItem.ID],
      name: gasItem.name,
      collectionPerSecond: Math.round(gasSpeeds[idx] * 1000) / 1000,
    }))

    return [
      // All items
      {
        category: "components",
        id: referenceGasThemeFactoriolabIds[referenceGasTheme.ID],
        name: referenceGasThemeFactoriolabNames[referenceGasTheme.ID],
        time: 1,
        in: {},
        out: Object.fromEntries(gasDetails.map(x => [ x.factoriolabId, x.collectionPerSecond ])),
        producers: [
          mapping.items[orbitalCollector.ID],
        ],
        row: maxRowsInRecipe + 1,
        icon: orbitalCollectorRecipePreTech,
        unlockedBy: orbitalCollectorRecipePreTech,
        isMining: true,
      },
      // Individiaul items
      ...(gasDetails.map(gasDetail => ({
        category: "components",
        id: `${referenceGasThemeFactoriolabIds[referenceGasTheme.ID]}-${gasDetail.factoriolabId}`,
        name: `${referenceGasThemeFactoriolabNames[referenceGasTheme.ID]} (${gasDetail.name})`,
        time: 1,
        in: {},
        out: {
          [gasDetail.factoriolabId]: gasDetail.collectionPerSecond
        },
        producers: [
          mapping.items[orbitalCollector.ID],
        ],
        row: maxRowsInRecipe + 1,
        icon: orbitalCollectorRecipePreTech,
        unlockedBy: orbitalCollectorRecipePreTech,
        isMining: true,
      })))
    ]
  })
}), manualInterventions)

