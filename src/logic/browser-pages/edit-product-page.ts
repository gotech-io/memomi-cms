import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { ProductTabs } from "../enum/product-tabs.js";
import { ProductStatus } from "../enum/product-status.js";

export class EditProductPage extends PageBase {
    private productTab = (tab: ProductTabs) => `//div[@role='tablist']//a[text()='${tab}']`
    private productStatusItems = (status: ProductStatus) => `//ul[@aria-labelledby='status-select-label-status']//li[@data-value='${status}']`
    private productValue = (item: ProductStatus) => `//div[contains(@class, 'MuiGrid-grid-md-6 css-iol86l') and ./h6[text()='${item}']]//h6[2]]`

    private saveBtn: Locator
    private closeBtn: Locator
    private unlockBtn: Locator
    private trackingSelectStatusMenu: Locator

    constructor(page: Page) {
        super(page)
        this.saveBtn = page.locator("//button[text()='Save']")
        this.closeBtn = page.locator("//button[text()='Close']")
        this.unlockBtn = page.locator("//button[text()='Unlock']")
        this.trackingSelectStatusMenu = page.locator("//div[@id='status-select-status']")
    }

    async initPage(): Promise<void> {
        await super.initPage()
    }

    get pageUrl(): string {
        if (!this.baseUrl) throw new Error('Base url is not set')
        return this.baseUrl
    }

    public async clickTab(tab: ProductTabs) {
        await this.page.locator(this.productTab(tab)).click()
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

    public async getProductItemValue(item: ProductStatus) {
        return await this.page.locator(this.productValue(item)).textContent()
    }

    public async setProductStatus(status: ProductStatus) {
        if (await this.trackingSelectStatusMenu.isVisible()) {
            await this.clickSelectStatusMenu()
            await this.page.locator(this.productStatusItems(status)).click()
        }
    }
}