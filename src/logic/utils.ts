import { WalmartGlassesColumns } from "./enum/walmart-glasses-columns.js";

export const generateColumnLocator = (columns: { colId: WalmartGlassesColumns; text: string }[]): string =>
    `//div[@role='row'${columns.map(column => `./div[@col-id='${column.colId}' and text()='${column.text}']`).join(' and ')}]`;