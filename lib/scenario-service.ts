import { executeQuery } from "./db"
import type { Scenario, ScenarioData, ScenarioVersion } from "./types"

export async function getScenarios(userId: string): Promise<Scenario[]> {
  const query = `
    SELECT * FROM scenarios 
    WHERE user_id = $1
    ORDER BY updated_at DESC
  `

  return await executeQuery(query, [userId])
}

export async function getScenarioById(scenarioId: string): Promise<Scenario | null> {
  const query = `
    SELECT * FROM scenarios 
    WHERE scenario_id = $1
    LIMIT 1
  `

  const results = await executeQuery(query, [scenarioId])
  return results.length > 0 ? results[0] : null
}

export async function createScenario(
  name: string,
  description: string | null,
  userId: string,
  scenarioData: ScenarioData,
): Promise<Scenario> {
  // Generate a unique scenario_id
  const scenarioId = `scenario-${Date.now()}`

  const query = `
    INSERT INTO scenarios (
      scenario_id, name, description, is_active, user_id, 
      scenario_data, current_version, created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `

  const now = new Date()
  const params = [
    scenarioId,
    name,
    description,
    true, // is_active
    userId,
    JSON.stringify(scenarioData),
    1, // current_version
    now,
    now,
  ]

  const results = await executeQuery(query, params)
  return results[0]
}

export async function updateScenario(
  scenarioId: string,
  updates: {
    name?: string
    description?: string
    is_active?: boolean
    scenario_data?: ScenarioData
  },
  userId: string,
  changeDescription?: string,
): Promise<Scenario> {
  // First, get the current scenario to create a version
  const currentScenario = await getScenarioById(scenarioId)
  if (!currentScenario) {
    throw new Error(`Scenario with ID ${scenarioId} not found`)
  }

  // Create a version record
  await createScenarioVersion(
    scenarioId,
    currentScenario.current_version,
    currentScenario.scenario_data,
    userId,
    changeDescription || "Updated scenario",
  )

  // Build the update query dynamically based on what's being updated
  let setClause = ""
  const params: any[] = []
  let paramIndex = 1

  if (updates.name !== undefined) {
    setClause += `name = $${paramIndex}, `
    params.push(updates.name)
    paramIndex++
  }

  if (updates.description !== undefined) {
    setClause += `description = $${paramIndex}, `
    params.push(updates.description)
    paramIndex++
  }

  if (updates.is_active !== undefined) {
    setClause += `is_active = $${paramIndex}, `
    params.push(updates.is_active)
    paramIndex++
  }

  if (updates.scenario_data !== undefined) {
    setClause += `scenario_data = $${paramIndex}, `
    params.push(JSON.stringify(updates.scenario_data))
    paramIndex++
  }

  // Always update these fields
  setClause += `current_version = $${paramIndex}, `
  params.push(currentScenario.current_version + 1)
  paramIndex++

  setClause += `updated_at = $${paramIndex} `
  params.push(new Date())
  paramIndex++

  // Add the scenario_id as the last parameter
  params.push(scenarioId)

  const query = `
    UPDATE scenarios
    SET ${setClause}
    WHERE scenario_id = $${paramIndex}
    RETURNING *
  `

  const results = await executeQuery(query, params)
  return results[0]
}

export async function deleteScenario(scenarioId: string): Promise<boolean> {
  // This will cascade delete all versions due to the foreign key constraint
  const query = `
    DELETE FROM scenarios
    WHERE scenario_id = $1
  `

  const result = await executeQuery(query, [scenarioId])
  return result.rowCount > 0
}

export async function getScenarioVersions(scenarioId: string): Promise<ScenarioVersion[]> {
  const query = `
    SELECT * FROM scenario_versions
    WHERE scenario_id = $1
    ORDER BY version_number DESC
  `

  return await executeQuery(query, [scenarioId])
}

export async function getScenarioVersion(scenarioId: string, versionNumber: number): Promise<ScenarioVersion | null> {
  const query = `
    SELECT * FROM scenario_versions
    WHERE scenario_id = $1 AND version_number = $2
    LIMIT 1
  `

  const results = await executeQuery(query, [scenarioId, versionNumber])
  return results.length > 0 ? results[0] : null
}

export async function createScenarioVersion(
  scenarioId: string,
  versionNumber: number,
  scenarioData: ScenarioData,
  createdBy: string,
  changeDescription?: string,
): Promise<ScenarioVersion> {
  const query = `
    INSERT INTO scenario_versions (
      scenario_id, version_number, scenario_data, 
      created_by, change_description, created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `

  const params = [
    scenarioId,
    versionNumber,
    JSON.stringify(scenarioData),
    createdBy,
    changeDescription || null,
    new Date(),
  ]

  const results = await executeQuery(query, params)
  return results[0]
}

export async function restoreScenarioVersion(
  scenarioId: string,
  versionNumber: number,
  userId: string,
): Promise<Scenario> {
  // Get the version to restore
  const versionToRestore = await getScenarioVersion(scenarioId, versionNumber)
  if (!versionToRestore) {
    throw new Error(`Version ${versionNumber} of scenario ${scenarioId} not found`)
  }

  // Update the current scenario with the version data
  return await updateScenario(
    scenarioId,
    { scenario_data: versionToRestore.scenario_data },
    userId,
    `Restored from version ${versionNumber}`,
  )
}
