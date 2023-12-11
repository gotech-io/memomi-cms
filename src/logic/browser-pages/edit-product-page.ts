import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { ProductTabs } from '../enum/product-tabs.js'
import { getProductStatus, ProductStatus } from '../enum/product-status.js'
import { ProductValues } from '../enum/product-values.js'
import { ProductPriority } from '../enum/product-priority.js'
import { configProvider } from '../../config/index.js'
import { getAllFiles, waitForStringInResult } from '../utils.js'
import { ProductFiles } from '../enum/product-files.js'
import { Product3dModel } from '../enum/product-3d-model.js'

export class EditProductPage extends PageBase {
  private productTab = (tab: ProductTabs) => this.page.locator(`//div[@role='tablist']//a[text()='${tab}']`)

  private productStatusItems = (status: ProductStatus) =>
    this.page.locator(`//ul[@aria-labelledby='status-select-label-status']//li[@data-value='${status}']`)

  private productPriorityItems = (priority: ProductPriority) =>
    this.page.locator(`//ul[@aria-labelledby='value-list-select-label-priority']//li[@data-value='${priority}']`)

  private productValue = (value: ProductValues) =>
    this.page.locator(`//div[contains(@class, 'MuiGrid-grid-md-6 css-iol86l') and ./h6[text()='${value}']]//h6[2]`)

  private productInputValue = (value: ProductValues) => this.page.locator(`//div[./label[text()='${value}']]//input`)

  private productDesignerItems = (designer: string) =>
    this.page.locator(`//ul[@aria-labelledby='outlined-adornment-user']//li[@data-value='${designer}']`)

  private productTagItems = (tag: string) => this.page.locator(`//ul[@aria-labelledby='value-list-select-label-tag']//li[@data-value='${tag}']`)

  private productImage = (image: string) => this.page.locator(`//img[@title='${image}']`)

  private uploadImageInput = (image: ProductFiles) => this.page.locator(`//div[./h6[text()='${image}']]//input[@name='file']`)

  private deleteFileBtn = (file: ProductFiles | Product3dModel) =>
    this.page.locator(`//div[./h6[text()='${file}']]//button[./*[local-name()='svg' and @data-testid='DeleteIcon']]`)

  private openInNewTabBtn = (image: ProductFiles) =>
    this.page.locator(`//div[./h6[text()='${image}']]//button[./*[local-name()='svg' and @data-testid='OpenInNewIcon']]`)

  private imageUrl = (image: ProductFiles) => this.page.locator(`//div[./h6[text()='${image}']]//a`)

  private uploadComplete = (file: ProductFiles | Product3dModel) => this.page.locator(`//div[./h6[text()='${file}']]//div[text()='100%']`)

  private uploadStlInput = (stl: Product3dModel) => this.page.locator(`//div[./h6[text()='${stl}']]//input[@name='file']`)

  private fieldInput = (file: ProductFiles | Product3dModel) => this.page.locator(`//div[./h6[text()='${file}']]//input[@id='filled-helperText']`)

  private getComment = (comment: string) =>
    this.page.locator(
      `//div[contains(@class, 'MuiBox-root css')]//div[contains(@class, 'MuiGrid-container MuiGrid-spacing-xs-0')]//div[text()='${comment}']`,
    )

  private deleteCommentBtn = (comment: string) =>
    this.page.locator(
      `//div[contains(@class, 'MuiBox-root css')]//div[contains(@class, 'MuiGrid-container MuiGrid-spacing-xs-0') and ./div//div[text()='${comment}']]//button`,
    )

  private timelineStatusChanged = (fromStatus: ProductStatus, toStatus: ProductStatus) =>
    this.page.locator(`//div[./h1[text()='Status changed'] and ./p[text()="Changed from '${fromStatus}' to '${toStatus}'"]]`)

  private disabledStatus = (status: ProductStatus) =>
    this.page.locator(`//li[contains(@class, 'MuiButtonBase-root MuiMenuItem-root Mui-disabled') and @data-value='${status}']`)

