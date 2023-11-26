import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'

export class UsersPage extends PageBase {
  private userRowData = (email: string, name: string) =>
    this.page.locator(`//div[@role='row' and ./div[@col-id='email' and text()='${email}'] and ./div[@col-id='name' and text()='${name}']]`)

  private editUserBtn = (email: string, name: string) => this.userRowData(email, name).locator("//button[@aria-label='Edit']")

  private updateUserPasswordBtn = (email: string, name: string) => this.userRowData(email, name).locator("//button[@aria-label='Update Password']")

  private deleteUserBtn = (email: string, name: string) => this.userRowData(email, name).locator("//button[@aria-label='Delete']")

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

  public async editUser(email: string, name: string) {
    await this.editUserBtn(email, name).click()
  }

  public async updateUserPassword(email: string, name: string) {
    await this.updateUserPasswordBtn(email, name).click()
  }

  public async deleteUser(email: string, name: string) {
    await this.deleteUserBtn(email, name).click()
  }

  public async fillSearchInput(input: string) {
    await this.searchInput.fill(input)
  }

  public async waitForLoadingCenterDetachment() {
    await this.loadingCenter.waitFor({ state: 'attached', timeout: 30000 })
    await this.loadingCenter.waitFor({ state: 'detached', timeout: 30000 })
  }
}
