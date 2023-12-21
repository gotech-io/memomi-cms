import { expect, test } from '@testomate/framework'
import { LoginPage } from '../../logic/browser-pages/login-page.js'
import { DashboardPage } from '../../logic/browser-pages/dashboard-page.js'
import { configProvider } from '../../config/index.js'
import { ProductList } from '../../logic/enum/product-list.js'
import { ProductId } from '../../logic/enum/product-id.js'
import { AdminMailbox } from '../../logic/enum/admin-mailbox.js'

test.describe('@Dashboard test flows', () => {
  let loginPage: LoginPage
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ testContext }) => {
    loginPage = await testContext.getPage(LoginPage, { shouldNavigate: true })
    await loginPage.performSignIn(configProvider.cmsAdmin, configProvider.cmsPassword)
    dashboardPage = await testContext.getPage(DashboardPage)
  })

  test('Show all users', async () => {
    await dashboardPage.clickShowAllUsers()
    expect(await dashboardPage.allTeamMembers()).toEqual(await dashboardPage.fetchAllTeamMembers())
  })

  test('Products count', async () => {
    const [walmartCount, apparelCount, functionalCount] = await Promise.all([
      await dashboardPage.fetchProductCount(ProductList.WalmartGlasses),
      await dashboardPage.fetchProductCount(ProductList.ApparelSunglasses),
      await dashboardPage.fetchProductCount(ProductList.FunctionalHealthReadingGlasses),
    ])
    expect(walmartCount + apparelCount + functionalCount).toEqual(await dashboardPage.fetchStatusDistribution())
  })

  test('Uncheck products', async () => {
    await dashboardPage.clickUncheckProduct(ProductList.ApparelSunglasses)
    await dashboardPage.clickUncheckProduct(ProductList.FunctionalHealthReadingGlasses)
    const walmartCount = await dashboardPage.fetchProductCount(ProductList.WalmartGlasses)
    expect(walmartCount).toEqual(await dashboardPage.fetchStatusDistribution())
  })

  test.describe('Redirect URLs', () => {
    const adminTestCases: { option: AdminMailbox; route: string }[] = [
      { option: AdminMailbox.Users, route: 'user-list' },
      { option: AdminMailbox.Schemas, route: 'schemas' },
      { option: AdminMailbox.Containers, route: 'containers' },
      { option: AdminMailbox.Calibrations, route: 'calibrations' },
    ]

    adminTestCases.forEach(({ option, route }) => {
      test(`Redirects to Correct URL - ${option}`, async () => {
        await dashboardPage.clickAdminOption(option)
        expect(await dashboardPage.getUrl()).toContain(route)
      })
    })

    test('Walmart Glasses Button Redirects to Correct URL', async () => {
      await dashboardPage.clickWalmartGlasses()
      expect(await dashboardPage.getUrl()).toContain(ProductId.WalmartGlasses)
    })

    test('Apparel Sunglasses Button Redirects to Correct URL', async () => {
      await dashboardPage.clickApparelSunglasses()
      expect(await dashboardPage.getUrl()).toContain(ProductId.ApparelSunglasses)
    })

    test('Functional Health - Reading Glasses Button Redirects to Correct URL', async () => {
      await dashboardPage.clickFunctionalHealthReadingGlasses()
      expect(await dashboardPage.getUrl()).toContain(ProductId.FunctionalHealthReadingGlasses)
    })

    test('Manage Users Button Redirects to Correct URL', async () => {
      await dashboardPage.clickManageUsers()
      expect(await dashboardPage.getUrl()).toContain('user-list')
    })
  })
})
