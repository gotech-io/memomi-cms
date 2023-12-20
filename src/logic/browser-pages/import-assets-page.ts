import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { getAllFiles } from '../utils.js'
import { configProvider } from '../../config/index.js'
import { AssetsButtons } from '../enum/assets-buttons.js'

export class ImportAssetsPage extends PageBase {
  private productNotFound = (image: string) =>
    this.page.locator(
      `//div[@role='row' and ./div[@col-id='productId'] and ./div[@col-id='fileName' and text()='${image}'] and ./div[text()='Product not found']]`,
    )

  private infoButton = (button: AssetsButtons, uploads: number) => this.page.locator(`//button[text()='${button} (${uploads})']`)

  private uploadFilesInput: Locator
  private startBtn: Locator
  private exportBtn: Locator
  private closeBtn: Locator

  constructor(page: Page) {
    super(page)
    this.uploadFilesInput = page.locator("//input[@type='file']")
    this.startBtn = page.locator("//button[text()='Start']")
    this.exportBtn = page.locator("//button[text()='Export']")
    this.closeBtn = page.locator("//button[text()='Close']")
  }

  async initPage(): Promise<void> {
    await super.initPage()
    await this.page.waitForResponse(response => response.url().endsWith('/ids') && response.status() === 200)
  }

  get pageUrl(): string {
    if (!this.baseUrl) {
      throw new Error('Base url is not set')
    }
    return this.baseUrl
  }

  public async clickStart() {
    await this.startBtn.click()
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
    await this.uploadFilesInput.setInputFiles(filePaths)
    await this.page.waitForResponse(response => response.url().endsWith('/list') && response.status() === 200)
    await this.clickStart()
    await this.clickClose()
  }

  public async importNotFoundProduct() {
    const path = configProvider.walmartAutomationResourcesPath
    const filePaths = (await getAllFiles(path)).filter(image => image.includes('invalid')).map(file => path + '/' + file)
    await this.uploadFilesInput.setInputFiles(filePaths)
    await this.infoButton(AssetsButtons.Errors, filePaths.length).waitFor({ state: 'attached' })
  }
}
