export enum ProductPriority {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
}

export const randomProductPriority = (): ProductPriority => {
  const productPriorityValues = Object.values(ProductPriority)
  const randomIndex = Math.floor(Math.random() * productPriorityValues.length)
  return productPriorityValues[randomIndex]
}
