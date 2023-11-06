import { expect, test } from '@testomate/framework'
import { DashboardPage } from "../../logic/browser-pages/dashboard-page.js";
import { WalmartGlassesPage } from "../../logic/browser-pages/walmart-glasses-page.js";
import { WalmartGlassesColumns } from "../../logic/enum/walmart-glasses-columns.js";
import { LoginPage } from "../../logic/browser-pages/login-page.js";
import { configProvider } from "../../config/index.js";

test.describe('Dashboard tests', () => {
    let dashboardPage: DashboardPage

    test.beforeEach(async ({testContext}) => {
        const loginPage = await testContext.getPage(LoginPage, {shouldNavigate: true})
        await loginPage.performSignIn(configProvider.cmsAdminUser, configProvider.cmsPassword)
        dashboardPage = await testContext.getPage(DashboardPage)
    })

    test('CMS Version', async ({testContext}) => {
        expect(await dashboardPage.getCMSVersion()).toEqual("2.2.6")
    })

    test.only('Is table row visible', async ({testContext}) => {
        await dashboardPage.clickWalmartGlasses()
        const walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
        await expect(walmartGlassesPage.getTableRowData([
            {colId: WalmartGlassesColumns.GTIN, text: "00010164351979"},
            {colId: WalmartGlassesColumns.UpdatedBy, text: "Olga"}])).toBeVisible()
    })
})
