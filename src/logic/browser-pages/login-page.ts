import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'

export class LoginPage extends PageBase {
    private emailInput: Locator
    private passwordInput: Locator
    private signInBtn: Locator

    constructor(page: Page) {
        super(page)
        this.emailInput = page.locator("//input[@type='email']")
        this.passwordInput = page.locator("//input[@type='password']")
        this.signInBtn = page.locator("//button[@type='submit']")
    }

    async initPage(): Promise<void> {
        await super.initPage()
    }

    get pageUrl(): string {
        if (!this.baseUrl) {
            throw new Error('Base url is not set')
        }
        return this.baseUrl + '/login'
    }

    public async fillEmailAddress(email: string) {
        await this.emailInput.fill(email)
    }

    public async fillPassword(password: string) {
        await this.passwordInput.fill(password)
    }

    public async clickSignIn() {
        await this.signInBtn.click()
    }

    public async performSignIn(email: string, password: string) {
        await this.fillEmailAddress(email)
        await this.fillPassword(password)
        await this.clickSignIn()
    }
}
