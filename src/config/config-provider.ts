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
  cmsAdmin: z.string().email(),
  cmsDesigner: z.string().email(),
  cmsQC: z.string().email(),
  cmsExternalDesigner: z.string().email(),
  cmsSiteOps: z.string().email(),
  cmsPassword: z.string(),
})

// Config values
const config: ConfigSchemaInput = {
  cmsAdmin: process.env.CMS_ADMIN_USER || 'olga-manager@walmanrt.com',
  cmsDesigner: process.env.CMS_DESIGNER_USER || 'olga-designer@walmart.com',
  cmsQC: process.env.CMS_QC_USER || 'olga-qc@walmart.com',
  cmsExternalDesigner: process.env.CMS_EXTERNAL_DESIGNER_USER || 'olga-external@walmanrt.com',
  cmsSiteOps: process.env.CMS_SITEOPS_USER || 'olga-siteOps@walmanrt.com',
  cmsPassword: process.env.CMS_PASSWORD || '502241114',
}
