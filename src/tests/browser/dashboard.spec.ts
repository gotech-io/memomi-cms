import { expect, test } from '@testomate/framework'
import { DashboardPage } from "../../logic/browser-pages/dashboard-page.js";
import { WalmartGlassesPage } from "../../logic/browser-pages/walmart-glasses-page.js";
import { WalmartGlassesColumns } from "../../logic/enum/walmart-glasses-columns.js";

test.describe('Dashboard tests', () => {
    test('CMS Version', async ({testContext}) => {
        const dashboardPage = await testContext.getPage(DashboardPage, {shouldNavigate: true})
        expect(await dashboardPage.getCMSVersion()).toEqual("2.2.1")
    })

    test('Table line', async ({testContext}) => {
        const dashboardPage = await testContext.getPage(DashboardPage, {shouldNavigate: true})
        await dashboardPage.clickWalmartGlassesLink()
        const walmartGlassesPage = await testContext.getPage(WalmartGlassesPage)
        const pairs = [
            { colId: WalmartGlassesColumns.GTIN, text: '00010164351979' },
            { colId: WalmartGlassesColumns.UpdatedBy, text: 'System' },
        ];
        await walmartGlassesPage.clickCheckedLine(pairs);
    })
})
