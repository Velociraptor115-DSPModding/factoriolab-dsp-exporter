type FactoriolabId = string

type Alteration<T> = {
  id?: FactoriolabId
  match?: (x: T) => boolean
  alter: (x: T) => T
}

type Removal<T> = {
  remove: (x: T) => boolean
}

export type ManualInterventions<T> = {
  additions?: T[]
  alterations?: Alteration<T>[]
  removals?: (FactoriolabId | Removal<T>)[]
}

export function performManualInterventions<T extends { id: FactoriolabId }>(data: T[], manualInterventions: ManualInterventions<T>) {
  const altered = data.map(x => {
    const alterations = manualInterventions.alterations?.filter(alteration => alteration.id === x.id || alteration.match?.(x)) ?? []
    return alterations.reduce((acc, alteration) => alteration.alter(acc), x)
  })
  const removed = altered.filter(x => !manualInterventions.removals?.some(removal => x.id === removal || (removal as Removal<T>)?.remove?.(x)) ?? false)
  return [...removed, ...(manualInterventions.additions ?? [])]
}

export function alterIdTo(id: FactoriolabId) {
  return x => ({ ...x, id })
}
