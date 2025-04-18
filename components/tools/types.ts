export interface Tool {
  id: string
  name: string
  description: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  url: string
  category: "data" | "action" | "utility" | "integration"
  headers?: Header[]
  parameters?: Parameter[]
  body?: string
  bodyType?: "json" | "text" | "file"
  bodyFileName?: string
  authentication?: Authentication
  usageCount: number
  createdAt: Date
  updatedAt: Date
  agents: string[]
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
  location: "query" | "path" | "header" | "body"
  default: string
}

export interface Authentication {
  type: "none" | "basic" | "apiKey" | "bearer"
  username?: string
  password?: string
  apiKeyName?: string
  apiKeyValue?: string
  bearerToken?: string
  secretId?: string
}

export interface Secret {
  id: string
  type: string
  name: string
  username?: string
  password?: string
  key?: string
  token?: string
  value?: string
}
