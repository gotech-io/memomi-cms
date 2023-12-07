import type { FrameworkConfigProvider } from '@testomate/framework'
import { frameworkConfigProvider } from '@testomate/framework'
import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.secret' })

type ConfigSchema = z.infer<typeof ConfigSchemaZod>
type ConfigSchemaInput = z.input<typeof ConfigSchemaZod>
export type ConfigProvider = ConfigSchema & { framework: FrameworkConfigProvider }

export const configProvider: ConfigProvider = {} as unknown as ConfigProvider

export function initializeConfig() {
  const parsedConfig = ConfigSchemaZod.parse(config)
  Object.assign(configProvider, parsedConfig)
  configProvider.framework = frameworkConfigProvider
}

// Config schema
const ConfigSchemaZod = z.object({
  cmsSystem: z.string().email(),
  cmsAdmin: z.string().email(),
  cmsDesigner: z.string().email(),
  cmsQC: z.string().email(),
  cmsExternalDesigner: z.string().email(),
  cmsSiteOps: z.string().email(),
  cmsPassword: z.string(),
  walmartAutomationProduct: z.string(),
  walmartAutomationProductFiles: z.string(),
  walmartAutomationInvalidProduct: z.string(),
  walmartAutomationResourcesPath: z.string(),
  walmartAutomationGeneratePath: z.string(),
  automationDesigner: z.string(),
})

// Config values
const config: ConfigSchemaInput = {
  cmsSystem: process.env.CMS_SYSTEM_USER || 'example@walmart.com',
  cmsAdmin: process.env.CMS_ADMIN_USER || 'example@walmart.com',
  cmsDesigner: process.env.CMS_DESIGNER_USER || 'example@walmart.com',
  cmsQC: process.env.CMS_QC_USER || 'example@walmart.com',
  cmsExternalDesigner: process.env.CMS_EXTERNAL_DESIGNER_USER || 'example@walmart.com',
  cmsSiteOps: process.env.CMS_SITEOPS_USER || 'example@walmart.com',
  cmsPassword: process.env.CMS_PASSWORD || 'example@walmart.com',
  walmartAutomationProduct: process.env.WALMART_AUTOMATION_PRODUCT || 'walmart-automation',
  walmartAutomationProductFiles: process.env.WALMART_AUTOMATION_PRODUCT_FILES || 'src/tests/browser/resources/product-files.json',
  walmartAutomationInvalidProduct: process.env.WALMART_AUTOMATION_INVALID_PRODUCT || 'walmart-invalid_angle.jpg',
  walmartAutomationResourcesPath: process.env.WALMART_AUTOMATION_RESOURCES_PATH || 'src/tests/browser/resources/walmart_auto_glass',
  walmartAutomationGeneratePath: process.env.WALMART_AUTOMATION_GENERATE_PATH || 'downloads/',
  automationDesigner: process.env.AUTOMATION_DESIGNER || 'auto-designer',
}
