import { test as setup } from '@testomate/framework'
import { configProvider } from 'src/config/config-provider.js'
import fs from 'fs'
import { LoginPage } from '../../logic/browser-pages/login-page.js'
import { DashboardPage } from '../../logic/browser-pages/dashboard-page.js'

setup.beforeAll(async () => {
  if (fs.existsSync(configProvider.framework.storageStatesPath)) fs.unlinkSync(configProvider.framework.storageStatesPath)
})

setup('Authenticate', async ({ testContext, workerContext }) => {
  const loginPage = await testContext.getPage(LoginPage, { shouldNavigate: true })
  await loginPage.performSignIn(configProvider.cmsAdmin, configProvider.cmsPassword)
  await testContext.getPage(DashboardPage)
  const storageState = await testContext.getStorageState()
  workerContext.setStorageState(storageState)
})
