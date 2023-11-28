import { expect, test } from '@testomate/framework'
import { DashboardPage } from '../../logic/browser-pages/dashboard-page.js'
import { WalmartGlassesPage } from '../../logic/browser-pages/walmart-glasses-page.js'
import { WalmartGlassesColumns } from '../../logic/enum/walmart-glasses-columns.js'
import { LoginPage } from '../../logic/browser-pages/login-page.js'
import { configProvider } from '../../config/index.js'
import { DropdownItems } from '../../logic/enum/dropdown-items.js'
import { deleteFolder, duplicateFolder, generateProductGtin, getAllFiles, unzipFiles } from '../../logic/utils.js'
import fs from 'fs'
import { ImportAssetsPage } from '../../logic/browser-pages/import-assets-page.js'
import { EditProductPage } from '../../logic/browser-pages/edit-product-page.js'
import { ProductTabs } from '../../logic/enum/product-tabs.js'
import { UsersApi } from '../../logic/api/users-api.js'
import { loginRequest } from '../../logic/api/request/login-request.js'
import { ProductsApi } from '../../logic/api/products-api.js'
import { productRequest } from '../../logic/api/request/product-request.js'
import { ProductStatus } from '../../logic/enum/product-status.js'
import { ProductPriority } from '../../logic/enum/product-priority.js'
import { ProductValues } from '../../logic/enum/product-values.js'
import { getRandomProductFile, ProductFiles } from '../../logic/enum/product-files.js'

