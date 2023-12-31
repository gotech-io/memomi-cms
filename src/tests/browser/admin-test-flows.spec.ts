import { expect, test } from '@testomate/framework'
import { LoginPage } from '../../logic/browser-pages/login-page.js'
import { DashboardPage } from '../../logic/browser-pages/dashboard-page.js'
import { WalmartGlassesPage } from '../../logic/browser-pages/walmart-glasses-page.js'
import { EditProductPage } from '../../logic/browser-pages/edit-product-page.js'
import { UsersApi } from '../../logic/api/users-api.js'
import { ProductsApi } from '../../logic/api/products-api.js'
import { WalmartGlassesColumns } from '../../logic/enum/walmart-glasses-columns.js'
import { configProvider } from '../../config/index.js'
import { createCSV, deleteFolder, generateProductGtin } from '../../logic/utils.js'
import { loginRequest } from '../../logic/api/request/login-request.js'
import { productRequest } from '../../logic/api/request/product-request.js'
import { ProductTabs } from '../../logic/enum/product-tabs.js'
import { DropdownItems } from '../../logic/enum/dropdown-items.js'
import { ImportProductsPage } from '../../logic/browser-pages/import-products-page.js'
import { ProductValues } from '../../logic/enum/product-values.js'
import { ProductStatus } from '../../logic/enum/product-status.js'

