import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { delay, getAllFiles, waitForResult } from '../utils.js'
import { configProvider } from '../../config/index.js'

export class ImportAssetsPage extends PageBase {
  private productNotFound = (image: string) =>
    this.page.locator(
      `//div[@role='row' and ./div[@col-id='productId'] and ./div[@col-id='fileName' and text()='${image}'] and ./div[text()='Product not found']]`,
    )

  private uploadFilesInput: Locator
  private startImportBtn: Locator
  private exportBtn: Locator
  private closeBtn: Locator
  private progressbar: Locator
  private uploadResult: Locator

  constructor(page: Page) {
    super(page)
    this.uploadFilesInput = page.locator("//input[@type='file']")
    this.startImportBtn = page.locator("//button[text()='Start Import']")
    this.exportBtn = page.locator("//button[text()='Export']")
    this.closeBtn = page.locator("//button[text()='Close']")
    this.progressbar = page.locator("//span[@role='progressbar']")
    this.uploadResult = page.locator("//div[@col-id='message' and text()='Done']")
  }

  async initPage(): Promise<void> {
    await super.initPage()
  }

  get pageUrl(): string {
    if (!this.baseUrl) {
      throw new Error('Base url is not set')
    }
    return this.baseUrl
  }

  public async clickStartImport(uploads: number) {
    await this.startImportBtn.click()
    await this.waitForUploads(uploads)

    await this.startImportBtn.click()
    await this.waitForUploads(uploads)
  }

  public async waitForUploads(uploads: number) {
    await this.progressbar.waitFor({ state: 'attached' })
    await this.progressbar.waitFor({ state: 'detached' })
    await waitForResult(() => this.uploadResult.count(), uploads, 10, 500)
  }

  public async clickExport() {
    await this.exportBtn.click()
  }

  public async clickClose() {
    await this.closeBtn.click()
  }

  public isProductNotFound(image: string) {
    return this.productNotFound(image)
  }

  public async importAssets(gtin: string) {
    const path = configProvider.walmartAutomationGeneratePath + gtin + '/'
    const images = (await getAllFiles(path)).filter(image => !image.includes('invalid') && !image.includes('.DS_Store'))
    const filePaths = images.map(file => path + '/' + file)
    await this.uploadFilesInput.waitFor({ state: 'attached' })
    await delay(1000) // Fixme: Page loads into the database slowly.
    await this.uploadFilesInput.setInputFiles(filePaths)
    await this.clickStartImport(filePaths.length)
    await this.clickClose()
  }

  public async importNotFoundProduct() {
    const path = configProvider.walmartAutomationResourcesPath
    const filePaths = (await getAllFiles(path)).filter(image => image.includes('invalid')).map(file => path + '/' + file)
    await this.uploadFilesInput.waitFor({ state: 'attached' })
    await this.uploadFilesInput.setInputFiles(filePaths)
  }
}
