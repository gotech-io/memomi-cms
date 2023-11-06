import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { AdminMailbox } from "../enum/admin-mailbox.js";

export class DashboardPage extends PageBase {
    private adminMailBoxCategory = (category: AdminMailbox) => `//div//p[text()='${category}'`

    private cmsVersion: Locator
    private connectedUserBtn: Locator
    private walmartGlassesLinkBtn: Locator
    private apparelSunglassesLinkBtn: Locator
    private toggleMenuBtn: Locator
    private adminMailboxOpen: Locator
    private adminMailboxClose: Locator
    private productsMailboxOpen: Locator
    private productsMailboxClose: Locator
    private productsWalmartGlasses: Locator
    private productsApparelSunglasses: Locator
    private showAllStatuesBtn: Locator
    private hideUnusedStatusesBtn: Locator
    private manageUsersBtn: Locator
    private showAllUsersBtn: Locator
    private hideInactiveUsersBtn: Locator

    constructor(page: Page) {
        super(page)
        this.cmsVersion = page.locator("//h5[contains(@class, 'MuiTypography-root MuiTypography-h5')]")
        this.connectedUserBtn = page.locator("//div[contains(@class, 'outlinedPrimary css-9n40nr')]//div[contains(@class, 'Avatar')]")
        this.walmartGlassesLinkBtn = page.locator("//div[contains(@class, 'grid-xs-12 css') and .//span[contains(text(), 'Walmart Glasses')]]//button")
        this.apparelSunglassesLinkBtn = page.locator("//div[contains(@class, 'grid-xs-12 css') and .//span[contains(text(), 'Apparel - Sunglasses')]]//button")
        this.toggleMenuBtn = page.locator("//button[@class='MuiButtonBase-root css-1cpn4ow']")
        this.adminMailboxOpen = page.locator("//div[contains(@class, 'MuiListItemButton-gutters Mui-selected')]//h5[text()='Admin']")
        this.adminMailboxClose = page.locator("//div[contains(@class, 'MuiListItemButton-gutters ')]//p[text()='Admin']")
        this.productsMailboxOpen = page.locator("//div[contains(@class, 'MuiListItemButton-gutters ')]//h5[text()='Products']")
        this.productsMailboxClose = page.locator("//div[contains(@class, 'MuiListItemButton-gutters ')]//p[text()='Products']")
        this.productsWalmartGlasses = page.locator("//div//span[text()='Walmart Glasses']")
        this.productsApparelSunglasses = page.locator("//div//span[text()='Apparel - Sunglasses']")
        this.showAllStatuesBtn = page.locator("//button[text()='Show all statues']")
        this.hideUnusedStatusesBtn = page.locator("//button[text()='Hide unused statuses']")
        this.manageUsersBtn = page.locator("//button[text()='Manage users']")
        this.showAllUsersBtn = page.locator("//button[text()='Show all users']")
        this.hideInactiveUsersBtn = page.locator("//button[text()='Hide inactive users']")
    }

    async initPage(): Promise<void> {
        await super.initPage()
        await this.page.waitForLoadState("networkidle")
    }

    get pageUrl(): string {
        if (!this.baseUrl) throw new Error('Base url is not set')
        return this.baseUrl + '/dashboard'
    }

    public async getCMSVersion() {
        const version = await this.cmsVersion.textContent();
        return version ? (version.match(/CMS Version: (\d+\.\d+(\.\d+)*)/) || [])[1] : null;
    }

    public async clickAdminMailBoxCategory(category: AdminMailbox) {
        await this.openAdminMailbox()
        await this.page.locator(this.adminMailBoxCategory(category)).click()
    }

    public async clickWalmartGlassesLink() {
        await this.walmartGlassesLinkBtn.click()
    }

    public async clickApparelSunglassesLink() {
        await this.apparelSunglassesLinkBtn.click()
    }

    public async clickUserMenu() {
        await this.connectedUserBtn.click()
    }

    public async clickToggleMenuBtn() {
        await this.toggleMenuBtn.click()
    }

    public async openAdminMailbox() {
        if (!await this.adminMailboxOpen.isVisible()) await this.adminMailboxClose.click()
    }

    public async openProductsMailbox() {
        if (!await this.productsMailboxOpen.isVisible()) await this.productsMailboxClose.click()
    }

    public async clickWalmartGlasses() {
        await this.openProductsMailbox()
        await this.productsWalmartGlasses.click()
    }

    public async clickApparelSunglasses() {
        await this.openProductsMailbox()
        await this.productsApparelSunglasses.click()
    }

    public async clickShowAllStatues() {
        await this.showAllStatuesBtn.click()
    }

    public async clickHideUnusedStatuses() {
        await this.hideUnusedStatusesBtn.click()
    }

    public async clickManageUsers() {
        await this.manageUsersBtn.click()
    }

    public async clickShowAllUsers() {
        await this.showAllUsersBtn.click()
    }

    public async clickHideInactiveUsers() {
        await this.hideInactiveUsersBtn.click()
    }
}
