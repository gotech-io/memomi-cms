import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { WalmartGlassesColumns } from '../enum/walmart-glasses-columns.js'
import { generateColumnLocator } from '../utils.js'

export class WalmartGlassesPage extends PageBase {
  private searchFreeText: Locator
  private assignedToMeBtn: Locator
  private previewBtn: Locator
  private tableBtn: Locator
  private refreshBtn: Locator
  private createNewProductBtn: Locator
  private threeDotsMenuBtn: Locator
  private mainCheckbox: Locator
  private loadingCenter: Locator

  constructor(page: Page) {
    super(page)
    this.searchFreeText = page.locator("//label[@id='outlined-search-label']")
    this.assignedToMeBtn = page.locator("//button[text()='Assigned to me']")
    this.previewBtn = page.locator("//button[text()='Preview']")
    this.tableBtn = page.locator("//button[text()='Table']")
    this.refreshBtn = page.locator("//button[text()='Refresh']")
    this.createNewProductBtn = page.locator("//button[@id='add-button']")
    this.threeDotsMenuBtn = page.locator("//button[@id='menu-button']")
    this.mainCheckbox = page.locator("//div[@class='ag-header-row ag-header-row-column']//div[@col-id='_id']//input")
    this.loadingCenter = page.locator("//span[@class='ag-overlay-loading-center']")
  }

  async initPage(): Promise<void> {
    await super.initPage()
    if (await this.tableBtn.isVisible()) await this.clickTable()
    await this.waitForLoadingCenterDetachment()
  }

  get pageUrl(): string {
    if (!this.baseUrl) throw new Error('Base url is not set')
    return this.baseUrl
  }

  public getTableRowData(columns: { colId: WalmartGlassesColumns; text: string }[]) {
    return this.page.locator(generateColumnLocator(columns))
  }

  public async clickCheckedLine(columns: { colId: WalmartGlassesColumns; text: string }[]) {
    await this.page.locator(generateColumnLocator(columns) + '//input').click()
  }

  public async clickEditLine(columns: { colId: WalmartGlassesColumns; text: string }[]) {
    await this.page.locator(generateColumnLocator(columns) + "//button[@aria-label='Edit']").click()
  }

  public async fillSearchFreeText(text: string) {
    await this.searchFreeText.fill(text)
  }

  public async clickAssignedToMe() {
    await this.assignedToMeBtn.click()
  }

  public async clickPreview() {
    await this.previewBtn.click()
  }

  public async clickTable() {
    await this.tableBtn.click()
  }

  public async clickCreateNewProduct() {
    await this.createNewProductBtn.click()
  }

  public async clickMenuButton() {
    await this.threeDotsMenuBtn.click()
  }

  public async clickMainCheckbox() {
    await this.mainCheckbox.click()
  }

  public async clickRefresh() {
    await this.refreshBtn.click()
  }

  public async waitForLoadingCenterDetachment() {
    await this.loadingCenter.waitFor({ state: 'attached', timeout: 30000 })
    await this.loadingCenter.waitFor({ state: 'detached', timeout: 30000 })
  }
}
