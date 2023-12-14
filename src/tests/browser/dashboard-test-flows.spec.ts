import { expect, test } from '@testomate/framework'
import { LoginPage } from '../../logic/browser-pages/login-page.js'
import { DashboardPage } from '../../logic/browser-pages/dashboard-page.js'
import { configProvider } from '../../config/index.js'

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
      await dashboardPage.fetchGlassesCount(await dashboardPage.walmartGlassesCount()),
      await dashboardPage.fetchGlassesCount(await dashboardPage.apparelSunglassesCount()),
      await dashboardPage.fetchGlassesCount(await dashboardPage.functionalHealthReadingGlasses()),
    ])

    expect(walmartCount + apparelCount + functionalCount).toEqual(await dashboardPage.fetchStatusDistribution())
  })
})