test.describe('@Admin test flows', () => {
  let loginPage: LoginPage
  let dashboardPage: DashboardPage
  let walmartGlassesPage: WalmartGlassesPage
  let editProductPage: EditProductPage
  let loginApi: UsersApi
  let productsApi: ProductsApi
  let walmartAutoProduct: { text: string; colId: WalmartGlassesColumns }[]
  let productGtin: string

  test.beforeEach(async ({ testContext }) => {
    loginPage = await testContext.getPage(LoginPage, { shouldNavigate: true })
    await loginPage.performSignIn(configProvider.cmsAdmin, configProvider.cmsPassword)
    dashboardPage = await testContext.getPage(DashboardPage)
    await dashboardPage.clickWalmartGlasses()
    productGtin = generateProductGtin()
  })

  test('Create a product that already exist', async ({ testContext }) => {
    testContext.addTearDownAction(() => {
      return productsApi.deleteProduct(productGtin, loginApiRes.item.token)
    })

    loginApi = await testContext.getApi(UsersApi)
    productsApi = await testContext.getApi(ProductsApi)

    const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
    await productsApi.createProduct(productRequest(productGtin), loginApiRes.item.token)

    walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.createNewProduct(productGtin)
    await expect(await walmartGlassesPage.isProductExistAlertVisible(productGtin)).toBeVisible()
  })

  test('Changing the status of multiple products at once', async ({ testContext }) => {
    testContext.addTearDownAction(async () => {
      await Promise.all(productsGtin.map(productGtin => productsApi.deleteProduct(productGtin, loginApiRes.item.token)))
    })

    const productsGtin = [generateProductGtin(), generateProductGtin()]

    loginApi = await testContext.getApi(UsersApi)
    productsApi = await testContext.getApi(ProductsApi)

    const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
    await Promise.all(productsGtin.map(productGtin => productsApi.createProduct(productRequest(productGtin), loginApiRes.item.token)))

    walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, configProvider.walmartAutomationProduct)

    for (const productGtin of productsGtin) {
      await walmartGlassesPage.clickCheckRow([{ colId: WalmartGlassesColumns.GTIN, text: productGtin }])
    }

    await walmartGlassesPage.changeStatus(ProductStatus.InDesign)

    for (const productGtin of productsGtin) {
      await expect
        .soft(
          walmartGlassesPage.tableRowData([
            { colId: WalmartGlassesColumns.GTIN, text: productGtin },
            { colId: WalmartGlassesColumns.Status, text: ProductStatus.InDesign },
          ]),
        )
        .toBeVisible()
    }
  })

  test('Changing the designer of multiple products at once', async ({ testContext }) => {
    testContext.addTearDownAction(async () => {
      await Promise.all(productsGtin.map(productGtin => productsApi.deleteProduct(productGtin, loginApiRes.item.token)))
    })

    const productsGtin = [generateProductGtin(), generateProductGtin()]

    loginApi = await testContext.getApi(UsersApi)
    productsApi = await testContext.getApi(ProductsApi)

    const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
    await Promise.all(productsGtin.map(productGtin => productsApi.createProduct(productRequest(productGtin), loginApiRes.item.token)))

    walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, configProvider.walmartAutomationProduct)

    for (const productGtin of productsGtin) {
      await walmartGlassesPage.clickCheckRow([{ colId: WalmartGlassesColumns.GTIN, text: productGtin }])
    }

    await walmartGlassesPage.changeDesigner()

    for (const productGtin of productsGtin) {
      await expect
        .soft(
          walmartGlassesPage.tableRowData([
            { colId: WalmartGlassesColumns.GTIN, text: productGtin },
            { colId: WalmartGlassesColumns.Designer, text: configProvider.automationDesigner },
          ]),
        )
        .toBeVisible()
    }
  })

  test.describe('Import values from CSV file', () => {
    const IOSRotation = {
      [ProductValues.IOSRotationX]: 3,
      [ProductValues.IOSRotationY]: 5,
      [ProductValues.IOSRotationZ]: 10,
    }

    test.beforeEach(async ({ testContext }) => {
      testContext.addTearDownAction(() => {
        void deleteFolder(configProvider.walmartAutomationGeneratePath + productGtin)
        return productsApi.deleteProduct(productGtin, loginApiRes.item.token)
      })

      loginApi = await testContext.getApi(UsersApi)
      productsApi = await testContext.getApi(ProductsApi)

      const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
      await productsApi.createProduct(productRequest(productGtin), loginApiRes.item.token)
      walmartAutoProduct = [{ colId: WalmartGlassesColumns.GTIN, text: productGtin }]

      await createCSV(
        productGtin,
        [
          { id: ProductValues.GTIN, title: ProductValues.GTIN },
          { id: ProductValues.IOSRotationX, title: ProductValues.IOSRotationX },
          { id: ProductValues.IOSRotationY, title: ProductValues.IOSRotationY },
          { id: ProductValues.IOSRotationZ, title: ProductValues.IOSRotationZ },
        ],
        [
          {
            [ProductValues.GTIN]: productGtin,
            [ProductValues.IOSRotationX]: IOSRotation[ProductValues.IOSRotationX],
            [ProductValues.IOSRotationY]: IOSRotation[ProductValues.IOSRotationY],
            [ProductValues.IOSRotationZ]: IOSRotation[ProductValues.IOSRotationZ],
          },
        ],
      )

      walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
      await walmartGlassesPage.pickMenuItem(DropdownItems.Import)

      const importProductsPage = await testContext.getPage(ImportProductsPage)
      await importProductsPage.importCSV(productGtin)

      await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, productGtin)
      await walmartGlassesPage.clickEditLine(walmartAutoProduct)

      editProductPage = await testContext.getPage(EditProductPage)
      await editProductPage.clickTab(ProductTabs.CalibrationIOS)
    })

    test('Import CSV file & Edit product value', async () => {
      expect.soft(await editProductPage.getProductInputValue(ProductValues.IOSRotationX)).toEqual(IOSRotation[ProductValues.IOSRotationX])
      expect.soft(await editProductPage.getProductInputValue(ProductValues.IOSRotationY)).toEqual(IOSRotation[ProductValues.IOSRotationY])
      expect.soft(await editProductPage.getProductInputValue(ProductValues.IOSRotationZ)).toEqual(IOSRotation[ProductValues.IOSRotationZ])
    })
  })
})
