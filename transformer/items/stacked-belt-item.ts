import { buildingItems } from "./building-item"

const stacks = [
  2, 3, 4
]

const belts = buildingItems.filter(x => x.belt?.speed > 0)

export const stackedBeltItems = stacks.flatMap(stack => belts.map(belt => ({
  ...belt,
  category: "stacked-belts",
  id: `belt-st${stack}-${belt.id.replace('conveyor-belt-', '')}`,
  name: `${belt.name} (${stack}-stack)`,
  belt: {
    speed: belt.belt.speed * stack
  },
  icon: belt.id,
  iconText: stack,
})))
