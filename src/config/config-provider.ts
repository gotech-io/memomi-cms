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
  loginEmail: z.string().email(),
})

// Config values
const config: ConfigSchemaInput = {
  loginEmail: process.env.LOGIN_EMAIL || 'default@email.com',
}
