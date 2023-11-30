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
import { Product3dModel } from '../../logic/enum/product-3d-model.js'

test.describe('Designer test flows', () => {
  let loginPage: LoginPage
  let dashboardPage: DashboardPage
  let walmartGlassesPage: WalmartGlassesPage
  let editProductPage: EditProductPage
  let importAssetsPage: ImportAssetsPage
  let loginApi: UsersApi
  let productsApi: ProductsApi
  let walmartAutoProduct: { text: string; colId: WalmartGlassesColumns }[]
  let productGtin: string

  test.beforeEach(async ({ testContext }) => {
    loginPage = await testContext.getPage(LoginPage, { shouldNavigate: true })
    await loginPage.performSignIn(configProvider.cmsDesigner, configProvider.cmsPassword)
    dashboardPage = await testContext.getPage(DashboardPage)
    productGtin = generateProductGtin()
  })

  test('All files can be found after unzipping', async ({ testContext }) => {
    const specificProductGtin = '00010164351979'
    const productFiles: string[] = JSON.parse(fs.readFileSync(configProvider.walmartAutomationProductFiles, 'utf8')).files

    await dashboardPage.clickWalmartGlasses()

    walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.clickCheckRow([{ colId: WalmartGlassesColumns.GTIN, text: specificProductGtin }])
    await walmartGlassesPage.menuChoice(DropdownItems.ExportAssets)
    const zipFiles = await unzipFiles()

    productFiles.forEach(file => {
      expect
        .soft(zipFiles.includes(specificProductGtin + '/' + specificProductGtin + file), `The ZIP file does not contain an ${file} file`)
        .toBeTruthy()
    })
  })

  test('Import assets & Upload images', async ({ testContext }) => {
    testContext.addTearDownAction(() => {
      void deleteFolder(configProvider.walmartAutomationGeneratePath + productGtin)
      return productsApi.deleteProduct(productGtin, loginApiRes.item.token)
    })

    loginApi = await testContext.getApi(UsersApi)
    productsApi = await testContext.getApi(ProductsApi)

    const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
    await productsApi.createProduct(productRequest(productGtin), loginApiRes.item.token)
    const walmartAutoProduct = [{ colId: WalmartGlassesColumns.GTIN, text: productGtin }]

    await duplicateFolder(configProvider.walmartAutomationResourcesPath, productGtin)
    const files = await getAllFiles(configProvider.walmartAutomationGeneratePath + productGtin + '/')
    const images = files.filter(image => image.includes('.jpg') && !image.includes('invalid'))

    await dashboardPage.clickWalmartGlasses()

    walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.menuChoice(DropdownItems.ImportAssets)

    importAssetsPage = await testContext.getPage(ImportAssetsPage)
    await importAssetsPage.importAssets(productGtin)

    await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, productGtin)
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
    test.beforeEach(async ({ testContext }) => {
      testContext.addTearDownAction(() => {
        return productsApi.deleteProduct(productGtin, loginApiRes.item.token)
      })

      loginApi = await testContext.getApi(UsersApi)
      productsApi = await testContext.getApi(ProductsApi)
      walmartAutoProduct = [{ colId: WalmartGlassesColumns.GTIN, text: productGtin }]

      const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
      await productsApi.createProduct(productRequest(productGtin), loginApiRes.item.token)

      await dashboardPage.clickWalmartGlasses()

      walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
      await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, productGtin)
      await walmartGlassesPage.clickEditLine(walmartAutoProduct)

      editProductPage = await testContext.getPage(EditProductPage)
      await editProductPage.clickTab(ProductTabs.Tracking)
    })

    test('Change product status', async () => {
      await editProductPage.setProductStatus(ProductStatus.InDesign)
      await editProductPage.clickSaveThenClose()

      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.Tracking)
      expect(await editProductPage.fetchProductStatus()).toEqual(ProductStatus.InDesign)
    })

    test('Change product priority', async () => {
      await editProductPage.setProductPriority(ProductPriority.P3)
      await editProductPage.clickSaveThenClose()

      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.Tracking)
      expect(await editProductPage.fetchProductPriority()).toEqual(ProductPriority.P3)
    })

    test('Change product designer', async () => {
      await editProductPage.setProductDesigner('Olga (designer)')
      await editProductPage.clickSaveThenClose()

      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.Tracking)
      expect(await editProductPage.fetchProductDesigner()).toEqual('Olga (designer)')
    })

    test('Change product tag', async () => {
      await editProductPage.setProductTag('Need to complete')
      await editProductPage.clickSaveThenClose()

      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.Tracking)
      expect(await editProductPage.fetchProductTag()).toEqual('Need to complete')
    })

    test('Product gtin value', async () => {
      expect.soft(await editProductPage.getProductValue(ProductValues.GTIN)).toEqual(productGtin)
    })
  })

  test.describe('Edit product, Item info values', () => {
    test.beforeEach(async ({ testContext }) => {
      testContext.addTearDownAction(() => {
        return productsApi.deleteProduct(productGtin, loginApiRes.item.token)
      })

      loginApi = await testContext.getApi(UsersApi)
      productsApi = await testContext.getApi(ProductsApi)
      walmartAutoProduct = [{ colId: WalmartGlassesColumns.GTIN, text: productGtin }]

      const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
      await productsApi.createProduct(productRequest(productGtin), loginApiRes.item.token)

      await dashboardPage.clickWalmartGlasses()

      walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
      await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, productGtin)
      await walmartGlassesPage.clickEditLine(walmartAutoProduct)

      editProductPage = await testContext.getPage(EditProductPage)
      await editProductPage.clickTab(ProductTabs.ItemInfo)
    })

    test('Set material type', async () => {
      await editProductPage.setMaterialType('AUTO_MATERIAL_TYPE')
      const getMaterialType = await editProductPage.getMaterialType()
      await editProductPage.clickSaveThenClose()

      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.ItemInfo)
      expect(await editProductPage.getMaterialType()).toEqual(getMaterialType)
    })

    test('Set teflon id', async () => {
      await editProductPage.setTeflonId('AUTO_TEFLON_ID')
      const getTeflonId = await editProductPage.getTeflonId()
      await editProductPage.clickSaveThenClose()

      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.ItemInfo)
      expect(await editProductPage.getTeflonId()).toEqual(getTeflonId)
    })

    test('Set frame type', async () => {
      await editProductPage.setFrameType('AUTO_FRAME_TYPE')
      const getFrameType = await editProductPage.getFrameType()
      await editProductPage.clickSaveThenClose()

      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.ItemInfo)
      expect(await editProductPage.getFrameType()).toEqual(getFrameType)
    })

    test('Set hinge type', async () => {
      await editProductPage.setHingeType('AUTO_HINGE_TYPE')
      const getHingeType = await editProductPage.getHingeType()
      await editProductPage.clickSaveThenClose()

      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.ItemInfo)
      expect(await editProductPage.getHingeType()).toEqual(getHingeType)
    })
  })

  test.describe('Edit product, Images', () => {
    let productImageMap: { [productFile: string]: string }
    let randomProductFile: ProductFiles

    test.beforeEach(async ({ testContext }) => {
      testContext.addTearDownAction(() => {
        void deleteFolder(configProvider.walmartAutomationGeneratePath + productGtin)
        return productsApi.deleteProduct(productGtin, loginApiRes.item.token)
      })

      loginApi = await testContext.getApi(UsersApi)
      productsApi = await testContext.getApi(ProductsApi)
      walmartAutoProduct = [{ colId: WalmartGlassesColumns.GTIN, text: productGtin }]
      productImageMap = Object.fromEntries(Object.entries(ProductFiles).map(([key, value]) => [value, `_${key.toLowerCase()}.jpg`]))
      randomProductFile = getRandomProductFile()

      await duplicateFolder(configProvider.walmartAutomationResourcesPath, productGtin)
      const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
      await productsApi.createProduct(productRequest(productGtin), loginApiRes.item.token)

      await dashboardPage.clickWalmartGlasses()

      walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
      await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, productGtin)
      await walmartGlassesPage.clickEditLine(walmartAutoProduct)

      editProductPage = await testContext.getPage(EditProductPage)
      await editProductPage.clickTab(ProductTabs.Images)
      await editProductPage.uploadImage(randomProductFile, productGtin, productImageMap[randomProductFile])
    })

    test('Upload image', async () => {
      await editProductPage.clickSaveThenClose()
      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.Images)
      await expect(editProductPage.isProductImageVisible(productGtin + productImageMap[randomProductFile])).toBeVisible()
    })

    test('Delete image', async () => {
      await editProductPage.deleteFile(randomProductFile)
      await editProductPage.clickSaveThenClose()

      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.Images)
      await expect(editProductPage.isProductImageVisible(productGtin + productImageMap[randomProductFile])).toBeHidden()
    })

    test('Open image in a new tab', async () => {
      await editProductPage.openInANewTab(randomProductFile)
      expect(await editProductPage.fetchTabUrls()).toContain(await editProductPage.imageNewTabUrl(randomProductFile))
    })
  })

  test.describe('Edit product, 3D Model', () => {
    let fieldLabel: string

    test.beforeEach(async ({ testContext }) => {
      testContext.addTearDownAction(() => {
        void deleteFolder(configProvider.walmartAutomationGeneratePath + productGtin)
        return productsApi.deleteProduct(productGtin, loginApiRes.item.token)
      })

      loginApi = await testContext.getApi(UsersApi)
      productsApi = await testContext.getApi(ProductsApi)
      walmartAutoProduct = [{ colId: WalmartGlassesColumns.GTIN, text: productGtin }]

      await duplicateFolder(configProvider.walmartAutomationResourcesPath, productGtin)
      const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
      await productsApi.createProduct(productRequest(productGtin), loginApiRes.item.token)

      await dashboardPage.clickWalmartGlasses()

      walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
      await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, productGtin)
      await walmartGlassesPage.clickEditLine(walmartAutoProduct)

      editProductPage = await testContext.getPage(EditProductPage)
      await editProductPage.clickTab(ProductTabs.Model_3D)
      await editProductPage.uploadStl(productGtin)
      fieldLabel = await editProductPage.uploadInput(Product3dModel.STL)
      await editProductPage.clickSaveThenClose()
      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.Model_3D)
    })

    test('Upload stl', async () => {
      expect(await editProductPage.uploadInput(Product3dModel.STL)).toEqual(fieldLabel)
    })

    test('Delete stl', async () => {
      await editProductPage.deleteFile(Product3dModel.STL)
      await editProductPage.clickSaveThenClose()

      await walmartGlassesPage.clickEditLine(walmartAutoProduct)
      await editProductPage.clickTab(ProductTabs.Model_3D)
      expect(await editProductPage.uploadInput(Product3dModel.STL)).toEqual('')
    })
  })

  test.describe('Edit product, Validation', () => {
    const fillComment: string = 'Automation comment'

    test.beforeEach(async ({ testContext }) => {
      testContext.addTearDownAction(() => {
        return productsApi.deleteProduct(productGtin, loginApiRes.item.token)
      })

      loginApi = await testContext.getApi(UsersApi)
      productsApi = await testContext.getApi(ProductsApi)
      walmartAutoProduct = [{ colId: WalmartGlassesColumns.GTIN, text: productGtin }]

      const loginApiRes = await (await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))).getJsonData()
      await productsApi.createProduct(productRequest(productGtin), loginApiRes.item.token)

      await dashboardPage.clickWalmartGlasses()

      walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
      await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.GTIN, productGtin)
      await walmartGlassesPage.clickEditLine(walmartAutoProduct)

      editProductPage = await testContext.getPage(EditProductPage)
      await editProductPage.clickTab(ProductTabs.Validation)
      await editProductPage.addComment(fillComment)
    })

    test('Add comment', async () => {
      await expect.soft(editProductPage.isCommentVisible(fillComment)).toBeVisible()
      expect.soft(await editProductPage.fetchComments()).toEqual(1)
    })

    test('Delete comment', async () => {
      await editProductPage.deleteComment(fillComment)
      await expect.soft(editProductPage.isCommentVisible(fillComment)).toBeHidden()
      await expect.soft(editProductPage.isCommentDeleted()).toBeVisible()
      expect.soft(await editProductPage.fetchComments()).toEqual(0) // Todo: A real bug with a low priority.
    })
  })
})
