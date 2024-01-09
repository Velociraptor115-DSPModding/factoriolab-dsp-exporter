import techsR from '../../dsp-data/techs.json'
import itemsR from '../../dsp-data/items.json'
import { mapping } from '../../mapping'

const labMachines = (
  itemsR
    .filter(x => x.prefabDesc.isLab)
    .map(x => x.ID)
    .sort((a, b) => a - b)
    .map(x => mapping.items[x])
)

function mapRaptorModExtractorTechRecipes(techs) {
    return techs.filter(x => x.ID > 1).map(x => {
        const factoriolabId = mapping.techs[x.ID]
        const level = x.Level
        const name = level > 0 ? `${x.name} (Lv${level})` : x.name
        const category = x.ID >= 2000 ? "upgrades" : "technologies"
        const isMining = undefined
        const isTechnology = true
        const unlockedBy = undefined
        const items = Object.fromEntries(x.Items!.map((itemId, idx) => [ mapping.items[itemId], x.ItemPoints![idx] ]))
        const results = Object.fromEntries([[ factoriolabId, 3600 ]])
        const row = 0 // (x.position[0] - 1) / 4
        return {
            id:         factoriolabId,
            name,
            cost:       undefined,
            time:       1,
            in:         items,
            out:        results,
            producers:  x.IsLabTech ? labMachines : labMachines, // should this be undefined instead?
            row,
            category,
            isMining,
            unlockedBy,
            isTechnology
        }
    })
}

export const techRecipes = mapRaptorModExtractorTechRecipes(techsR)
