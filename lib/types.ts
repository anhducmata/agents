// Scenario types
export interface Scenario {
  id: number
  scenario_id: string
  name: string
  description: string | null
  is_active: boolean
  user_id: string
  scenario_data: ScenarioData
  current_version: number
  created_at: Date
  updated_at: Date
  last_used_at: Date | null
}

export interface ScenarioVersion {
  id: number
  scenario_id: string
  version_number: number
  scenario_data: ScenarioData
  created_at: Date
  created_by: string | null
  change_description: string | null
}

// Agent types based on existing database schema
export interface AgentConfig {
  id: string
  name: string
  description: string | null
  system_prompt: string | null
  instructions: string | null
  model: string
  temperature: number
  max_tokens: number
  is_public: boolean
  user_id: string
  created_at: Date
  updated_at: Date
}

export interface AgentProperty {
  id: string
  agent_id: string
  avatar_src: string | null
  status: string | null
  first_message: string | null
  language: string | null
  alternative_language: string | null
  tone: string | null
  voice: string | null
  voice_enabled: boolean
  speed: string | null
  confidence: string | null
  speed_value: number | null
  confidence_value: number | null
  motivation_value: number | null
  version: string | null
  updated_at: Date
}

// Scenario data structure
export interface ScenarioData {
  nodes: ScenarioNode[]
  edges: ScenarioEdge[]
  metadata?: Record<string, any>
}

export interface ScenarioNode {
  id: string
  type: string
  position: {
    x: number
    y: number
  }
  data: {
    label: string
    nodeType: "agent" | "tool"
    agentId?: string
    toolId?: string
    avatar?: string
    method?: string
    url?: string
    [key: string]: any
  }
}

export interface ScenarioEdge {
  id: string
  source: string
  target: string
  type?: string
  label?: string
  animated?: boolean
  style?: Record<string, any>
  data?: {
    handoffRule?: string
    isToolConnection?: boolean
    [key: string]: any
  }
}
