import { Locator, Page } from '@playwright/test'
import { PageBase } from '@testomate/framework'
import { getFilesInFolder } from '../utils.js'

export class ImportAssetsPage extends PageBase {
  private uploadFilesInput: Locator

  constructor(page: Page) {
    super(page)
    this.uploadFilesInput = page.locator("//input[@type='file']")
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

  public async uploadItems() {
    const path = 'src/tests/browser/resources/walmart_auto_glass'
    const files = await getFilesInFolder(path)
    const filePaths = files.map(file => path + '/' + file)
    await this.uploadFilesInput.setInputFiles(filePaths)
  }
}
