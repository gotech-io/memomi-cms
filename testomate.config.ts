import { SauceLabsNotifierPlugin, initializeFrameworkConfig } from '@testomate/framework'
import dotenv from 'dotenv'
import path from 'path'
import { initializeConfig } from './src/config/config-provider.js'
import { devices } from '@playwright/test'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
if (process.env.DOTENV_CONFIG_PATH) {
  dotenv.config({ path: process.env.DOTENV_CONFIG_PATH, override: true })
}

export default initializeFrameworkConfig({
  projectVersion: '1.0.0',
  testomate: {
    apiUrl: 'http://gotech.io',
    apiKey: 'ujytrhye',
    projectId: '1',
  },
  logger: {
    format: (process.env.LOG_FORMAT as 'pretty' | 'json') || 'pretty',
    level: process.env.LOG_LEVEL as 'info' | 'error' | 'debug' | 'warn',
    colorize: process.env.LOG_COLORIZE === 'true',
  },
  testing: {
    browser: process.env.BROWSER as 'chromium' | 'firefox' | 'webkit',
    testPlugins: [new SauceLabsNotifierPlugin()],
    workerPlugins: [],
  },
  websiteBaseUrl: process.env.WEBSITE_BASE_URL || undefined,
  apiBaseUrl: process.env.API_BASE_URL || undefined,
  database: {
    postgres: {
      host: process.env.PG_DB_HOST,
      port: process.env.PG_DB_PORT ? parseInt(process.env.PG_DB_PORT) : undefined,
      user: process.env.PG_DB_USER!,
      password: process.env.PG_DB_PASSWORD!,
      name: process.env.PG_DB_NAME!,
    },
    mysql: {
      host: process.env.MYSQL_DB_HOST,
      port: process.env.MYSQL_DB_PORT ? parseInt(process.env.MYSQL_DB_PORT) : undefined,
      user: process.env.MYSQL_DB_USER!,
      password: process.env.MYSQL_DB_PASSWORD!,
      name: process.env.MYSQL_DB_NAME!,
    },
    mongo: {
      host: process.env.MONGO_DB_HOST,
      port: process.env.MONGO_DB_PORT ? parseInt(process.env.MONGO_DB_PORT) : undefined,
      user: process.env.MONGO_DB_USER!,
      password: process.env.MONGO_DB_PASSWORD!,
      name: process.env.MONGO_DB_NAME!,
    },
  },
  email: {
    imapHost: process.env.EMAIL_IMAP_HOST!,
    imapPort: process.env.EMAIL_IMAP_PORT ? parseInt(process.env.EMAIL_IMAP_PORT) : undefined,
    smtpHost: process.env.EMAIL_SMTP_HOST!,
    smtpPort: process.env.EMAIL_SMTP_PORT ? parseInt(process.env.EMAIL_SMTP_PORT) : undefined,
    address: process.env.EMAIL_ADDRESS!,
    password: process.env.EMAIL_PASSWORD!,
    box: process.env.EMAIL_BOX,
  },
  mobile: {
    appiumHost: process.env.APPIUM_HOST,
    appiumPort: process.env.APPIUM_PORT ? parseInt(process.env.APPIUM_PORT) : undefined,
    appiumPath: process.env.APPIUM_PATH,
    appiumBaseUrl: process.env.APPIUM_BASE_URL,
    connectionRetryCount: process.env.CONNECTION_RETRY_COUNT ? parseInt(process.env.CONNECTION_RETRY_COUNT) : undefined,
    sessionCreationTimeout: process.env.SESSION_CREATION_TIMEOUT ? parseInt(process.env.SESSION_CREATION_TIMEOUT) : undefined,
    useSauceLabs: process.env.USE_SAUCE_LABS ? process.env.USE_SAUCE_LABS === 'true' : undefined,
    noReset: process.env.NO_RESET ? process.env.NO_RESET === 'true' : undefined,
    android: {
      deviceName: process.env.ANDROID_DEVICE_NAME!,
      platformVersion: process.env.ANDROID_PLATFORM_VERSION!,
      automationName: process.env.ANDROID_AUTOMATION_NAME,
      appPackage: process.env.ANDROID_APP_PACKAGE,
      appPath: process.env.ANDROID_APP_PATH,
      defaultActivity: process.env.ANDROID_DEFAULT_ACTIVITY!,
      autoGrantPermission: process.env.ANDROID_AUTO_GRANT_PERMISSION ? process.env.ANDROID_AUTO_GRANT_PERMISSION === 'true' : undefined,
    },
    ios: {
      deviceName: process.env.IOS_DEVICE_NAME!,
      platformVersion: process.env.IOS_PLATFORM_VERSION!,
      automationName: process.env.IOS_AUTOMATION_NAME,
      deviceUdid: process.env.IOS_DEVICE_UDID,
      bundleId: process.env.IOS_BUNDLE_ID,
      appPath: process.env.IOS_APP_PATH,
      autoAcceptAlerts: process.env.AUTO_ACCEPT_ALERTS ? process.env.AUTO_ACCEPT_ALERTS === 'true' : undefined,
    },
    sauceLabs: {
      username: process.env.SAUCELABS_USERNAME,
      accessKey: process.env.SAUCELABS_ACCESS_KEY,
    },
  },
  playwright: {
    testDir: './src/tests/',
    fullyParallel: true,
    timeout: 5 * 60 * 1000,
    forbidOnly: false,
    retries: 0,
    workers: 1,
    use: {
      trace: 'retain-on-failure',
      headless: false,
    },
    projects: [
      { name: 'setup', testMatch: /.*\.setup\.ts/ },
      {
        name: 'chromium',
        use: {
          ...devices['Desktop Chrome'],
        },
        dependencies: ['setup'],
      },
    ],
    reporter: [
      ['dot'],
      [
        'allure-playwright',
        {
          detail: true,
          outputFolder: 'allure-results',
          suiteTitle: true,
        },
      ],
    ],
  },
})

// This initializes the config provider, needs to be called after initializing the framework config
initializeConfig()
