import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'

export class DashboardPage extends PageBase {
    private cmsVersion: Locator

    constructor(page: Page) {
        super(page)
        this.cmsVersion = page.locator("//h5[contains(@class, 'MuiTypography-gutterBottom css-71lg81')]")
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

    public async getCMSVersion() {
        const version = await this.cmsVersion.textContent();
        return version ? (version.match(/CMS Version: (\d+\.\d+(\.\d+)*)/) || [])[1] : null;
    }
}
