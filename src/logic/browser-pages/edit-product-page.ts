import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { ProductTabs } from '../enum/product-tabs.js'
import { ProductStatus } from '../enum/product-status.js'
import { ProductValues } from '../enum/product-values.js'
import { ProductPriority } from '../enum/product-priority.js'

export class EditProductPage extends PageBase {
  private productTab = (tab: ProductTabs) => this.page.locator(`//div[@role='tablist']//a[text()='${tab}']`)

  private productStatusItems = (status: ProductStatus) =>
    this.page.locator(`//ul[@aria-labelledby='status-select-label-status']//li[@data-value='${status}']`)

  private productPriorityItems = (priority: ProductPriority) =>
    this.page.locator(`//ul[@aria-labelledby='value-list-select-label-priority']//li[@data-value='${priority}']`)

  private productValue = (value: ProductValues) =>
    this.page.locator(`//div[contains(@class, 'MuiGrid-grid-md-6 css-iol86l') and ./h6[text()='${value}']]//h6[2]`)

  private productDesignerItems = (designer: string) =>
    this.page.locator(`//ul[@aria-labelledby='outlined-adornment-user']//li[@data-value='${designer}']`)

  private productTagItems = (tag: string) => this.page.locator(`//ul[@aria-labelledby='value-list-select-label-tag']//li[@data-value='${tag}']`)

  private productImage = (image: string) => this.page.locator(`//img[@title='${image}']`)

  private saveBtn: Locator
  private closeBtn: Locator
  private unlockBtn: Locator
  private trackingSelectStatusMenu: Locator
  private trackingSelectPriorityMenu: Locator
  private trackingSelectDesignerMenu: Locator
  private trackingSelectTagMenu: Locator
  private materialType: Locator

  constructor(page: Page) {
    super(page)
    this.saveBtn = page.locator("//button[text()='Save']")
    this.closeBtn = page.locator("//button[text()='Close']")
    this.unlockBtn = page.locator("//button[text()='Unlock']")
    this.trackingSelectStatusMenu = page.locator("//div[@id='status-select-status']")
    this.trackingSelectPriorityMenu = page.locator("//div[@id='value-list-select-priority']")
    this.trackingSelectDesignerMenu = page.locator("//div[@id='outlined-adornment-designer']")
    this.trackingSelectTagMenu = page.locator("//div[@id='value-list-select-tag']")
    this.materialType = page.locator("//input[@id='text-form-materialTypeFront']")
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

  public async clickSelectPriorityMenu() {
    await this.trackingSelectPriorityMenu.click()
  }

  public async clickSelectDesignerMenu() {
    await this.trackingSelectDesignerMenu.click()
  }

  public async clickSelectTagMenu() {
    await this.trackingSelectTagMenu.click()
  }

  public async getProductValue(item: ProductValues) {
    return await this.productValue(item).textContent()
  }

  public async setProductStatus(status: ProductStatus) {
    if (await this.trackingSelectStatusMenu.isVisible()) {
      await this.clickSelectStatusMenu()
      await this.productStatusItems(status).click()
      await this.clickSave()
    }
  }

  public async setProductPriority(priority: ProductPriority) {
    if (await this.trackingSelectPriorityMenu.isVisible()) {
      await this.clickSelectPriorityMenu()
      await this.productPriorityItems(priority).click()
      await this.clickSave()
    }
  }

  public async setProductDesigner(designer: string) {
    if (await this.trackingSelectDesignerMenu.isVisible()) {
      await this.clickSelectDesignerMenu()
      await this.productDesignerItems(designer).click()
      await this.clickSave()
    }
  }

  public async setProductTag(tag: string) {
    if (await this.trackingSelectTagMenu.isVisible()) {
      await this.clickSelectTagMenu()
      await this.productTagItems(tag).click()
      await this.clickSave()
    }
  }

  public async isProductImageVisible(image: string) {
    return await this.productImage(image).isVisible()
  }

  public async setMaterialType(type: string) {
    await this.materialType.fill(type)
    await this.clickSave()
  }

  public async getMaterialType() {
    return await this.materialType.getAttribute('value')
  }
}
