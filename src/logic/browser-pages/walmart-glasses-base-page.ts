import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { WalmartGlassesColumns } from '../enum/walmart-glasses-columns.js'
import { DropdownItems } from '../enum/dropdown-items.js'
import { buildRowLocator } from '../utils.js'

export class WalmartGlassesBasePage extends PageBase {
  private walmartGlassesColumn = (column: WalmartGlassesColumns) =>
    this.page.locator(`//div[@class='ag-header-row ag-header-row-column']//div[@col-id='${column}']`)

  private columnFilter = (index: string) =>
    this.page.locator(`//div[@class='ag-header-cell ag-floating-filter ag-focus-managed' and @aria-colindex=${index}]//input`)

  private dropDownMenuItem = (item: DropdownItems) => this.page.locator(`//li[text()='${item}']`)

  private columnData = (gtin: string, colId: WalmartGlassesColumns) =>
    this.page.locator(`//div[@role="row" and ./div[@col-id="gtin" and text()="${gtin}"]]//div[@col-id='${colId}']`)

  private searchFreeText: Locator
  private assignedToMeBtn: Locator
  private previewBtn: Locator
  private tableBtn: Locator
  private refreshBtn: Locator
  private createNewProductBtn: Locator
  private dropDownMenuBtn: Locator
  private mainCheckbox: Locator
  private loadingCenter: Locator
  private firstRow: Locator
  private okBtn: Locator
  private newProductId: Locator
  private createBtn: Locator

  constructor(page: Page) {
    super(page)
    this.searchFreeText = page.locator("//label[@id='outlined-search-label']") // !
    this.assignedToMeBtn = page.locator("//button[text()='Assigned to me']") //
    this.previewBtn = page.locator("//button[text()='Preview']")
    this.tableBtn = page.locator("//button[text()='Table']")
    this.refreshBtn = page.locator("//button[text()='Refresh']")
    this.createNewProductBtn = page.locator("//button[@id='add-button']")
    this.dropDownMenuBtn = page.locator("//button[@id='menu-button']")
    this.mainCheckbox = page.locator("//div[@class='ag-header-row ag-header-row-column']//div[@col-id='_id']//input")
    this.loadingCenter = page.locator("//span[@class='ag-overlay-loading-center']")
    this.firstRow = page.locator("//div[@role='row' and @row-index=0]")
    this.okBtn = page.locator("//button[text()='OK']")
    this.newProductId = page.locator("//input[@id='name']")
    this.createBtn = page.locator("//button[text()='Create']")
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

  public async tableColumnData(gtin: string, colId: WalmartGlassesColumns) {
    await this.scrollToVisibleColumn(colId)
    return this.columnData(gtin, colId).textContent()
  }

  public async clickCheckRow(columns: { colId: WalmartGlassesColumns; text: string }[]) {
    const locatorSuffix: string = "//div[@class='ag-selection-checkbox']"
    const clickRowLocator: Locator = this.page.locator(buildRowLocator(columns) + locatorSuffix)
    const includeSelectedRow: Locator = this.page.locator(buildRowLocator(columns, true) + locatorSuffix)

    await clickRowLocator.waitFor()

    if (await clickRowLocator.isVisible()) {
      await clickRowLocator.click()
      await includeSelectedRow.waitFor({ state: 'attached' })
    }
  }

  public async clickEditLine(columns: { colId: WalmartGlassesColumns; text: string }[]) {
    await this.page.locator(buildRowLocator(columns) + "//button[@aria-label='Edit']").click()
    await this.page.waitForResponse(
      response => response.url().includes('/api/products/') && response.status() === 200 && response.request().method() === 'GET',
    )
  }

  public async fillSearchFreeText(text: string) {
    await this.searchFreeText.fill(text)
  }

  public async getColumnIndex(column: WalmartGlassesColumns) {
    return await this.walmartGlassesColumn(column).getAttribute('aria-colindex')
  }

  public async scrollToVisibleColumn(column: WalmartGlassesColumns, deltaX: number = 150) {
    while (!(await this.walmartGlassesColumn(column).isVisible())) {
      await this.firstRow.hover()
      await this.page.mouse.wheel(deltaX, 0)
    }
  }

  public async filterByColumn(column: WalmartGlassesColumns, text: string) {
    await this.scrollToVisibleColumn(column)
    const getIndex = await this.getColumnIndex(column)
    if (getIndex !== null) await this.columnFilter(getIndex).fill(text)
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

  public async clickCreate() {
    await this.createBtn.click()
  }

  public async fillNewProductId(id: string) {
    await this.newProductId.fill(id)
  }

  public async createNewProduct(id: string) {
    await this.clickCreateNewProduct()
    await this.fillNewProductId(id)
    await this.clickCreate()
    await this.page.waitForResponse(
      response => response.url().includes('/api/products') && response.status() === 201 && response.request().method() === 'POST',
    )
  }

  public async clickOk() {
    await this.okBtn.click()
  }

  public async clickMenu() {
    await this.dropDownMenuBtn.click()
  }

  public async pickMenuItem(item: DropdownItems) {
    await this.clickMenu()
    await this.dropDownMenuItem(item).click()
  }

  public async clickMainCheckbox() {
    await this.mainCheckbox.click()
  }

  public async clickRefresh() {
    await this.refreshBtn.click()
    await this.initPage()
  }

  public async waitForLoadingCenterDetachment() {
    await this.loadingCenter.waitFor({ state: 'attached', timeout: 30000 })
    await this.loadingCenter.waitFor({ state: 'detached', timeout: 30000 })
  }

  public async waitForPageResponses() {
    const endpoints = ['/names', '/select']

    for (const endpoint of endpoints) {
      await this.page.waitForResponse(
        response => response.url().endsWith(endpoint) && response.status() === 200 && response.request().method() === 'GET',
      )
    }
  }
}
