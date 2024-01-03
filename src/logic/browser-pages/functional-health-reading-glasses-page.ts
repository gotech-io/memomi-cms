import { Page } from '@playwright/test'
import { WalmartGlassesBasePage } from './walmart-glasses-base-page.js'

export class FunctionalHealthReadingGlassesPage extends WalmartGlassesBasePage {
  constructor(page: Page) {
    super(page)
  }

  async initPage(): Promise<void> {
    await super.initPage()
  }

  get pageUrl(): string {
    if (!this.baseUrl) throw new Error('Base url is not set')
    return this.baseUrl
  }
}
