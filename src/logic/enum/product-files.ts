export enum ProductFiles {
  Front = 'Front',
  Angle = 'Angle',
  Bottom_Up = 'Bottom Up',
  Top_Down = 'Top Down',
  Left_Side = 'Left Side',
  Right_Side = 'Right Side',
  Back = 'Back',
}

export const getRandomProductFile = (): ProductFiles => {
  const productFilesValues = Object.values(ProductFiles)
  const randomIndex = Math.floor(Math.random() * productFilesValues.length)
  return productFilesValues[randomIndex]
}
