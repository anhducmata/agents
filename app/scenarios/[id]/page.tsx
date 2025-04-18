"use client"

import { useState, useEffect } from "react"
import type { Scenario } from "@/lib/types"
import ScenarioFlowEditor from "@/components/scenario-flow-editor"
import { Button } from "@/components/ui/button"
import { Edit, History, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ScenarioViewPage({ params }: { params: { id: string } }) {
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchScenario() {
      try {
        const response = await fetch(`/api/scenarios?id=${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch scenario")
        }
        const data = await response.json()
        setScenario(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchScenario()
  }, [params.id])

  if (loading) {
    return <div className="flex justify-center p-8">Loading scenario...</div>
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>
  }

  if (!scenario) {
    return <div className="p-8">Scenario not found</div>
  }

  return (
    <div className="h-[calc(100vh-64px)]">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/scenarios">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scenarios
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{scenario.name}</h1>
            <p className="text-muted-foreground">{scenario.description || "No description"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/scenarios/${params.id}/versions`}>
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              Version History
            </Button>
          </Link>
          <Link href={`/scenarios/${params.id}/edit`}>
            <Button size="sm" className="gap-2 bg-black hover:bg-black/90 text-white">
              <Edit className="h-4 w-4" />
              Edit Scenario
            </Button>
          </Link>
        </div>
      </div>

      <ScenarioFlowEditor scenarioId={params.id} initialData={scenario.scenario_data} readOnly={true} />
    </div>
  )
}
