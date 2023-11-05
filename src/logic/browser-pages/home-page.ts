import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'

export class HomePage extends PageBase {
  private _sampleLocator: Locator

  constructor(page: Page) {
    super(page)
    this._sampleLocator = page.locator('.sample-class')
  }

  async initPage(): Promise<void> {
    await super.initPage()
  }

  get pageUrl(): string {
    if (!this.baseUrl) {
      throw new Error('Base url is not set')
    }
    return this.baseUrl
  }

  get sampleLocator(): Locator {
    return this._sampleLocator
  }

  public async getSampleText() {
    await this._sampleLocator.textContent()
  }
}
