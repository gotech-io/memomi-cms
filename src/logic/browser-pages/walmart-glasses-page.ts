import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { WalmartGlassesColumns } from "../enum/walmart-glasses-columns.js";
import { generateColumnLocator } from "../utils.js";

export class WalmartGlassesPage extends PageBase {
    private searchFreeText: Locator
    private assignedToMeButton: Locator
    private previewButton: Locator
    private createNewProductButton: Locator
    private threeDotsMenuButton: Locator
    private mainCheckbox: Locator

    constructor(page: Page) {
        super(page)
        this.searchFreeText = page.locator("//label[@id='outlined-search-label']")
        this.assignedToMeButton = page.locator("//button[text()='Assigned to me']")
        this.previewButton = page.locator("//button[text()='Preview']")
        this.createNewProductButton = page.locator("//button[@id='add-button']")
        this.threeDotsMenuButton = page.locator("//button[@id='menu-button']")
        this.mainCheckbox = page.locator("//div[@class='ag-header-row ag-header-row-column']//div[@col-id='_id']//input")
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

    public isTableDataVisible(columns: { colId: WalmartGlassesColumns; text: string }[]) {
        return this.page.locator(generateColumnLocator(columns)).isVisible()
    }

    public async clickCheckedLine(columns: { colId: WalmartGlassesColumns; text: string }[]) {
        await this.page.locator(generateColumnLocator(columns) + "//input").click()
    }

    public async clickEditLine(columns: { colId: WalmartGlassesColumns; text: string }[]) {
        await this.page.locator(generateColumnLocator(columns) + "//button[@aria-label='Edit']").click()
    }

    public async fillSearchFreeText(text: string) {
        await this.searchFreeText.fill(text)
    }

    public async clickAssignedToMe() {
        await this.assignedToMeButton.click()
    }

    public async clickPreview() {
        await this.previewButton.click()
    }

    public async clickCreateNewProduct() {
        await this.createNewProductButton.click()
    }

    public async clickMenuButton() {
        await this.threeDotsMenuButton.click()
    }

    public async clickMainCheckbox() {
        await this.mainCheckbox.click()
    }
}
