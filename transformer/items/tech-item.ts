import techsR from '../../dsp-data/techs.json'
import { mapping } from '../../mapping'

function mapDspTechs(techs) {
  return techs.filter(x => x.ID > 1).map(x => {
    const factoriolabId = mapping.techs[x.ID]
    const name = x.name
    const category = x.ID >= 2000 ? "upgrades" : "technologies"
    const techPrerequisites = [...x.PreTechs ?? [], ...x.PreTechsImplicit ?? []]?.filter(y => y > 1)?.map(x => mapping.techs[x]) ?? []
    return {
      category,
      id: factoriolabId,
      name,
      row: 0,
      technology: {
        prerequisites: techPrerequisites.length > 0 ? techPrerequisites : undefined
      }
    }
  })
}

export const techItems = mapDspTechs(techsR)
