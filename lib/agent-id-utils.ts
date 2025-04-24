/**
 * Utility functions for agent ID management
 */

// Generate a new agent ID with a specified prefix and random string
export function generateAgentId(prefix = "agent"): string {
  const randomString = Math.random().toString(36).substring(2, 10)
  return `${prefix}_${randomString}`
}

// Validate if a string is a valid agent ID format
export function isValidAgentId(id: string): boolean {
  if (!id) return false
  if (typeof id !== "string") return false
  if (id.length < 5 || id.length > 50) return false
  if (!/^[a-z0-9_]+$/.test(id)) return false
  const parts = id.split("_")
  if (parts.length !== 2) return false
  if (parts[0].length < 3 || parts[1].length < 3) return false
  return true
}

// Format an agent ID to ensure it follows the correct pattern
export function formatAgentId(id: string): string {
  if (isValidAgentId(id)) {
    return id
  }

  // If it's not valid, try to fix it
  const sanitized = id.toLowerCase().replace(/[^a-z0-9_]/g, "")

  if (sanitized.includes("_")) {
    // If it already has an underscore, assume it's in the right format
    return sanitized
  }

  // Otherwise, treat the whole thing as a name and add the agent prefix
  return `agent_${sanitized}`
}

// Get the current agent ID or generate a new one
export function getCurrentAgentId(existingId?: string): string {
  if (existingId && isValidAgentId(existingId)) {
    return existingId
  }

  // Try to get from localStorage if we're in a browser environment
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("currentAgentId")
    if (storedId && isValidAgentId(storedId)) {
      return storedId
    }

    // Generate a new ID and store it
    const newId = generateAgentId()
    localStorage.setItem("currentAgentId", newId)
    return newId
  }

  // Fallback for server-side rendering
  return generateAgentId()
}

// Store the current agent ID
export function setCurrentAgentId(id: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentAgentId", formatAgentId(id))
  }
}
