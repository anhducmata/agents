export interface Tool {
  id: string
  name: string
  description: string
  method: string
  url: string
  category: string
  headers?: Header[]
  parameters?: Parameter[]
  body?: string
  bodyType?: string
  authentication?: Authentication
  usageCount: number
  createdAt: Date
  updatedAt: Date
  agents?: string[]
  bodyFileName?: string
}

export interface Header {
  key: string
  value: string
}

export interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
  location: string
  default?: string
}

export interface Secret {
  id: string
  type: string
  name: string
  username?: string
  password?: string
  apiKeyName?: string
  apiKeyValue?: string
  bearerToken?: string
  value?: string
}

interface Authentication {
  type: string
  username?: string
  password?: string
  apiKeyName?: string
  apiKeyValue?: string
  bearerToken?: string
  secretId?: string
}
