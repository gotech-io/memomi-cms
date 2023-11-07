import { expect, test } from '@testomate/framework'
import { DashboardPage } from '../../logic/browser-pages/dashboard-page.js'
import { WalmartGlassesPage } from '../../logic/browser-pages/walmart-glasses-page.js'
import { WalmartGlassesColumns } from '../../logic/enum/walmart-glasses-columns.js'
import { LoginPage } from '../../logic/browser-pages/login-page.js'
import { configProvider } from '../../config/index.js'
import { EditProductPage } from '../../logic/browser-pages/edit-product-page.js'
import { ProductTabs } from '../../logic/enum/product-tabs.js'
import { ProductValues } from '../../logic/enum/product-values.js'

test.describe('Dashboard tests', () => {
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ testContext }) => {
    const loginPage = await testContext.getPage(LoginPage, { shouldNavigate: true })
    await loginPage.performSignIn(configProvider.cmsAdmin, configProvider.cmsPassword)
    dashboardPage = await testContext.getPage(DashboardPage)
  })

  test('Is table row visible', async ({ testContext }) => {
    await dashboardPage.clickWalmartGlasses()
    const walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.filterByColumn(WalmartGlassesColumns.STL, '00010164351979.stl')
    await expect(walmartGlassesPage.tableRowData([{ colId: WalmartGlassesColumns.GTIN, text: '00010164351979' }])).toBeVisible()
  })

  test('Product values tests', async ({ testContext }) => {
    const items = [
      { key: ProductValues.GTIN, value: '00010164351979' },
      { key: ProductValues.Designer, value: 'Unassigned' },
    ]

    await dashboardPage.clickWalmartGlasses()
    const walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
    await walmartGlassesPage.clickEditLine([
      { colId: WalmartGlassesColumns.GTIN, text: '00010164351979' },
      { colId: WalmartGlassesColumns.UpdatedBy, text: 'Olga' },
    ])
    const editProductPage = await testContext.getPage(EditProductPage)
    await editProductPage.clickTab(ProductTabs.Tracking)
    for (const item of items) {
      expect.soft(await editProductPage.getProductValue(item.key)).toEqual(item.value)
    }
  })
})
