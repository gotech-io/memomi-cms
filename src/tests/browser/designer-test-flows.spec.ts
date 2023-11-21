import { expect, test } from '@testomate/framework'
import { DashboardPage } from '../../logic/browser-pages/dashboard-page.js'
import { WalmartGlassesPage } from '../../logic/browser-pages/walmart-glasses-page.js'
import { WalmartGlassesColumns } from '../../logic/enum/walmart-glasses-columns.js'
import { LoginPage } from '../../logic/browser-pages/login-page.js'
import { configProvider } from '../../config/index.js'
import { DropdownItems } from '../../logic/enum/dropdown-items.js'
import { getAllFiles, unzipFiles } from '../../logic/utils.js'
import fs from 'fs'
import { ImportAssetsPage } from '../../logic/browser-pages/import-assets-page.js'
import { EditProductPage } from '../../logic/browser-pages/edit-product-page.js'
import { ProductTabs } from '../../logic/enum/product-tabs.js'
import { UsersApi } from '../../logic/api/users-api.js'
import { loginRequest } from '../../logic/api/request/login-request.js'
import { ProductsApi } from '../../logic/api/products-api.js'
import { productRequest } from '../../logic/api/request/product-request.js'

test.describe('Designer test flows', () => {
  let loginPage: LoginPage
  let dashboardPage: DashboardPage
  let loginApi: UsersApi
  let productsApi: ProductsApi

  test.beforeEach(async ({ testContext }) => {
    loginPage = await testContext.getPage(LoginPage, { shouldNavigate: true })
    await loginPage.performSignIn(configProvider.cmsDesigner, configProvider.cmsPassword)

    loginApi = await testContext.getApi(UsersApi)
    productsApi = await testContext.getApi(ProductsApi)
    dashboardPage = await testContext.getPage(DashboardPage)
  })

  test('All files can be found after unzipping', async ({ testContext }) => {
    const productGTIN = '00010164351979'
    const productFiles: string[] = JSON.parse(fs.readFileSync('src/tests/browser/resources/product-files.json', 'utf8')).files

    await dashboardPage.clickWalmartGlasses()

    const walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.clickCheckRow([{ colId: WalmartGlassesColumns.GTIN, text: productGTIN }])
    await walmartGlassesPage.downloadItem(DropdownItems.ExportAssets)
    const zipFiles = await unzipFiles()

    productFiles.forEach(file => {
      expect.soft(zipFiles.includes(productGTIN + '/' + productGTIN + file), `The ZIP file does not contain an ${file} file`).toBeTruthy()
    })
  })

  test('Import assets & Upload images', async ({ testContext }) => {
    testContext.addTearDownAction(() => productsApi.deleteProduct(configProvider.walmartAutomationProduct, loginApiRes.item.token))

    const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
    await productsApi.createProduct(productRequest(configProvider.walmartAutomationProduct), loginApiRes.item.token)

    const files = await getAllFiles('src/tests/browser/resources/walmart_auto_glass')
    const images = files.filter(image => image.includes('.jpg'))

    await dashboardPage.clickWalmartGlasses()

    const walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.downloadItem(DropdownItems.ImportAssets)

    const importAssetsPage = await testContext.getPage(ImportAssetsPage)
    await importAssetsPage.uploadItems()

    await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, configProvider.walmartAutomationProduct)
    await walmartGlassesPage.clickEditLine([
      {
        colId: WalmartGlassesColumns.GTIN,
        text: configProvider.walmartAutomationProduct,
      },
    ])

    const editProductPage = await testContext.getPage(EditProductPage)
    await editProductPage.clickTab(ProductTabs.Images)

    for (const image of images) {
      expect.soft(await editProductPage.isProductImageVisible(image), `The image ${image} was not successfully uploaded`).toBeTruthy()
    }
  })
})
