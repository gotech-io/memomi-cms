import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'

export class UsersPage extends PageBase {
  private userRowData = (email: string, name: string) =>
    `//div[@role='row' and ./div[@col-id='email' and text()='${email}'] and ./div[@col-id='name' and text()='${name}']]`

  private searchInput: Locator
  private loadingCenter: Locator

  constructor(page: Page) {
    super(page)
    this.searchInput = page.locator("//input[@id='outlined-name']")
    this.loadingCenter = page.locator("//span[@class='ag-overlay-loading-center']")
  }

  async initPage(): Promise<void> {
    await super.initPage()
    await this.waitForLoadingCenterDetachment()
  }

  get pageUrl(): string {
    if (!this.baseUrl) throw new Error('Base url is not set')
    return this.baseUrl
  }

  public getUserDataByEmailAndNameString(email: string, name: string) {
    return this.userRowData(email, name)
  }

  public async editUser(email: string, name: string) {
    await this.page.locator(this.getUserDataByEmailAndNameString(email, name) + "//button[@aria-label='Edit']").click()
  }

  public async updateUserPassword(email: string, name: string) {
    await this.page.locator(this.getUserDataByEmailAndNameString(email, name) + "//button[@aria-label='Update Password']").click()
  }

  public async deleteUser(email: string, name: string) {
    await this.page.locator(this.getUserDataByEmailAndNameString(email, name) + "//button[@aria-label='Delete']").click()
  }

  public async fillSearchInput(input: string) {
    await this.searchInput.fill(input)
  }

  public async waitForLoadingCenterDetachment() {
    await this.loadingCenter.waitFor({ state: 'attached', timeout: 30000 })
    await this.loadingCenter.waitFor({ state: 'detached', timeout: 30000 })
  }
}
