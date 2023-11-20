import { expect, test } from '@testomate/framework'
import { DashboardPage } from '../../logic/browser-pages/dashboard-page.js'
import { WalmartGlassesPage } from '../../logic/browser-pages/walmart-glasses-page.js'
import { WalmartGlassesColumns } from '../../logic/enum/walmart-glasses-columns.js'
import { LoginPage } from '../../logic/browser-pages/login-page.js'
import { configProvider } from '../../config/index.js'
import { DropdownItems } from '../../logic/enum/dropdown-items.js'
import { getFilesInFolder, unzipFile } from '../../logic/utils.js'
import fs from 'fs'
import { ImportAssetsPage } from '../../logic/browser-pages/import-assets-page.js'
import { EditProductPage } from '../../logic/browser-pages/edit-product-page.js'
import { ProductTabs } from '../../logic/enum/product-tabs.js'

test.describe('Designer test flows', () => {
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ testContext }) => {
    const loginPage = await testContext.getPage(LoginPage, { shouldNavigate: true })
    await loginPage.performSignIn(configProvider.cmsAdmin, configProvider.cmsPassword)
    dashboardPage = await testContext.getPage(DashboardPage)
  })

  test('All files can be found after unzipping', async ({ testContext }) => {
    const gtin = '00010164351979'
    const files: string[] = JSON.parse(fs.readFileSync('src/tests/browser/resources/zip-files.json', 'utf8')).files

    await dashboardPage.clickWalmartGlasses()

    const walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.clickCheckRow([{ colId: WalmartGlassesColumns.GTIN, text: gtin }])
    await walmartGlassesPage.downloadItem(DropdownItems.ExportAssets)

    const zipFiles = await unzipFile()

    files.forEach(file => {
      expect.soft(zipFiles.includes(gtin + '/' + gtin + file), `The ZIP file does not contain an ${file} file`).toBeTruthy()
    })
  })

  test('Import assets, Upload images', async ({ testContext }) => {
    const files = await getFilesInFolder('src/tests/browser/resources/walmart_auto_glass')
    const images = files.filter(image => image.includes('.jpg'))

    await dashboardPage.clickWalmartGlasses()

    const walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.downloadItem(DropdownItems.ImportAssets)

    const importAssetsPage = await testContext.getPage(ImportAssetsPage)
    await importAssetsPage.uploadItems()

    await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, 'walmart-auto')
    await walmartGlassesPage.clickEditLine([{ colId: WalmartGlassesColumns.GTIN, text: 'walmart-automation' }])

    const editProductPage = await testContext.getPage(EditProductPage)
    await editProductPage.clickTab(ProductTabs.Images)

    for (const image of images) {
      expect.soft(await editProductPage.isProductImageVisible(image), `The image ${image} was not successfully uploaded`).toBeTruthy()
    }
  })
})
