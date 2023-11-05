import { expect, test } from '@testomate/framework'
import { DashboardPage } from "../../logic/browser-pages/dashboard-page.js";
import { WalmartGlassesPage } from "../../logic/browser-pages/walmart-glasses-page.js";
import { WalmartGlassesColumns } from "../../logic/enum/walmart-glasses-columns.js";

test.describe('Dashboard tests', () => {
    test('CMS Version', async ({testContext}) => {
        const dashboardPage = await testContext.getPage(DashboardPage, {shouldNavigate: true})
        expect(await dashboardPage.getCMSVersion()).toEqual("2.2.1")
    })

    test.only('Is table row visible', async ({testContext}) => {
        const dashboardPage = await testContext.getPage(DashboardPage, {shouldNavigate: true})
        await dashboardPage.clickWalmartGlasses()
        const walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)

        await expect(walmartGlassesPage.getTableRowData([
            {colId: WalmartGlassesColumns.GTIN, text: "00010164351979"},
            {colId: WalmartGlassesColumns.UpdatedBy, text: "Olga"}])).toBeVisible()
    })
})
