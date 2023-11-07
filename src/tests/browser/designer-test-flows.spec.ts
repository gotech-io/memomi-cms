import { expect, test } from '@testomate/framework'
import { DashboardPage } from '../../logic/browser-pages/dashboard-page.js'
import { WalmartGlassesPage } from '../../logic/browser-pages/walmart-glasses-page.js'
import { WalmartGlassesColumns } from '../../logic/enum/walmart-glasses-columns.js'
import { LoginPage } from '../../logic/browser-pages/login-page.js'
import { configProvider } from '../../config/index.js'
import { DropdownMenuItems } from '../../logic/enum/dropdown-menu-items.js'
import { unzipFile } from '../../logic/utils.js'
import fs from 'fs'

test.describe('Designer test flows', () => {
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ testContext }) => {
    const loginPage = await testContext.getPage(LoginPage, { shouldNavigate: true })
    await loginPage.performSignIn(configProvider.cmsAdmin, configProvider.cmsPassword)
    dashboardPage = await testContext.getPage(DashboardPage)
  })

  test('Zip file exists', async ({ testContext }) => {
    const gtin = '00010164351979'
    const files: string[] = JSON.parse(fs.readFileSync('src/tests/browser/resources/zip-files.json', 'utf8')).files

    await dashboardPage.clickWalmartGlasses()
    const walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.clickCheckRow([{ colId: WalmartGlassesColumns.GTIN, text: gtin }])
    await walmartGlassesPage.downloadItem(DropdownMenuItems.ExportToCSV)
    await walmartGlassesPage.downloadItem(DropdownMenuItems.ExportAssets)
    const zipFiles = await unzipFile()

    files.forEach(file => {
      expect.soft(zipFiles.includes(gtin + '/' + gtin + file), `The ZIP file does not contain an ${file} file`).toBeTruthy()
    })
  })
})