  private saveBtn: Locator
  private closeBtn: Locator
  private unlockBtn: Locator
  private trackingSelectStatusMenu: Locator
  private trackingSelectPriorityMenu: Locator
  private trackingSelectDesignerMenu: Locator
  private trackingSelectTagMenu: Locator
  private materialType: Locator
  private teflonId: Locator
  private frameType: Locator
  private hingeType: Locator
  private productUpdatedAlert: Locator
  private productStatusValue: Locator
  private productPriorityValue: Locator
  private productDesignerValue: Locator
  private productTagValue: Locator
  private commentsBtn: Locator
  private addCommentBtn: Locator
  private addCommentInput: Locator
  private addBtn: Locator
  private numComment: Locator
  private commentDeleted: Locator
  private statusBtn: Locator
  private selectStatusDropdown: Locator
  private imageBtn: Locator
  private imageNavBtn: Locator
  private fullScreenBtn: Locator
  private closeFullScreenBtn: Locator

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
    this.teflonId = page.locator("//input[@id='text-form-teflonId']")
    this.frameType = page.locator("//input[@id='text-form-frameType']")
    this.hingeType = page.locator("//input[@id='text-form-hingeType']")
    this.productUpdatedAlert = page.locator("//div[contains(@class, 'message css') and text()='Product updated']")
    this.productStatusValue = page.locator("//div[./div[@id='status-select-status']]//input[@name='status']")
    this.productPriorityValue = page.locator("//div[./div[@id='value-list-select-priority']]//input[@name='priority']")
    this.productDesignerValue = page.locator("//div[./div[@id='outlined-adornment-designer']]//input[@name='designer']")
    this.productTagValue = page.locator("//div[./div[@id='value-list-select-tag']]//input[@name='tag']")
    this.commentsBtn = page.locator("//button[@aria-label='Comments']")
    this.addCommentBtn = page.locator("//button[text()='Add Comment']")
    this.addCommentInput = page.locator("//input[@placeholder='Add comment']")
    this.addBtn = page.locator("//button[text()='Add']")
    this.numComment = this.commentsBtn.locator('//span[text()]')
    this.commentDeleted = page.locator("//div//span[text()='Comment deleted ']")
    this.statusBtn = page.locator("//button[@aria-label='Status']")
    this.selectStatusDropdown = page.locator("//div[@id='status-select-status']")
    this.imageBtn = page.locator("//button[@aria-label='Images']")
    this.imageNavBtn = page.locator('//div[./button and ./a[@href]]')
    this.fullScreenBtn = page.locator("//button[@aria-label='Full screen']")
    this.closeFullScreenBtn = page.locator("//button[@aria-label='close']")
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
    await this.page.waitForResponse(
      response => response.url().includes('/api/products/') && response.status() === 200 && response.request().method() === 'GET',
    )
    await this.page.waitForResponse(
      response => response.url().includes('/api/products/update/') && response.status() === 200 && response.request().method() === 'PUT',
    )
    await this.waitForProductUpdatedAlert()
  }

  public async clickSaveThenClose() {
    await this.clickSave()
    await this.clickClose()
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

  public async fetchProductStatus() {
    return await this.productStatusValue.getAttribute('value')
  }

  public async clickSelectPriorityMenu() {
    await this.trackingSelectPriorityMenu.click()
  }

  public async fetchProductPriority() {
    return await this.productPriorityValue.getAttribute('value')
  }

  public async clickSelectDesignerMenu() {
    await this.trackingSelectDesignerMenu.click()
  }

  public async fetchProductDesigner() {
    return await this.productDesignerValue.getAttribute('value')
  }

  public async clickSelectTagMenu() {
    await this.trackingSelectTagMenu.click()
  }

  public async fetchProductTag() {
    return await this.productTagValue.getAttribute('value')
  }

  public async getProductValue(item: ProductValues) {
    return await this.productValue(item).textContent()
  }

  public async getProductInputValue(item: ProductValues) {
    const attributeValue = await this.productInputValue(item).getAttribute('value')
    return attributeValue !== null ? parseInt(attributeValue, 10) : undefined
  }

  public async setProductStatus(status: ProductStatus) {
    await this.clickSelectStatusMenu()
    await this.productStatusItems(status).click()
  }

  public async setProductPriority(priority: ProductPriority) {
    await this.clickSelectPriorityMenu()
    await this.productPriorityItems(priority).click()
  }

  public async setProductDesigner(designer: string) {
    await this.clickSelectDesignerMenu()
    await this.productDesignerItems(designer).click()
  }

  public async setProductTag(tag: string) {
    await this.clickSelectTagMenu()
    await this.productTagItems(tag).click()
  }

  public isProductImageVisible(image: string) {
    return this.productImage(image)
  }

  public async setMaterialType(type: string) {
    await this.materialType.fill(type)
  }

  public async getMaterialType() {
    return await this.materialType.getAttribute('value')
  }

  public async setTeflonId(id: string) {
    await this.teflonId.fill(id)
  }

  public async getTeflonId() {
    return await this.teflonId.getAttribute('value')
  }

  public async setFrameType(type: string) {
    await this.frameType.fill(type)
  }

  public async getFrameType() {
    return await this.frameType.getAttribute('value')
  }

  public async setHingeType(type: string) {
    await this.hingeType.fill(type)
  }

  public async getHingeType() {
    return await this.hingeType.getAttribute('value')
  }

  public async waitForProductUpdatedAlert() {
    await this.productUpdatedAlert.waitFor({ state: 'visible' })
  }

  public async uploadImage(uploadImage: ProductFiles, gtin: string, prefix: string) {
    const path = configProvider.walmartAutomationGeneratePath + gtin + '/'
    const filePaths = (await getAllFiles(path)).filter(image => image.includes(prefix) && !image.includes('invalid')).map(file => path + '/' + file)
    await this.uploadImageInput(uploadImage).setInputFiles(filePaths)
    await this.page.waitForResponse(response => response.url().includes('api/upload/') && response.status() === 200)
    await this.uploadComplete(uploadImage).waitFor({ state: 'visible' })
  }

  public async deleteFile(file: ProductFiles | Product3dModel) {
    await this.deleteFileBtn(file).click()
    await this.uploadComplete(file).waitFor({ state: 'detached' }) // Todo: A real bug with a low priority.
  }

  public isUploadCompleteVisible(file: ProductFiles | Product3dModel) {
    return this.uploadComplete(file)
  }

  public async openInANewTab(image: ProductFiles) {
    await waitForStringInResult(() => this.imageNewTabUrl(image), 'https://cmsdevserverapi.azurewebsites.net/api/download/', 10, 500)
    const waitForEvent = this.page.waitForEvent('popup')
    await this.openInNewTabBtn(image).click()
    await waitForEvent
  }

  public async imageNewTabUrl(image: ProductFiles) {
    return await this.imageUrl(image).getAttribute('href')
  }

  fetchTabUrls = async () => {
    return [
      ...new Set(
        this.page
          .context()
          .pages()
          .map(page => page.url()),
      ),
    ]
  }

  public async uploadStl(gtin: string) {
    const uploadStl: Product3dModel = Product3dModel.STL
    const path = configProvider.walmartAutomationGeneratePath + gtin + '/'
    const filePaths = (await getAllFiles(path)).filter(image => image.includes('.stl')).map(file => path + '/' + file)
    await this.uploadStlInput(uploadStl).setInputFiles(filePaths)
    await this.page.waitForResponse(response => response.url().endsWith('/stl') && response.status() === 200)
    await this.uploadComplete(uploadStl).waitFor({ state: 'visible' })
  }

  public async uploadInput(file: ProductFiles | Product3dModel) {
    return String(await this.fieldInput(file).getAttribute('value'))
  }

  public async addComment(comment: string) {
    if (!(await this.addCommentBtn.isVisible())) {
      await this.commentsBtn.click()
    }
    await this.addCommentBtn.click()
    await this.addCommentInput.fill(comment)
    await this.addBtn.click()
  }

  public isCommentVisible(comment: string) {
    return this.getComment(comment)
  }

  public async isCommentsContainerVisible() {
    if (!(await this.addCommentBtn.isVisible())) {
      await this.commentsBtn.click()
    }
    return this.addCommentBtn.isVisible()
  }

  public async fetchComments() {
    const comment = await this.numComment.textContent()
    return comment !== null ? parseInt(comment, 10) : undefined
  }

  public async deleteComment(comment: string) {
    await this.deleteCommentBtn(comment).click()
    await this.commentDeleted.waitFor({ state: 'attached' })
  }

  public isCommentDeleted() {
    return this.commentDeleted
  }

  public async isTimelineStatusChanged(fromStatus: ProductStatus, toStatus: ProductStatus) {
    return this.timelineStatusChanged(fromStatus, toStatus).isVisible()
  }

  public async isStatusContainerVisible() {
    if (!(await this.selectStatusDropdown.isVisible())) await this.statusBtn.click()
    return this.selectStatusDropdown.isVisible()
  }

  public async isImagesContainerVisible() {
    if (!(await this.imageNavBtn.isVisible())) await this.imageBtn.click()
    return this.imageNavBtn.isVisible()
  }

  public async isFullScreenContainerVisible() {
    if (!(await this.closeFullScreenBtn.isVisible())) await this.fullScreenBtn.click()
    return this.closeFullScreenBtn.isVisible()
  }

  public async fetchEnabledStatus() {
    const enabledStatus: ProductStatus[] = []
    const productStatus = getProductStatus()

    if (await this.trackingSelectStatusMenu.isVisible()) await this.clickSelectStatusMenu()

    for (const status of productStatus) {
      if (!(await this.disabledStatus(status).isVisible())) enabledStatus.push(status)
    }

    return enabledStatus
  }
}
