import { expect, test } from '@testomate/framework'
import { DashboardPage } from "../../logic/browser-pages/dashboard-page.js";

test.describe.only('Dashboard tests', () => {
    test('CMS Version', async ({testContext}) => {
        const dashboardPage = await testContext.getPage(DashboardPage, {shouldNavigate: true})
        expect(await dashboardPage.getCMSVersion()).toEqual("2.2.1")
    })
})
