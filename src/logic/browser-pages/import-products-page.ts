import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { configProvider } from '../../config/index.js'
import { getAllFiles } from '../utils.js'

export class ImportProductsPage extends PageBase {
  private _uploadFilesInput: Locator
  private _startBtn: Locator
  private _closeBtn: Locator
  private _loadedColumns: Locator
  private _selectedColumns: Locator
  private _addBtn: Locator
  private _nextBtn: Locator

  constructor(page: Page) {
    super(page)
    this._uploadFilesInput = page.locator("//input[@type='file']")
    this._startBtn = page.locator("//button[text()='Start']")
    this._closeBtn = page.locator("//button[text()='Close']")
    this._loadedColumns = page.locator("//div[contains(@class, 'MuiCardHeader') and ./div//span[text()='Loaded Columns']]//input")
    this._selectedColumns = page.locator("//div[contains(@class, 'MuiCardHeader') and ./div//span[text()='Selected Columns']]//input")
    this._addBtn = page.locator("//button[text()='Add']")
    this._nextBtn = page.locator("//button[text()='Next']")
  }

  async initPage(): Promise<void> {
    await super.initPage()
  }

  get pageUrl(): string {
    if (!this.baseUrl) throw new Error('Base url is not set')
    return this.baseUrl
  }

  public async clickStart() {
    await this._startBtn.click()
  }

  public async clickClose() {
    await this._closeBtn.click()
  }

  public async importCSV(gtin: string) {
    const path = configProvider.walmartAutomationGeneratePath + gtin
    const files = (await getAllFiles(path)).filter(image => image.includes('.csv'))
    const filePaths = files.map(file => path + '/' + file)

    await this.page.waitForResponse(
      response =>
        response.url().includes('https://cmsdevserverapi.azurewebsites.net/api/schema/') &&
        response.status() === 200 &&
        response.request().method() == 'GET',
    )

    await this._uploadFilesInput.setInputFiles(filePaths)
    await this._loadedColumns.click()
    await this._addBtn.click()
    await this._selectedColumns.click()
    await this._nextBtn.click()

    await this.clickStart()
    await this.clickClose()
  }
}
