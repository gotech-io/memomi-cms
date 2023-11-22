import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { getAllFiles } from '../utils.js'
import { configProvider } from '../../config/index.js'

export class ImportAssetsPage extends PageBase {
  private productNotFound = (image: string) =>
    this.page.locator(`//div[@data-id='${image}']//div[@data-field='message' and text()='Product not found']`)

  private uploadFilesInput: Locator
  private startImportBtn: Locator
  private exportBtn: Locator
  private closeBtn: Locator
  private progressbar: Locator

  constructor(page: Page) {
    super(page)
    this.uploadFilesInput = page.locator("//input[@type='file']")
    this.startImportBtn = page.locator("//button[text()='Start Import']")
    this.exportBtn = page.locator("//button[text()='Export']")
    this.closeBtn = page.locator("//button[text()='Close']")
    this.progressbar = page.locator("//span[@role='progressbar']")
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

  public async clickStartImport() {
    await this.startImportBtn.click()
    await this.progressbar.waitFor({ state: 'attached' })
    await this.progressbar.waitFor({ state: 'detached' })
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

  public async importAssets() {
    const path = configProvider.walmartAutomationResourcesPath
    const images = (await getAllFiles(path)).filter(image => !image.includes('invalid') && !image.includes('.DS_Store'))
    const filePaths = images.map(file => path + '/' + file)
    await this.uploadFilesInput.setInputFiles(filePaths)
    await this.clickStartImport()
    await this.clickClose()
  }

  public async importNotFoundProduct() {
    const path = configProvider.walmartAutomationResourcesPath
    const filePaths = (await getAllFiles(path)).filter(image => image.includes('invalid')).map(file => path + '/' + file)
    await this.uploadFilesInput.setInputFiles(filePaths)
  }
}
