import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { WalmartGlassesColumns } from '../enum/walmart-glasses-columns.js'
import { DropdownItems } from '../enum/dropdown-items.js'
import { ApparelSunglassesColumns } from '../enum/apparel-sunglasses-columns.js'
import { ProductStatus } from '../enum/product-status.js'
import { configProvider } from '../../config/index.js'

export class WalmartGlassesBasePage extends PageBase {
  private walmartGlassesColumn = (column: WalmartGlassesColumns) =>
    this.page.locator(`//div[@class='ag-header-row ag-header-row-column']//div[@col-id='${column}']`)

  private columnFilter = (index: string) =>
    this.page.locator(`//div[@class='ag-header-cell ag-floating-filter ag-focus-managed' and @aria-colindex=${index}]//input`)

  private dropDownMenuItem = (item: DropdownItems) => this.page.locator(`//li[text()='${item}']`)

  private columnData = (gtin: string, colId: WalmartGlassesColumns) =>
    this.page.locator(`//div[@role="row" and ./div[@col-id="gtin" and text()="${gtin}"]]//div[@col-id='${colId}']`)

  private productExistAlert = (gtin: string) =>
    this.page.locator(`//div[contains(@class, 'Alert-message') and contains(text(), "product Id '${gtin}' already exists")]`)

  private selectionCheckboxSuffix = (
    columns: {
      colId: WalmartGlassesColumns
      text: string
    }[],
    includeSelectedRow: boolean = false,
  ) => this.buildRowLocator(columns, includeSelectedRow).locator("//div[@class='ag-selection-checkbox']")

  private productStatusItems = (status: ProductStatus) => this.page.locator(`//ul[@role='listbox']//li[text()='${status}']`)

  private productDesigner = (designer: string) => this.page.locator(`//ul[@role='listbox']//li[text()='${designer}']`)

  private _searchFreeText: Locator
  private _assignedToMeBtn: Locator
  private _previewBtn: Locator
  private _tableBtn: Locator
  private _refreshBtn: Locator
  private _createNewProductBtn: Locator
  private _dropDownMenuBtn: Locator
  private _mainCheckbox: Locator
  private _loadingCenter: Locator
  private _firstRow: Locator
  private _okBtn: Locator
  private _newProductId: Locator
  private _createBtn: Locator
  private _select: Locator

  constructor(page: Page) {
    super(page)
    this._searchFreeText = page.locator("//label[@id='outlined-search-label']") // !
    this._assignedToMeBtn = page.locator("//button[text()='Assigned to me']") //
    this._previewBtn = page.locator("//button[text()='Preview']")
    this._tableBtn = page.locator("//button[text()='Table']")
    this._refreshBtn = page.locator("//button[text()='Refresh']")
    this._createNewProductBtn = page.locator("//button[@id='add-button']")
    this._dropDownMenuBtn = page.locator("//button[@id='menu-button']")
    this._mainCheckbox = page.locator("//div[@class='ag-header-row ag-header-row-column']//div[@col-id='_id']//input")
    this._loadingCenter = page.locator("//span[@class='ag-overlay-loading-center']")
    this._firstRow = page.locator("//div[@role='row' and @row-index=0]")
    this._okBtn = page.locator("//button[text()='OK']")
    this._newProductId = page.locator("//input[@id='name']")
    this._createBtn = page.locator("//button[text()='Create']")
    this._select = page.locator("//div[@id='select']")
  }

  async initPage(): Promise<void> {
    await super.initPage()
    await this.page.waitForResponse(
      response => response.url().endsWith('/select') && response.status() === 200 && response.request().method() === 'GET',
    )
    if (await this._tableBtn.isVisible()) await this.clickTable()
  }

  private buildRowLocator = (
    columns: {
      colId: WalmartGlassesColumns | ApparelSunglassesColumns
      text: string
    }[],
    includeSelectedRow: boolean = false,
  ): Locator => {
    const selectedRowCondition = includeSelectedRow ? "contains(@class, 'ag-row-selected') and " : ''

    return this.page.locator(
      `//div[@role="row" and ${selectedRowCondition}${columns
        .map(column => `./div[@col-id="${column.colId}" and text()="${column.text}"]`)
        .join(' and ')}]`,
    )
  }

  get pageUrl(): string {
    if (!this.baseUrl) throw new Error('Base url is not set')
    return this.baseUrl
  }

