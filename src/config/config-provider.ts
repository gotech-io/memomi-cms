import type { FrameworkConfigProvider } from '@testomate/framework'
import { frameworkConfigProvider } from '@testomate/framework'
import { z } from 'zod'

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
  cmsAdminUser: z.string().email(),
  cmsPassword: z.string(),
  cmsVersion: z.string(),
})

// Config values
const config: ConfigSchemaInput = {
  cmsAdminUser: process.env.CMS_ADMIN_USER || 'olga-manager@walmanrt.com',
  cmsPassword: process.env.CMS_PASSWORD || '502241114',
  cmsVersion: process.env.CMS_VERSION || '2.2.6',
}