test.describe('Designer test flows', () => {
  let loginPage: LoginPage
  let dashboardPage: DashboardPage
  let walmartGlassesPage: WalmartGlassesPage
  let editProductPage: EditProductPage
  let importAssetsPage: ImportAssetsPage
  let loginApi: UsersApi
  let productsApi: ProductsApi

  test.beforeEach(async ({ testContext }) => {
    loginPage = await testContext.getPage(LoginPage, { shouldNavigate: true })
    await loginPage.performSignIn(configProvider.cmsDesigner, configProvider.cmsPassword)
    dashboardPage = await testContext.getPage(DashboardPage)
  })

  test('All files can be found after unzipping', async ({ testContext }) => {
    const productGTIN = '00010164351979'
    const productFiles: string[] = JSON.parse(fs.readFileSync(configProvider.walmartAutomationProductFiles, 'utf8')).files

    await dashboardPage.clickWalmartGlasses()

    walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.clickCheckRow([{ colId: WalmartGlassesColumns.GTIN, text: productGTIN }])
    await walmartGlassesPage.menuChoice(DropdownItems.ExportAssets)
    const zipFiles = await unzipFiles()

    productFiles.forEach(file => {
      expect.soft(zipFiles.includes(productGTIN + '/' + productGTIN + file), `The ZIP file does not contain an ${file} file`).toBeTruthy()
    })
  })

  test('Import assets & Upload images', async ({ testContext }) => {
    testContext.addTearDownAction(() => {
      void deleteFolder(configProvider.walmartAutomationGeneratePath + productGTIN)
      return productsApi.deleteProduct(productGTIN, loginApiRes.item.token)
    })

    loginApi = await testContext.getApi(UsersApi)
    productsApi = await testContext.getApi(ProductsApi)

    const productGTIN = generateProductGtin()
    const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
    await productsApi.createProduct(productRequest(productGTIN), loginApiRes.item.token)

    await duplicateFolder(configProvider.walmartAutomationResourcesPath, productGTIN)
    const walmartAutoProduct = [{ colId: WalmartGlassesColumns.GTIN, text: productGTIN }]

    const files = await getAllFiles(configProvider.walmartAutomationGeneratePath + productGTIN + '/')
    const images = files.filter(image => image.includes('.jpg') && !image.includes('invalid'))

    await dashboardPage.clickWalmartGlasses()

    walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.menuChoice(DropdownItems.ImportAssets)

    importAssetsPage = await testContext.getPage(ImportAssetsPage)
    await importAssetsPage.importAssets(productGTIN)

    await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, productGTIN)
    await walmartGlassesPage.clickEditLine(walmartAutoProduct)

    editProductPage = await testContext.getPage(EditProductPage)
    await editProductPage.clickTab(ProductTabs.Images)

    for (const image of images) {
      await expect.soft(editProductPage.isProductImageVisible(image)).toBeVisible()
    }
  })

  test('Upload image of missing product', async ({ testContext }) => {
    await dashboardPage.clickWalmartGlasses()

    walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.menuChoice(DropdownItems.ImportAssets)

    importAssetsPage = await testContext.getPage(ImportAssetsPage)
    await importAssetsPage.importNotFoundProduct()
    await expect(importAssetsPage.isProductNotFound(configProvider.walmartAutomationInvalidProduct)).toBeVisible()
  })

  test.describe('Edit product, Tracking values', () => {
    let productGTIN: string

    test.beforeEach(async ({ testContext }) => {
      testContext.addTearDownAction(() => {
        return productsApi.deleteProduct(productGTIN, loginApiRes.item.token)
      })

      loginApi = await testContext.getApi(UsersApi)
      productsApi = await testContext.getApi(ProductsApi)
      productGTIN = generateProductGtin()

      const walmartAutoProduct = [{ colId: WalmartGlassesColumns.GTIN, text: productGTIN }]
      const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
      await productsApi.createProduct(productRequest(productGTIN), loginApiRes.item.token)

      await dashboardPage.clickWalmartGlasses()

      walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
      await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, productGTIN)
      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      editProductPage = await testContext.getPage(EditProductPage)
      await editProductPage.clickTab(ProductTabs.Tracking)
    })

    test('Change product status', async () => {
      await editProductPage.setProductStatus(ProductStatus.InDesign)
      await editProductPage.clickClose()

      await walmartGlassesPage.clickRefresh()

      await expect(
        walmartGlassesPage.tableRowData([
          { colId: WalmartGlassesColumns.GTIN, text: productGTIN },
          { colId: WalmartGlassesColumns.Status, text: ProductStatus.InDesign },
        ]),
      ).toBeVisible()
    })

    test('Change product priority', async () => {
      await editProductPage.setProductPriority(ProductPriority.P3)
      await editProductPage.clickClose()

      await walmartGlassesPage.clickRefresh()

      await expect(
        walmartGlassesPage.tableRowData([
          { colId: WalmartGlassesColumns.GTIN, text: productGTIN },
          { colId: WalmartGlassesColumns.Priority, text: ProductPriority.P3 },
        ]),
      ).toBeVisible()
    })

    test('Change product designer', async () => {
      await editProductPage.setProductDesigner('Olga (designer)')
      await editProductPage.clickClose()

      await walmartGlassesPage.clickRefresh()

      await expect(
        walmartGlassesPage.tableRowData([
          { colId: WalmartGlassesColumns.GTIN, text: productGTIN },
          { colId: WalmartGlassesColumns.Designer, text: 'Olga (designer)' },
        ]),
      ).toBeVisible()
    })

    test('Change product tag', async () => {
      await editProductPage.setProductTag('Need to complete')
      await editProductPage.clickClose()

      await walmartGlassesPage.clickRefresh()

      await expect(
        walmartGlassesPage.tableRowData([
          { colId: WalmartGlassesColumns.GTIN, text: productGTIN },
          { colId: WalmartGlassesColumns.Tag, text: 'Need to complete' },
        ]),
      ).toBeVisible()
    })

    test('Product tracking values', async () => {
      const trackingValues = [
        { key: ProductValues.GTIN, value: productGTIN },
        { key: ProductValues.MerchantsQC, value: 'Unassigned' },
        { key: ProductValues.Calibration, value: '' },
      ]

      for (const item of trackingValues) {
        expect.soft(await editProductPage.getProductValue(item.key)).toEqual(item.value)
      }
    })
  })

  test.describe('Edit product, Item info values', () => {
    let productGTIN: string

    test.beforeEach(async ({ testContext }) => {
      testContext.addTearDownAction(() => {
        return productsApi.deleteProduct(productGTIN, loginApiRes.item.token)
      })

      loginApi = await testContext.getApi(UsersApi)
      productsApi = await testContext.getApi(ProductsApi)
      productGTIN = generateProductGtin()

      const walmartAutoProduct = [{ colId: WalmartGlassesColumns.GTIN, text: productGTIN }]
      const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
      await productsApi.createProduct(productRequest(productGTIN), loginApiRes.item.token)

      await dashboardPage.clickWalmartGlasses()

      walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
      await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, productGTIN)
      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      editProductPage = await testContext.getPage(EditProductPage)
      await editProductPage.clickTab(ProductTabs.ItemInfo)
    })

    test('Set material type', async () => {
      await editProductPage.setMaterialType('testingMaterialType')
      const getMaterialType = await editProductPage.getMaterialType()
      await editProductPage.clickClose()

      await walmartGlassesPage.clickRefresh()

      expect.soft(getMaterialType).toEqual('testingMaterialType')
      expect.soft(await walmartGlassesPage.tableColumnData(productGTIN, WalmartGlassesColumns.MaterialType)).toEqual('testingMaterialType')
    })

    test('Set teflon id', async () => {
      await editProductPage.setTeflonId('testingTeflonId')
      const getTeflonId = await editProductPage.getTeflonId()
      await editProductPage.clickClose()

      await walmartGlassesPage.clickRefresh()

      expect.soft(getTeflonId).toEqual('testingTeflonId')
      expect.soft(await walmartGlassesPage.tableColumnData(productGTIN, WalmartGlassesColumns.TeflonId)).toEqual('testingTeflonId')
    })

    test('Set frame type', async () => {
      await editProductPage.setFrameType('testingFrameType')
      const getFrameType = await editProductPage.getFrameType()
      await editProductPage.clickClose()

      await walmartGlassesPage.clickRefresh()

      expect.soft(getFrameType).toEqual('testingFrameType')
      expect.soft(await walmartGlassesPage.tableColumnData(productGTIN, WalmartGlassesColumns.FrameType)).toEqual('testingFrameType')
    })

    test('Set hinge type', async () => {
      await editProductPage.setHingeType('testingHingeType')
      const getHingeType = await editProductPage.getHingeType()
      await editProductPage.clickClose()

      await walmartGlassesPage.clickRefresh()

      expect.soft(getHingeType).toEqual('testingHingeType')
      expect.soft(await walmartGlassesPage.tableColumnData(productGTIN, WalmartGlassesColumns.HingeType)).toEqual('testingHingeType')
    })
  })

  test.describe('Edit product, Images', () => {
    let productGTIN: string
    let productImageMap: { [productFile: string]: string }
    let randomProductFile: ProductFiles

    test.beforeEach(async ({ testContext }) => {
      testContext.addTearDownAction(() => {
        void deleteFolder(configProvider.walmartAutomationGeneratePath + productGTIN)
        return productsApi.deleteProduct(productGTIN, loginApiRes.item.token)
      })

      loginApi = await testContext.getApi(UsersApi)
      productsApi = await testContext.getApi(ProductsApi)
      productGTIN = generateProductGtin()
      productImageMap = Object.fromEntries(Object.entries(ProductFiles).map(([key, value]) => [value, `_${key.toLowerCase()}.jpg`]))
      randomProductFile = getRandomProductFile()

      await duplicateFolder(configProvider.walmartAutomationResourcesPath, productGTIN)
      const walmartAutoProduct = [{ colId: WalmartGlassesColumns.GTIN, text: productGTIN }]
      const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
      await productsApi.createProduct(productRequest(productGTIN), loginApiRes.item.token)

      await dashboardPage.clickWalmartGlasses()

      walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
      await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, productGTIN)
      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      editProductPage = await testContext.getPage(EditProductPage)
      await editProductPage.clickTab(ProductTabs.Images)
      await editProductPage.uploadImage(randomProductFile, productGTIN, productImageMap[randomProductFile])
    })

    test('Upload image', async () => {
      await expect(editProductPage.isProductImageVisible(productGTIN + productImageMap[randomProductFile])).toBeVisible()
    })

    test('Delete image', async () => {
      await editProductPage.deleteImage(randomProductFile)
      await expect(editProductPage.isProductImageVisible(productGTIN + productImageMap[randomProductFile])).toBeHidden()
    })
  })
})
