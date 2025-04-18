import { type NextRequest, NextResponse } from "next/server"
import {
  getScenarioVersions,
  getScenarioVersion,
  restoreScenarioVersion,
  getScenarioById,
} from "@/lib/scenario-service"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const scenarioId = url.searchParams.get("scenarioId")
    const versionNumber = url.searchParams.get("version")

    if (!scenarioId) {
      return NextResponse.json({ error: "Scenario ID is required" }, { status: 400 })
    }

    // Verify ownership
    const scenario = await getScenarioById(scenarioId)
    if (!scenario || scenario.user_id !== userId) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 })
    }

    // If version number is provided, get that specific version
    if (versionNumber) {
      const version = await getScenarioVersion(scenarioId, Number.parseInt(versionNumber))
      if (!version) {
        return NextResponse.json({ error: "Version not found" }, { status: 404 })
      }
      return NextResponse.json(version)
    }

    // Otherwise, get all versions for the scenario
    const versions = await getScenarioVersions(scenarioId)
    return NextResponse.json(versions)
  } catch (error: any) {
    console.error("Error fetching scenario versions:", error)
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
    const { scenarioId, versionNumber } = body

    if (!scenarioId || !versionNumber) {
      return NextResponse.json({ error: "Scenario ID and version number are required" }, { status: 400 })
    }

    // Verify ownership
    const scenario = await getScenarioById(scenarioId)
    if (!scenario || scenario.user_id !== userId) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 })
    }

    // Restore the scenario to the specified version
    const restoredScenario = await restoreScenarioVersion(scenarioId, Number.parseInt(versionNumber), userId)

    return NextResponse.json(restoredScenario)
  } catch (error: any) {
    console.error("Error restoring scenario version:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
