import { WalmartGlassesColumns } from './enum/walmart-glasses-columns.js'
import { ApparelSunglassesColumns } from './enum/apparel-sunglasses-columns.js'
import * as fs from 'fs'
import * as path from 'path'
import AdmZip from 'adm-zip'
import { promisify } from 'util'

export const delay = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const getFilesInFolder = async (folderPath: string): Promise<string[]> => {
  try {
    return await fs.promises.readdir(folderPath)
  } catch (error) {
    return []
  }
}

export const duplicateCSV = async (inputFilePath: string, outputFilePath: string): Promise<void> => {
  const readFileAsync = promisify(fs.readFile)
  const writeFileAsync = promisify(fs.writeFile)

  try {
    const csvContent = await readFileAsync(inputFilePath, 'utf8')
    await writeFileAsync(outputFilePath, csvContent, 'utf8')
  } catch (error) {
    throw error
  }
}

export const unzipFile = async (): Promise<string[]> => {
  const downloadsDir = './downloads/'
  const zipFiles = fs.readdirSync(downloadsDir).filter(file => file.endsWith('.zip'))
  if (zipFiles.length === 0) throw new Error('No ZIP files found.')
  const zipFilePath = path.join(downloadsDir, zipFiles[0])
  const zip = new AdmZip(zipFilePath)
  const entries = zip.getEntries()

  const extractedFileNames: string[] = []

  await Promise.all(
    entries.map(async entry => {
      const entryName = entry.entryName
      const entryTargetPath = path.join(downloadsDir, entryName)

      if (entry.isDirectory) {
        fs.mkdirSync(entryTargetPath, { recursive: true })
      } else {
        const entryContent = zip.readFile(entry)

        if (entryContent !== null) {
          await fs.promises.writeFile(entryTargetPath, entryContent, 'binary')
          extractedFileNames.push(entryName)
        }
      }
    }),
  )

  return extractedFileNames
}

export const buildRowLocator = (
  columns: {
    colId: WalmartGlassesColumns | ApparelSunglassesColumns
    text: string
  }[],
): string => `//div[@role="row" and ${columns.map(column => `./div[@col-id="${column.colId}" and text()="${column.text}"]`).join(' and ')}]`
