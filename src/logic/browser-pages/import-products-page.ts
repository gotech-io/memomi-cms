import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { configProvider } from '../../config/index.js'
import { getAllFiles } from '../utils.js'

export class ImportProductsPage extends PageBase {
  private uploadFilesInput: Locator
  private startBtn: Locator
  private closeBtn: Locator
  private loadedColumns: Locator
  private selectedColumns: Locator
  private addBtn: Locator
  private nextBtn: Locator

  constructor(page: Page) {
    super(page)
    this.uploadFilesInput = page.locator("//input[@type='file']")
    this.startBtn = page.locator("//button[text()='Start']")
    this.closeBtn = page.locator("//button[text()='Close']")
    this.loadedColumns = page.locator("//div[contains(@class, 'MuiCardHeader') and ./div//span[text()='Loaded Columns']]//input")
    this.selectedColumns = page.locator("//div[contains(@class, 'MuiCardHeader') and ./div//span[text()='Selected Columns']]//input")
    this.addBtn = page.locator("//button[text()='Add']")
    this.nextBtn = page.locator("//button[text()='Next']")
  }

  async initPage(): Promise<void> {
    await super.initPage()
  }

  get pageUrl(): string {
    if (!this.baseUrl) throw new Error('Base url is not set')
    return this.baseUrl
  }

  public async clickStart() {
    await this.startBtn.click()
  }

  public async clickClose() {
    await this.closeBtn.click()
  }

  public async importCSV(gtin: string) {
    const path = configProvider.walmartAutomationGeneratePath + gtin
    const files = (await getAllFiles(path)).filter(image => image.includes('.csv'))
    const filePaths = files.map(file => path + '/' + file)

    await this.page.waitForResponse(response => response.url().includes('/api') && response.status() === 200)
    await this.uploadFilesInput.setInputFiles(filePaths)
    await this.loadedColumns.click()
    await this.addBtn.click()
    await this.selectedColumns.click()
    await this.nextBtn.click()

    await this.clickStart()
    await this.clickClose()
  }
}
