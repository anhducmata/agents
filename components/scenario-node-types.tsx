"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { Scenario } from "@/lib/types"

interface NodeTypeCount {
  type: string
  count: number
  scenarios: string[]
}

export default function ScenarioNodeTypes() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nodeTypes, setNodeTypes] = useState<NodeTypeCount[]>([])

  useEffect(() => {
    async function fetchScenarios() {
      try {
        const response = await fetch("/api/scenarios")
        if (!response.ok) {
          throw new Error("Failed to fetch scenarios")
        }
        const data = await response.json()
        setScenarios(data)

        // Process node types
        const typeMap: Record<string, { count: number; scenarios: Set<string> }> = {}

        data.forEach((scenario: Scenario) => {
          scenario.scenario_data.nodes.forEach((node) => {
            const type = node.data.nodeType || "unknown"

            if (!typeMap[type]) {
              typeMap[type] = { count: 0, scenarios: new Set() }
            }

            typeMap[type].count++
            typeMap[type].scenarios.add(scenario.name)
          })
        })

        // Convert to array for display
        const typesArray = Object.entries(typeMap).map(([type, data]) => ({
          type,
          count: data.count,
          scenarios: Array.from(data.scenarios),
        }))

        setNodeTypes(typesArray.sort((a, b) => b.count - a.count))
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchScenarios()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2">Loading node types...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading node types: {error}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Node Types Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nodeTypes.map((nodeType) => (
            <div key={nodeType.type} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium capitalize">{nodeType.type}</h3>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{nodeType.count} nodes</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Used in {nodeType.scenarios.length} scenarios:</p>
                <ul className="list-disc list-inside mt-1">
                  {nodeType.scenarios.map((scenario) => (
                    <li key={scenario}>{scenario}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
