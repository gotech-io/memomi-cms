import * as fs from 'fs'
import * as path from 'path'
import AdmZip from 'adm-zip'
import { promisify } from 'util'
import { configProvider } from '../config/index.js'
import { createObjectCsvWriter } from 'csv-writer'
import { CSVData, CSVHeader } from './enum/csv-types.js'

export const delay = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const getAllFiles = async (folderPath: string): Promise<string[]> => {
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

export const unzipFiles = async (): Promise<string[]> => {
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

export const randomString = (length: number): string => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

export const initializeProductFolder = async (sourceFolderPath: string, suffix: string): Promise<void> => {
  const destinationFolderPath = configProvider.walmartAutomationGeneratePath + suffix
  await fs.promises.mkdir(destinationFolderPath)
  const files = await fs.promises.readdir(sourceFolderPath)

  await Promise.all(
    files.map(async file => {
      const sourceFilePath = path.join(sourceFolderPath, file)
      const destinationFileName = file.replace(configProvider.walmartAutomationProduct, suffix)
      const destinationFilePath = path.join(destinationFolderPath, destinationFileName)
      await fs.promises.copyFile(sourceFilePath, destinationFilePath)
    }),
  )
}

export const deleteFolder = async (path: string): Promise<void> => {
  const folderExists = await fs.promises
    .stat(path)
    .then(stats => stats.isDirectory())
    .catch(() => false)

  if (folderExists) {
    const files = await fs.promises.readdir(path)

    await Promise.all(
      files.map(async file => {
        const curPath = `${path}/${file}`
        const stats = await fs.promises.stat(curPath)

        if (stats.isDirectory()) {
          await deleteFolder(curPath)
        } else {
          await fs.promises.unlink(curPath)
        }
      }),
    )
    await fs.promises.rmdir(path)
  }
}

export const deleteZipFile = async (filePath: string): Promise<void> => {
  const unlinkAsync = promisify(fs.unlink)
  const statAsync = promisify(fs.stat)

  const fileExists = await statAsync(filePath + '.zip')
    .then(() => true)
    .catch(() => false)

  if (fileExists) await unlinkAsync(filePath + '.zip')
}

export const generateProductGtin = (): string => {
  return configProvider.walmartAutomationProduct + '-' + randomString(5)
}

export const waitForStringInResult = async <T>(action: () => Promise<T>, expected: string, retries: number, sleep: number): Promise<string> => {
  let actualResult: string = String(await action())
  let retryCount = 0

  const includesExpected = (result: string) => result.includes(expected)

  while (!includesExpected(actualResult) && retryCount < retries) {
    actualResult = String(await action())
    if (!includesExpected(actualResult)) {
      retryCount++
      await delay(sleep)
    }
  }
  return actualResult
}

export const createCSV = async (csvFilePath: string, csvHeader: CSVHeader[], CSVData: CSVData[]) => {
  const fullCsvFilePath = `${configProvider.walmartAutomationGeneratePath}${csvFilePath}/${csvFilePath}.csv`
  const directoryPath = path.dirname(fullCsvFilePath)

  if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath, { recursive: true })

  const csvWriter = createObjectCsvWriter({
    path: fullCsvFilePath,
    header: csvHeader,
    append: false,
  })

  await csvWriter.writeRecords(CSVData)
}
