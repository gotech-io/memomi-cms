import { expect, logger, test } from '@testomate/framework'
import { PlaywrightPage } from '../../logic/browser-pages/playwright-page.js'

test.describe.only('Test Playwright', () => {
  test.beforeAll(async ({ testContext }) => {
    logger.debug('*** Before All (Test Playwright) ***')
  })

  test.afterAll(async ({ testContext }) => {
    logger.debug('*** After All (Test Playwright) ***')
  })

  test.beforeEach(async ({ testContext }) => {
    logger.debug('*** Before Each (Test Playwright) ***')
  })

  test.afterEach(async ({ testContext }) => {
    logger.debug('*** After Each (Test Playwright) ***')
  })

  test('Test playwright search', async ({ testContext }) => {
    testContext.addTearDownAction(async () => {
      logger.info('Tear down this test')
    })
    const playwrightPage = await testContext.getPage(PlaywrightPage, { shouldNavigate: true })
    await playwrightPage.clickSearch()
    await playwrightPage.fillSearch('Testing Playwright')
    await expect(playwrightPage.resetSearchLocator).toBeVisible()
  })

  test('Test playwright nav logo appears', async ({ testContext }) => {
    testContext.addTearDownAction(async () => {
      logger.info('Tear down this test')
    })
    const playwrightPage = await testContext.getPage(PlaywrightPage, { shouldNavigate: true })
    await expect(playwrightPage.navLogoLocator).toBeVisible()
  })

  test('Open in new tab by middle clicking logo', async ({ testContext }) => {
    const playwrightPage = await testContext.getPage(PlaywrightPage, { shouldNavigate: true })
    const newTabPlaywrightPage = await testContext.getPageInNewTab(PlaywrightPage, () => playwrightPage.midClickLogo())
    await expect(newTabPlaywrightPage.navLogoLocator).toBeVisible()
  })
})
