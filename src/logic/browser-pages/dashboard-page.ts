import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { AdminMailbox } from '../enum/admin-mailbox.js'
import { ProductList } from '../enum/product-list.js'

export class DashboardPage extends PageBase {
  private adminMailBoxCategory = (category: AdminMailbox) => this.page.locator(`//div//p[text()='${category}'`)

  private unCheckProduct = (product: ProductList) =>
    this.page.locator(`//label[./span[contains(text(), '${product}')]]//span[contains(@class, 'checked') and ./input]`)

  private productCount = (product: ProductList) => this.page.locator(`//label//span[contains(text(), '${product}')]`)

  private adminMailbox = (option: AdminMailbox) => this.page.locator(`//a//div//p[text()='${option}']`)

  private _cmsVersion: Locator
  private _connectedUserBtn: Locator
  private _walmartGlassesLinkBtn: Locator
  private _apparelSunglassesLinkBtn: Locator
  private _toggleMenuBtn: Locator
  private _adminMailboxOpen: Locator
  private _adminMailboxClose: Locator
  private _productsMailboxOpen: Locator
  private _productsMailboxClose: Locator
  private _productsWalmartGlasses: Locator
  private _productsApparelSunglasses: Locator
  private _functionalHealthReadingGlasses: Locator
  private _showAllStatuesBtn: Locator
  private _hideUnusedStatusesBtn: Locator
  private _manageUsersBtn: Locator
  private _showAllUsersBtn: Locator
  private _hideInactiveUsersBtn: Locator
  private _userSettings: Locator
  private _logoutBtn: Locator
  private _statusDistribution: Locator
  private _activeTeamMembers: Locator
  private _allTeamMembers: Locator
  private _allTeamMembersTitle: Locator

  constructor(page: Page) {
    super(page)
    this._cmsVersion = page.locator("//h5[contains(@class, 'MuiTypography-root MuiTypography-h5')]")
    this._connectedUserBtn = page.locator("//div[contains(@class, 'outlinedPrimary css-9n40nr')]//div[contains(@class, 'Avatar')]")
    this._walmartGlassesLinkBtn = page.locator("//div[contains(@class, 'grid-xs-12 css') and .//span[contains(text(), 'Walmart Glasses')]]//button")
    this._apparelSunglassesLinkBtn = page.locator(
      "//div[contains(@class, 'grid-xs-12 css') and .//span[contains(text(), 'Apparel - Sunglasses')]]//button",
    )
    this._toggleMenuBtn = page.locator("//button[@class='MuiButtonBase-root css-1cpn4ow']")
    this._adminMailboxOpen = page.locator("//div[contains(@class, 'MuiListItemButton-gutters Mui-selected')]//h5[text()='Admin']")
    this._adminMailboxClose = page.locator("//div[contains(@class, 'MuiListItemButton-gutters ')]//p[text()='Admin']")
    this._productsMailboxOpen = page.locator("//div[contains(@class, 'MuiListItemButton-gutters ')]//h5[text()='Products']")
    this._productsMailboxClose = page.locator("//div[contains(@class, 'MuiListItemButton-gutters ')]//p[text()='Products']")
    this._productsWalmartGlasses = page.locator("//div//span[text()='Walmart Glasses']")
    this._productsApparelSunglasses = page.locator("//div//span[text()='Apparel - Sunglasses']")
    this._functionalHealthReadingGlasses = page.locator("//div//span[text()='Functional Health - Reading Glasses']")
    this._showAllStatuesBtn = page.locator("//button[text()='Show all statues']")
    this._hideUnusedStatusesBtn = page.locator("//button[text()='Hide unused statuses']")
    this._manageUsersBtn = page.locator("//button[text()='Manage users']")
    this._showAllUsersBtn = page.locator("//button[text()='Show all users']")
    this._hideInactiveUsersBtn = page.locator("//button[text()='Hide inactive users']")
    this._userSettings = page.locator("//div[contains(@class, 'MuiChip-outlinedPrimary')]")
    this._logoutBtn = page.locator("//p[text()='Logout']")
    this._statusDistribution = page.locator("//div//span[contains(text(), 'Status Distribution')]")
    this._activeTeamMembers = page.locator(
      "//div[contains(@class, 'MuiPaper-rounded') and ./div//span[contains(text(), 'Active Team members')]]" +
        " //div[contains(@class, 'MuiGrid-spacing-xs-3')]//div[contains(@class, 'MuiGrid-grid-xs-12 css')]",
    )
    this._allTeamMembers = page.locator(
      "//div[contains(@class, 'MuiPaper-root MuiPaper-elevation MuiPaper-rounded') and ./div//span[contains(text(), 'All Team members')]]" +
        "//div[contains(@class, 'MuiGrid-spacing-xs-3')]//div[contains(@class, 'MuiGrid-grid-xs-12')]",
    )
    this._allTeamMembersTitle = page.locator("//div//span[contains(text(), 'All Team members')]")
  }

