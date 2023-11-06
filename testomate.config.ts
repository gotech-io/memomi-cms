import { SauceLabsNotifierPlugin, initializeFrameworkConfig } from '@testomate/framework'
import dotenv from 'dotenv'
import path from 'path'
import { initializeConfig } from './src/config/index.js'

dotenv.config({path: path.resolve(process.cwd(), '.env')})
if (process.env.DOTENV_CONFIG_PATH) {
    dotenv.config({path: process.env.DOTENV_CONFIG_PATH, override: true})
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
    playwright: {
        testDir: './src/tests/',
        fullyParallel: true,
        timeout: 60 * 1000,
        forbidOnly: false,
        retries: 0,
        workers: 1,
        use: {
            trace: 'retain-on-failure',
            headless: false,
        },
        reporter: [
            ['dot'],
            // [
            //     'allure-playwright',
            //     {
            //         detail: true,
            //         outputFolder: 'allure-results',
            //         suiteTitle: true,
            //     },
            // ],
        ],
    },
})

// This initializes the config provider, needs to be called after initializing the framework config
initializeConfig()
