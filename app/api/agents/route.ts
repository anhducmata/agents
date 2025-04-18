import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import type { AgentConfig, AgentProperty } from "@/lib/types"

// Get all agents for a user
export async function GET(request: NextRequest) {
  try {
    // In a real app, get the user ID from the session/auth
    const userId = request.headers.get("x-user-id") || "default-user"

    const query = `
      SELECT ac.*, ap.*
      FROM agent_configs ac
      LEFT JOIN agent_properties ap ON ac.id = ap.agent_id
      WHERE ac.user_id = $1 OR ac.is_public = true
      ORDER BY ac.updated_at DESC
    `

    const results = await executeQuery(query, [userId])

    // Process results to combine agent_configs and agent_properties
    const agents = results.map((row) => {
      const config: Partial<AgentConfig> = {
        id: row.id,
        name: row.name,
        description: row.description,
        system_prompt: row.system_prompt,
        instructions: row.instructions,
        model: row.model,
        temperature: row.temperature,
        max_tokens: row.max_tokens,
        is_public: row.is_public,
        user_id: row.user_id,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }

      const properties: Partial<AgentProperty> = {
        agent_id: row.agent_id,
        avatar_src: row.avatar_src,
        status: row.status,
        first_message: row.first_message,
        language: row.language,
        alternative_language: row.alternative_language,
        tone: row.tone,
        voice: row.voice,
        voice_enabled: row.voice_enabled,
        speed: row.speed,
        confidence: row.confidence,
        speed_value: row.speed_value,
        confidence_value: row.confidence_value,
        motivation_value: row.motivation_value,
        version: row.version,
      }

      return {
        ...config,
        properties,
      }
    })

    return NextResponse.json(agents)
  } catch (error: any) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
