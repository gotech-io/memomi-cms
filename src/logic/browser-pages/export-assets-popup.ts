import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { ProductFiles } from '../enum/product-files.js'
import { Product3dModel } from '../enum/product-3d-model.js'
import { configProvider } from '../../config/index.js'

export class ExportAssetsPopup extends PageBase {
  private exportAsset = (asset: ProductFiles | Product3dModel) => this.page.locator(`//li[@role='option' and text()='${asset}']`)

  private _selectExportDropdown: Locator
  private _startBtn: Locator
  private _closeBtn: Locator

  constructor(page: Page) {
    super(page)
    this._selectExportDropdown = page.locator("//div[./input[@id='select-export']]")
    this._startBtn = page.locator("//button[text()='Start']")
    this._closeBtn = page.locator("//button[text()='Close']")
  }

  async initPage(): Promise<void> {
    await super.initPage()
  }

  get pageUrl(): string {
    if (!this.baseUrl) throw new Error('Base url is not set')
    return this.baseUrl
  }

  public async clickSelectExportDropdown() {
    await this._selectExportDropdown.click()
  }

  public async clickStart() {
    await this._startBtn.click()
  }

  public async clickClose() {
    await this._closeBtn.click()
  }

  public async selectAssets(assets: (ProductFiles | Product3dModel)[]) {
    await this.clickSelectExportDropdown()

    for (const asset of assets) {
      await this.exportAsset(asset).click()
    }

    const downloadPromise = this.page.waitForEvent('download')
    await this.clickStart()
    const download = await downloadPromise
    await download.saveAs('./' + configProvider.walmartAutomationGeneratePath + download.suggestedFilename())
    await download.delete()
  }
}
