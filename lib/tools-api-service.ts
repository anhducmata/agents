// API service for tools

export interface Tool {
  id: string
  name: string
  content: any
  createdAt?: string
}

export interface CreateToolPayload {
  name: string
  content: any
}

export interface UpdateToolPayload {
  name?: string
  content?: any
}

const API_URL = "https://68096af81f1a52874cdcce59.mockapi.io/tools"

// Get all tools
export async function getTools(): Promise<Tool[]> {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch tools: ${response.statusText}`)
  }
  return response.json()
}

// Get a single tool by ID
export async function getTool(id: string): Promise<Tool> {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch tool: ${response.statusText}`)
  }
  return response.json()
}

// Create a new tool
export async function createTool(tool: CreateToolPayload): Promise<Tool> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tool),
  })
  if (!response.ok) {
    throw new Error(`Failed to create tool: ${response.statusText}`)
  }
  return response.json()
}

// Update an existing tool
export async function updateTool(id: string, tool: UpdateToolPayload): Promise<Tool> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tool),
  })
  if (!response.ok) {
    throw new Error(`Failed to update tool: ${response.statusText}`)
  }
  return response.json()
}

// Delete a tool
export async function deleteTool(id: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error(`Failed to delete tool: ${response.statusText}`)
  }
  return true
}
