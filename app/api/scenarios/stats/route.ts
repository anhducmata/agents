import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get scenario statistics
    const statsQuery = `
      SELECT
        COUNT(*) as total_scenarios,
        AVG(current_version) as avg_version,
        MAX(current_version) as max_version,
        COUNT(*) FILTER (WHERE is_active = true) as active_scenarios,
        AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) as avg_age_days
      FROM scenarios
      WHERE user_id = $1
    `

    const versionStatsQuery = `
      SELECT
        COUNT(*) as total_versions,
        COUNT(DISTINCT scenario_id) as scenarios_with_versions,
        AVG(version_number) as avg_version_number
      FROM scenario_versions
      WHERE scenario_id IN (SELECT scenario_id FROM scenarios WHERE user_id = $1)
    `

    const [scenarioStats, versionStats] = await Promise.all([
      executeQuery(statsQuery, [userId]),
      executeQuery(versionStatsQuery, [userId]),
    ])

    return NextResponse.json({
      scenarioStats: scenarioStats[0],
      versionStats: versionStats[0],
    })
  } catch (error: any) {
    console.error("Error fetching scenario statistics:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
