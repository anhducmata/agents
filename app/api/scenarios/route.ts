import { type NextRequest, NextResponse } from "next/server"
import { getScenarios, createScenario, getScenarioById, updateScenario, deleteScenario } from "@/lib/scenario-service"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if we're fetching a specific scenario
    const url = new URL(request.url)
    const scenarioId = url.searchParams.get("id")

    if (scenarioId) {
      const scenario = await getScenarioById(scenarioId)

      // Check if the scenario belongs to the user
      if (!scenario || scenario.user_id !== userId) {
        return NextResponse.json({ error: "Scenario not found" }, { status: 404 })
      }

      return NextResponse.json(scenario)
    }

    // Otherwise, get all scenarios for the user
    const scenarios = await getScenarios(userId)
    return NextResponse.json(scenarios)
  } catch (error: any) {
    console.error("Error fetching scenarios:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, scenarioData } = body

    if (!name || !scenarioData) {
      return NextResponse.json({ error: "Name and scenario data are required" }, { status: 400 })
    }

    const newScenario = await createScenario(name, description, userId, scenarioData)
    return NextResponse.json(newScenario, { status: 201 })
  } catch (error: any) {
    console.error("Error creating scenario:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { scenarioId, name, description, is_active, scenarioData } = body

    if (!scenarioId) {
      return NextResponse.json({ error: "Scenario ID is required" }, { status: 400 })
    }

    // Verify ownership
    const scenario = await getScenarioById(scenarioId)
    if (!scenario || scenario.user_id !== userId) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 })
    }

    const updates: any = {}
    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (is_active !== undefined) updates.is_active = is_active
    if (scenarioData !== undefined) updates.scenario_data = scenarioData

    const updatedScenario = await updateScenario(scenarioId, updates, userId, body.changeDescription)

    return NextResponse.json(updatedScenario)
  } catch (error: any) {
    console.error("Error updating scenario:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const scenarioId = url.searchParams.get("id")

    if (!scenarioId) {
      return NextResponse.json({ error: "Scenario ID is required" }, { status: 400 })
    }

    // Verify ownership
    const scenario = await getScenarioById(scenarioId)
    if (!scenario || scenario.user_id !== userId) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 })
    }

    const success = await deleteScenario(scenarioId)
    if (!success) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting scenario:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
