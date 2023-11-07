import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { WalmartGlassesColumns } from '../enum/walmart-glasses-columns.js'
import { buildRowLocator } from '../utils.js'

export class WalmartGlassesPage extends PageBase {
  private walmartGlassesColumn = (column: WalmartGlassesColumns) => `//div[@class='ag-header-row ag-header-row-column']//div[@col-id='${column}']`
  private columnFilter = (index: string) => `//div[@class='ag-header-cell ag-floating-filter ag-focus-managed' and @aria-colindex=${index}]//input`

  private searchFreeText: Locator
  private assignedToMeBtn: Locator
  private previewBtn: Locator
  private tableBtn: Locator
  private refreshBtn: Locator
  private createNewProductBtn: Locator
  private threeDotsMenuBtn: Locator
  private mainCheckbox: Locator
  private loadingCenter: Locator
  private firstRow: Locator

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
    this.firstRow = page.locator("//div[@role='row' and @row-index=0]")
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

  public tableRowData(columns: { colId: WalmartGlassesColumns; text: string }[]) {
    return this.page.locator(buildRowLocator(columns))
  }

  public async clickCheckRow(columns: { colId: WalmartGlassesColumns; text: string }[]) {
    await this.page.locator(buildRowLocator(columns) + '//input').click()
  }

  public async clickEditLine(columns: { colId: WalmartGlassesColumns; text: string }[]) {
    await this.page.locator(buildRowLocator(columns) + "//button[@aria-label='Edit']").click()
  }

  public async fillSearchFreeText(text: string) {
    await this.searchFreeText.fill(text)
  }

  public async getColumnIndex(column: WalmartGlassesColumns) {
    return await this.page.locator(this.walmartGlassesColumn(column)).getAttribute('aria-colindex')
  }

  public async scrollToVisibleColumn(column: WalmartGlassesColumns, deltaX: number = 150) {
    while (!(await this.page.locator(this.walmartGlassesColumn(column)).isVisible())) {
      await this.firstRow.hover()
      await this.page.mouse.wheel(deltaX, 0)
    }
  }

  public async filterByColumn(column: WalmartGlassesColumns, text: string) {
    await this.scrollToVisibleColumn(column)
    const getIndex = await this.getColumnIndex(column)
    if (getIndex !== null) await this.page.locator(this.columnFilter(getIndex)).fill(text)
    await this.scrollToVisibleColumn(WalmartGlassesColumns._ID, -150)
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
