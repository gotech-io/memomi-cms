import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { ProductTabs } from '../enum/product-tabs.js'
import { ProductStatus } from '../enum/product-status.js'
import { ProductValues } from '../enum/product-values.js'

export class EditProductPage extends PageBase {
  private productTab = (tab: ProductTabs) => this.page.locator(`//div[@role='tablist']//a[text()='${tab}']`)
  private productStatusItems = (status: ProductStatus) =>
    this.page.locator(`//ul[@aria-labelledby='status-select-label-status']//li[@data-value='${status}']`)
  private productValue = (value: ProductValues) =>
    this.page.locator(`//div[contains(@class, 'MuiGrid-grid-md-6 css-iol86l') and ./h6[text()='${value}']]//h6[2]`)

  private saveBtn: Locator
  private closeBtn: Locator
  private unlockBtn: Locator
  private trackingSelectStatusMenu: Locator

  constructor(page: Page) {
    super(page)
    this.saveBtn = page.locator("//button[text()='Save']")
    this.closeBtn = page.locator("//button[text()='Close']")
    this.unlockBtn = page.locator("//button[text()='Unlock']")
    this.trackingSelectStatusMenu = page.locator("//div[@id='status-select-status']")
  }

  async initPage(): Promise<void> {
    await super.initPage()
  }

  get pageUrl(): string {
    if (!this.baseUrl) throw new Error('Base url is not set')
    return this.baseUrl
  }

  public async clickTab(tab: ProductTabs) {
    await this.productTab(tab).click()
  }

  public async clickSave() {
    await this.saveBtn.click()
  }

  public async clickClose() {
    await this.closeBtn.click()
  }

  public async clickUnlock() {
    if (await this.unlockBtn.isVisible()) await this.unlockBtn.click()
  }

  public async clickSelectStatusMenu() {
    await this.trackingSelectStatusMenu.click()
  }

  public async getProductValue(item: ProductValues) {
    return await this.productValue(item).textContent()
  }

  public async setProductStatus(status: ProductStatus) {
    if (await this.trackingSelectStatusMenu.isVisible()) {
      await this.clickSelectStatusMenu()
      await this.productStatusItems(status).click()
    }
  }
}