  async initPage(): Promise<void> {
    await super.initPage()
    // eslint-disable-next-line playwright/no-networkidle
    await this.page.waitForLoadState('networkidle')
  }

  get pageUrl(): string {
    if (!this.baseUrl) throw new Error('Base url is not set')
    return this.baseUrl + '/dashboard'
  }

  public async getCMSVersion() {
    const version = await this._cmsVersion.textContent()
    return version ? (version.match(/CMS Version: (\d+\.\d+(\.\d+)*)/) || [])[1] : null
  }

  public async clickAdminMailBoxCategory(category: AdminMailbox) {
    await this.openAdminMailbox()
    await this.adminMailBoxCategory(category).click()
  }

  public async clickUserSettings() {
    await this._userSettings.click()
  }

  public async clickLogout() {
    await this._logoutBtn.click()
  }

  public async performLogout() {
    await this.clickUserSettings()
    await this.clickLogout()
  }

  public async clickWalmartGlassesLink() {
    await this._walmartGlassesLinkBtn.click()
  }

  public async clickApparelSunglassesLink() {
    await this._apparelSunglassesLinkBtn.click()
  }

  public async clickUserMenu() {
    await this._connectedUserBtn.click()
  }

  public async clickToggleMenuBtn() {
    await this._toggleMenuBtn.click()
  }

  public async openAdminMailbox() {
    if (!(await this._adminMailboxOpen.isVisible())) await this._adminMailboxClose.click()
  }

  public async openProductsMailbox() {
    if (!(await this._productsMailboxOpen.isVisible())) await this._productsMailboxClose.click()
  }

  public async clickWalmartGlasses() {
    await this.openProductsMailbox()
    await this._productsWalmartGlasses.click()
  }

  public async clickApparelSunglasses() {
    await this.openProductsMailbox()
    await this._productsApparelSunglasses.click()
  }

  public async clickFunctionalHealthReadingGlasses() {
    await this.openProductsMailbox()
    await this._functionalHealthReadingGlasses.click()
  }

  public async clickShowAllStatues() {
    await this._showAllStatuesBtn.click()
  }

  public async clickHideUnusedStatuses() {
    await this._hideUnusedStatusesBtn.click()
  }

  public async clickManageUsers() {
    await this._manageUsersBtn.click()
  }

  public async clickShowAllUsers() {
    await this._showAllUsersBtn.click()
  }

  public async clickHideInactiveUsers() {
    await this._hideInactiveUsersBtn.click()
  }

  public async fetchGlassesCount(walmartGlasses: string) {
    const regexPattern = /^(.*?) \(Count: (\d+)\)$/
    const match = regexPattern.exec(walmartGlasses)
    return match ? parseInt(match[2], 10) ?? 0 : 0
  }

  public async fetchProductCount(product: ProductList) {
    return await this.fetchGlassesCount(String(await this.productCount(product).textContent()))
  }

  public async fetchStatusDistribution() {
    const statusDistribution = String(await this._statusDistribution.textContent())
    const regexPattern = /Status Distribution \((\d+)\)/
    const match = regexPattern.exec(statusDistribution)

    if (match && match[1]) {
      return parseInt(match[1], 10)
    } else {
      return null
    }
  }

  public async clickUncheckProduct(product: ProductList) {
    await this.unCheckProduct(product).click()
  }

  public async clickAdminOption(option: AdminMailbox) {
    await this.openAdminMailbox()
    await this.adminMailbox(option).click()
  }

  public async getUrl() {
    return this.page.url()
  }

  public async activeTeamMembers() {
    return await this._activeTeamMembers.count()
  }

  public async allTeamMembers() {
    return await this._allTeamMembers.count()
  }

  public async fetchAllTeamMembers(): Promise<number | null> {
    const match = String(await this._allTeamMembersTitle.textContent()).match(/\((\d+)\)/)
    return match ? parseInt(match[1], 10) || null : null
  }
}
