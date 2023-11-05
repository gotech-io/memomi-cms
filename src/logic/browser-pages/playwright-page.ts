import { Locator, Page } from '@playwright/test'
import { PageBase, logger } from '@testomate/framework'

export class PlaywrightPage extends PageBase {
  _navLogoLocator: Locator
  _searchLocator: Locator
  _searchInputLocator: Locator
  _resetSearchLocator: Locator

  constructor(page: Page) {
    super(page)
    this._navLogoLocator = page.locator('.navbar__logo')
    this._searchLocator = page.locator('.DocSearch-Button-Placeholder')
    this._searchInputLocator = page.locator('.DocSearch-Input')
    this._resetSearchLocator = page.getByRole('button', { name: 'Clear the query' })
  }

  async initPage(): Promise<void> {
    super.initPage()
    logger.debug('PlaywrightPage INIT PAGE')
  }

  get pageUrl(): string {
    if (!this.baseUrl) {
      throw new Error('Base url is not set')
    }
    return this.baseUrl
  }

  get navLogoLocator(): Locator {
    return this._navLogoLocator
  }

  get resetSearchLocator(): Locator {
    return this._resetSearchLocator
  }

  public async fillSearch(searchTerm: string): Promise<void> {
    await this._searchInputLocator.fill(searchTerm)
    await this.page.waitForTimeout(3000)
  }

  public async clickSearch() {
    await this._searchLocator.click()
  }

  public async midClickLogo() {
    await this._navLogoLocator.click({ button: 'middle' })
  }
}