  public tableRowData(columns: { colId: WalmartGlassesColumns; text: string }[]) {
    return this.buildRowLocator(columns)
  }

  public async tableColumnData(gtin: string, colId: WalmartGlassesColumns) {
    await this.scrollToVisibleColumn(colId)
    return this.columnData(gtin, colId).textContent()
  }

  public async clickCheckRow(columns: { colId: WalmartGlassesColumns; text: string }[]) {
    const checkboxRowLocator: Locator = this.selectionCheckboxSuffix(columns)
    const includeSelectedRow: Locator = this.selectionCheckboxSuffix(columns, true)

    await checkboxRowLocator.waitFor()
    await checkboxRowLocator.click()
    await includeSelectedRow.waitFor({ state: 'attached' })
  }

  public async clickEditLine(columns: { colId: WalmartGlassesColumns; text: string }[]) {
    await this.buildRowLocator(columns).locator("//button[@aria-label='Edit']").click()
    await this.page.waitForResponse(
      response => response.url().includes('/api/products/') && response.status() === 200 && response.request().method() === 'GET',
    )
  }

  public async fillSearchFreeText(text: string) {
    await this._searchFreeText.fill(text)
  }

  public async getColumnIndex(column: WalmartGlassesColumns) {
    return await this.walmartGlassesColumn(column).getAttribute('aria-colindex')
  }

  public async scrollToVisibleColumn(column: WalmartGlassesColumns, deltaX: number = 150) {
    while (!(await this.walmartGlassesColumn(column).isVisible())) {
      await this._firstRow.hover()
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
    await this._assignedToMeBtn.click()
  }

  public async clickPreview() {
    await this._previewBtn.click()
  }

  public async clickTable() {
    await this._tableBtn.click()
  }

  public async clickCreateNewProduct() {
    await this._createNewProductBtn.click()
  }

  public async clickCreate() {
    await this._createBtn.click()
  }

  public async fillNewProductId(id: string) {
    await this._newProductId.fill(id)
  }

  public async createNewProduct(id: string) {
    await this.clickCreateNewProduct()
    await this.fillNewProductId(id)
    await this.clickCreate()
  }

  public async clickOk() {
    await this._okBtn.click()
  }

  public async clickMenu() {
    await this._dropDownMenuBtn.click()
  }

  public async pickMenuItem(item: DropdownItems) {
    await this.clickMenu()
    await this.dropDownMenuItem(item).click()
  }

  public async clickMainCheckbox() {
    await this._mainCheckbox.click()
  }

  public async clickRefresh() {
    await this._refreshBtn.click()
    await this.initPage()
  }

  public async waitForLoadingCenterDetachment() {
    await this._loadingCenter.waitFor({ state: 'attached', timeout: 30000 })
    await this._loadingCenter.waitFor({ state: 'detached', timeout: 30000 })
  }

  public async waitForPageResponses() {
    const endpoints = ['/names', '/select']

    for (const endpoint of endpoints) {
      await this.page.waitForResponse(
        response => response.url().endsWith(endpoint) && response.status() === 200 && response.request().method() === 'GET',
      )
    }
  }

  public async isProductExistAlertVisible(gtin: string) {
    await this.productExistAlert(gtin).waitFor()
    return this.productExistAlert(gtin)
  }

  public async deleteProduct(
    column: WalmartGlassesColumns,
    gtin: string,
    columns: {
      colId: WalmartGlassesColumns
      text: string
    }[],
  ) {
    await this.filterByColumn(column, gtin)
    await this.clickCheckRow(columns)
    await this.clickMenu()
    await this.dropDownMenuItem(DropdownItems.Delete).click()
    await this._okBtn.click()
  }

  public async changeStatus(status: ProductStatus) {
    await this.pickMenuItem(DropdownItems.ChangeStatus)
    await this._select.click()
    await this.productStatusItems(status).click()
    await this._okBtn.click()
    await this.page.waitForResponse(
      response => response.url().endsWith('/status') && response.status() === 200 && response.request().method() === 'POST',
    )
    await this.waitForLoadingCenterDetachment()
  }

  public async changeDesigner() {
    await this.pickMenuItem(DropdownItems.ChangeDesigner)
    await this._select.click()
    await this.productDesigner(configProvider.automationDesigner).click()
    await this._okBtn.click()
    await this.page.waitForResponse(
      response => response.url().endsWith('/designer') && response.status() === 200 && response.request().method() === 'POST',
    )
    await this.waitForLoadingCenterDetachment()
  }
}
