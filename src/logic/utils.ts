import { WalmartGlassesColumns } from './enum/walmart-glasses-columns.js'
import { ApparelSunglassesColumns } from './enum/apparel-sunglasses-columns.js'

export const buildRowLocator = (
  columns: {
    colId: WalmartGlassesColumns | ApparelSunglassesColumns
    text: string
  }[],
): string => `//div[@role="row" and ${columns.map(column => `./div[@col-id="${column.colId}" and text()="${column.text}"]`).join(' and ')}]`
