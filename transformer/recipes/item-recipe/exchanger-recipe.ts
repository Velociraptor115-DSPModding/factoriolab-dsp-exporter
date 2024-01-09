import recipesR from '../../../dsp-data/recipes.json'
import itemsR from '../../../dsp-data/items.json'
import { items as mappedFactoriolabItems } from '../../items'
import { mapping } from '../../../mapping'

const exchangerMachines = itemsR.filter(x => x.prefabDesc.isPowerExchanger)

export const exchangerRecipes = exchangerMachines.flatMap(exchanger => {
  const fullItem = itemsR.find(x => x.ID === exchanger.prefabDesc.fullId)!
  const emptyItem = itemsR.find(x => x.ID === exchanger.prefabDesc.emptyId)!
  const mappedFactoriolabExchanger = mappedFactoriolabItems.find(x => x.id === mapping.items[exchanger.ID])!
  const mappedFactoriolabFullItem = mappedFactoriolabItems.find(x => x.id === mapping.items[fullItem.ID])!
  const mappedFactoriolabEmptyItem = mappedFactoriolabItems.find(x => x.id === mapping.items[emptyItem.ID])!
  const exchangerMachineRecipe = recipesR.find(x => x.Results.includes(exchanger.ID))!
  const exchangerMachineRecipePreTech = exchangerMachineRecipe.preTech?.ID ? mapping.techs[exchangerMachineRecipe.preTech.ID] : undefined

  return [
    // Charging
    {
      id: mappedFactoriolabFullItem.id,
      name: fullItem.name,
      cost: undefined,
      time: (fullItem.prefabDesc.maxAcuEnergy! / exchanger.prefabDesc.exchangeEnergyPerTick!) / 60,
      in: {
        [mappedFactoriolabEmptyItem.id]: 1,
      },
      out: {
        [mappedFactoriolabFullItem.id]: 1,
      },
      producers: [
        mappedFactoriolabExchanger.id,
      ],
      row: mappedFactoriolabExchanger.row,
      category: mappedFactoriolabExchanger.category,
      unlockedBy: exchangerMachineRecipePreTech,
    },
    // Discharging
    {
      id: `${mappedFactoriolabEmptyItem.id}-discharge`,
      name: `${emptyItem.name} (Discharge)`,
      cost: undefined,
      time: (fullItem.prefabDesc.maxAcuEnergy! / exchanger.prefabDesc.exchangeEnergyPerTick!) / 60,
      in: {
        [mappedFactoriolabFullItem.id]: 1,
      },
      out: {
        [mappedFactoriolabEmptyItem.id]: 1,
      },
      producers: [
        mappedFactoriolabExchanger.id,
      ],
      usage: -(exchanger.prefabDesc.exchangeEnergyPerTick! * 60 / 1000),
      icon: mappedFactoriolabEmptyItem.id,
      row: mappedFactoriolabExchanger.row,
      category: mappedFactoriolabExchanger.category,
      unlockedBy: exchangerMachineRecipePreTech,
    }
  ]
})
