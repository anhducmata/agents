// API service for agents

export interface Agent {
  id: string
  agentName: string
  instruction: string
  updated?: string
  avatarUrl?: string
  rawSettings?: any
}

export interface CreateAgentPayload {
  agentName: string
  instruction: string
  avatarUrl?: string
  rawSettings?: any
}

export interface UpdateAgentPayload {
  agentName?: string
  instruction?: string
  avatarUrl?: string
  rawSettings?: any
}

const API_URL = "https://68096af81f1a52874cdcce59.mockapi.io/agents"

// Get all agents
export async function getAgents(): Promise<Agent[]> {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch agents: ${response.statusText}`)
  }
  return response.json()
}

// Get a single agent by ID
export async function getAgent(id: string): Promise<Agent> {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch agent: ${response.statusText}`)
  }
  return response.json()
}

// Create a new agent
export async function createAgent(agent: CreateAgentPayload): Promise<Agent> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agent),
  })
  if (!response.ok) {
    throw new Error(`Failed to create agent: ${response.statusText}`)
  }
  return response.json()
}

// Update an existing agent
export async function updateAgent(id: string, agent: UpdateAgentPayload): Promise<Agent> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agent),
  })
  if (!response.ok) {
    throw new Error(`Failed to update agent: ${response.statusText}`)
  }
  return response.json()
}

// Delete an agent
export async function deleteAgent(id: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error(`Failed to delete agent: ${response.statusText}`)
  }
  return true
}
