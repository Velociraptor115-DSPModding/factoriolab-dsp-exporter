import itemsR from '../../dsp-data/items.json'
import { mapping } from '../../mapping'
import { parseGridIndex } from '../utils/grid-index-parser'

function genFuel(id: string, fuelType?: number, heatValue?: { value: string }) {
  const category = (
    fuelType === 1 ? "chemical" :
    fuelType === 2 ? "nuclear" :
    fuelType === 4 ? "antimatter" :
    fuelType === 8 ? "accumulator" :
    undefined
  )
  if (category) {
    return {
      category,
      value: Number(heatValue!.value) / 1000000
    }
  }
}

function machineElectricDesc(prefabDesc) {
  const generationRaw = Number(prefabDesc.genEnergyPerTick) * 60 / 1000
  const usageRaw = Number(prefabDesc.workEnergyPerTick) * 60 / 1000
  const drainRaw = Number(prefabDesc.idleEnergyPerTick) * 60 / 1000
  const exchangerRaw = Number(prefabDesc.exchangeEnergyPerTick) * 60 / 1000
  const usage = (exchangerRaw ? exchangerRaw : 0) + (usageRaw ? usageRaw : 0) - (generationRaw ? generationRaw : 0)
  const drain = drainRaw ? drainRaw : undefined
  if (usage || drain) {
    return {
      type: "electric",
      usage,
      drain
    }
  }
}

function machineBurnerDesc(prefabDesc) {
  const fuelType = Number(prefabDesc.fuelMask)
  const fuel = (
    fuelType === 1 ? "chemical" :
    fuelType === 2 ? "nuclear" :
    fuelType === 4 ? "antimatter" :
    fuelType === 8 ? "accumulator" :
    undefined
  )
  const fuelCategories = fuel ? [fuel] : undefined
  if (fuel) {
    return {
      type: "burner",
      fuelCategories
    }
  }
}

function machineSpeedDesc(prefabDesc) {
  let speed: any = undefined
  if (
    prefabDesc.isPowerGen === true
    // || prefabDesc.isPowerNode === true
    || prefabDesc.isPowerExchanger === true
    || prefabDesc.isPiler === true
    || prefabDesc.isEjector === true
    || prefabDesc.isSilo === true
    || prefabDesc.isStation === true
    || prefabDesc.isDispenser === true
    || prefabDesc.isInserter === true
    || prefabDesc.isSpraycoster === true
  ) {
    speed = 1
  }
  if (prefabDesc.isCollectStation === true) {
    speed = Number(prefabDesc.stationCollectSpeed)
  }
  if (prefabDesc.isAssembler === true) {
    speed = Number(prefabDesc.assemblerSpeed) / 10000
  }
  if (prefabDesc.isLab === true) {
    speed = Number(prefabDesc.labAssembleSpeed) / 10000
  }
  if (prefabDesc.minerType && prefabDesc.minerType !== "None") {
    if (prefabDesc.minerType === "Vein") {
      speed = 600000 / Number(prefabDesc.minerPeriod) * 2
    } else {
      speed = 1
    }
  }
  if (speed) {
    return {
      speed
    }
  }
}

function machineModulesDesc(prefabDesc) {
  let modules: any = undefined
  if (prefabDesc.isAssembler === true || prefabDesc.isLab === true) {
    modules = 1
  }
  if (prefabDesc.isSpraycoster === true) {
    modules = 1
  }
  if (prefabDesc.isFractionator === true) {
    modules = 1
  }
  if (modules) {
    return {
      modules
    }
  }
}

function beltFromPrefab(prefabDesc) {
  const speed = Number(prefabDesc.beltSpeed) * 6
  if (speed) {
    return {
      speed
    }
  }
}

function generateMachineFromPrefab(prefabDesc) {
  const machine = {
    ...machineSpeedDesc(prefabDesc),
    ...(Number(prefabDesc.fuelMask) ? {} : machineElectricDesc(prefabDesc)),
    ...machineBurnerDesc(prefabDesc),
    ...machineModulesDesc(prefabDesc)
  }
  if (Object.keys(machine).length > 0) {
    return machine
  }
}

function mapRaptorModExtractorBuildings(items) {
  return items.filter(x => x.GridIndex >= 2000).map(x => {
    const factoriolabId = mapping.items[x.ID]
    const name = x.name
    const page = Math.floor(x.GridIndex / 1000)
    const row = Math.floor((x.GridIndex - (page * 1000)) / 100) - 1
    const fuel = genFuel(factoriolabId, x.FuelType, { value: x.HeatValue })
    const category = "buildings"
    return {
      category,
      id: factoriolabId,
      name,
      row,
      stack: x.StackSize,
      fuel,
      machine: generateMachineFromPrefab(x.prefabDesc),
      belt: beltFromPrefab(x.prefabDesc),
      parsedGridIndex: parseGridIndex(x.GridIndex),
    }
  })
}

function addAltBuildings(items) {
  return [
    ...items,
    {
      "category": "buildings-alt",
      "id": "ray-receiver-pro",
      "name": "Ray receiver (Graviton lens)",
      "row": 0,
      "stack": 10,
      "machine": {
        "type": "burner",
        "speed": 1,
        "modules": 1,
        "fuelCategories": [
          "lens"
        ]
      },
      "icon": "ray-receiver"
    }
  ]
}

function alterUsageTo(usage) {
  return x => ({ ...x, machine: { ...x.machine, usage } })
}

function removeElectricUsage() {
  return x => ({
    ...x, machine: {
      ...x.machine, type: undefined, usage: undefined
    }
  })
}

function divideElectricUsageBy(value) {
  return x => ({
    ...x, machine: {
      ...x.machine, usage: x.machine.usage / value, drain: x.machine.drain / value
    }
  })
}

function adjustForMaxChargingPower() {
  return x => ({
    ...x, machine: {
      ...x.machine, usage: x.machine.usage * 5
    }
  })
}

const buildingsToManuallyAlter = [
  {
    id: "satellite-substation",
    alter: alterUsageTo(0)
  },
  {
    id: "ray-receiver",
    alter: alterUsageTo(120000)
  },
  {
    id: "orbital-collector",
    alter: removeElectricUsage()
  },
  {
    id: "interstellar-logistics-station",
    alter: adjustForMaxChargingPower()
  },
  {
    id: "planetary-logistics-station",
    alter: adjustForMaxChargingPower()
  },
  {
    id: "logistics-distributor",
    alter: adjustForMaxChargingPower()
  },
  {
    id: "mining-machine",
    alter: divideElectricUsageBy(6)
  }
]

function alterBuildingsManually(buildingItems) {
  return buildingItems.map(x => {
    const manualAlteration = buildingsToManuallyAlter.find(y => x.id === y.id)
    if (manualAlteration) {
      return manualAlteration.alter(x)
    }
    return x
  })
}

export const buildingItems = alterBuildingsManually(addAltBuildings(mapRaptorModExtractorBuildings(itemsR)))
