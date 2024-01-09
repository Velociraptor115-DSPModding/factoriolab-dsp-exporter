import itemsR from '../../../dsp-data/items.json'
import { items as mappedFactoriolabItems } from '../../items'
import { mapping } from '../../../mapping'
import { performManualInterventions, alterIdTo } from '../../utils/manual-intervention'

const rayReceivers = itemsR.filter(x => x.prefabDesc.gammaRayReceiver)

const manualInterventions = {
  alterations: [
    {
      id: 'critical-photon-graviton-lens',
      alter: alterIdTo('critical-photon-graviton')
    },
  ]
}

export const rayReceiverRecipes = performManualInterventions(rayReceivers.flatMap(rayReceiver => {
  const product = itemsR.find(x => x.ID === rayReceiver.prefabDesc.powerProductId)!
  const catalyst = itemsR.find(x => x.ID === rayReceiver.prefabDesc.powerCatalystId)!
  const mappedFactoriolabProduct = mappedFactoriolabItems.find(x => x.id === mapping.items[product.ID])!
  const mappedFactoriolabCatalyst = mappedFactoriolabItems.find(x => x.id === mapping.items[catalyst.ID])!

  const powerRequiredInKW = 2.5 * 8 * (rayReceiver.prefabDesc.genEnergyPerTick! * 60 / 1000)
  const powerRequiredInKWWithCatalyst = 2 * powerRequiredInKW

  return [
    // Regular
    {
      id: mappedFactoriolabProduct.id,
      name: product.name,
      cost: 100,
      time: ((rayReceiver.prefabDesc.powerProductHeat! / 1000) / powerRequiredInKW),
      in: {},
      out: {
        [mapping.items[product.ID]]: 1,
      },
      producers: [
        mapping.items[rayReceiver.ID],
      ],
      row: mappedFactoriolabProduct.row,
      category: mappedFactoriolabProduct.category,
      unlockedBy: mapping.techs[product.preTech!.ID],
    },
    // With Catalyst
    {
      id: `${mappedFactoriolabProduct.id}-${mappedFactoriolabCatalyst.id}`,
      name: `${product.name} (${catalyst.name})`,
      cost: 100,
      time: ((rayReceiver.prefabDesc.powerProductHeat! / 1000) / powerRequiredInKWWithCatalyst),
      in: {},
      out: {
        [mapping.items[product.ID]]: 1,
      },
      producers: [
        `${mapping.items[rayReceiver.ID]}-pro`,
      ],
      row: mappedFactoriolabProduct.row,
      category: mappedFactoriolabProduct.category,
      unlockedBy: mapping.techs[product.preTech!.ID],
    }
  ]
}), manualInterventions)
