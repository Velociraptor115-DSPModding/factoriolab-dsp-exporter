import { componentItems } from './component-item'
import { buildingItems } from './building-item'
import { stackedBeltItems } from './stacked-belt-item'
import { effectItems } from './effect-item'
import { techItems } from './tech-item'
import { compareFactoriolabArrayElements } from '../utils/comparers'


export const items = [
    ...componentItems,
    ...buildingItems,
    ...stackedBeltItems,
    ...effectItems,
    ...techItems,
].sort(compareFactoriolabArrayElements)
