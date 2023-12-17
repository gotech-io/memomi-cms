import { expect, test } from '@testomate/framework'
import { LoginPage } from '../../logic/browser-pages/login-page.js'
import { DashboardPage } from '../../logic/browser-pages/dashboard-page.js'
import { configProvider } from '../../config/index.js'
import { ProductList } from '../../logic/enum/product-list.js'

test.describe('Dashboard test flows', () => {
  let loginPage: LoginPage
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ testContext }) => {
    loginPage = await testContext.getPage(LoginPage, { shouldNavigate: true })
    await loginPage.performSignIn(configProvider.cmsAdmin, configProvider.cmsPassword)
    dashboardPage = await testContext.getPage(DashboardPage)
  })

  test('Products count', async () => {
    const [walmartCount, apparelCount, functionalCount] = await Promise.all([
      await dashboardPage.fetchGlassesCount(await dashboardPage.fetchProductCount(ProductList.WalmartGlasses)),
      await dashboardPage.fetchGlassesCount(await dashboardPage.fetchProductCount(ProductList.ApparelSunglasses)),
      await dashboardPage.fetchGlassesCount(await dashboardPage.fetchProductCount(ProductList.FunctionalHealthReadingGlasses)),
    ])
    expect(walmartCount + apparelCount + functionalCount).toEqual(await dashboardPage.fetchStatusDistribution())
  })

  test('Uncheck products', async () => {
    await dashboardPage.clickUncheckProduct(ProductList.ApparelSunglasses)
    await dashboardPage.clickUncheckProduct(ProductList.FunctionalHealthReadingGlasses)
    const walmartCount = await dashboardPage.fetchGlassesCount(await dashboardPage.fetchProductCount(ProductList.WalmartGlasses))
    expect(walmartCount).toEqual(await dashboardPage.fetchStatusDistribution())
  })
})
