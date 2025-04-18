"use client"

import { useState, useEffect } from "react"
import type { Scenario } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, History } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

export default function ScenarioList() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { userId } = useAuth()

  useEffect(() => {
    async function fetchScenarios() {
      if (!userId) return

      try {
        const response = await fetch("/api/scenarios")
        if (!response.ok) {
          throw new Error("Failed to fetch scenarios")
        }
        const data = await response.json()
        setScenarios(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchScenarios()
  }, [userId])

  const handleDeleteScenario = async (scenarioId: string) => {
    if (!confirm("Are you sure you want to delete this scenario?")) {
      return
    }

    try {
      const response = await fetch(`/api/scenarios?id=${scenarioId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete scenario")
      }

      // Remove the deleted scenario from the list
      setScenarios(scenarios.filter((s) => s.scenario_id !== scenarioId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading scenarios...</div>
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>
  }

  if (scenarios.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">No scenarios found. Create your first scenario to get started.</p>
        <Link href="/scenarios/new">
          <Button>Create New Scenario</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {scenarios.map((scenario) => (
        <Card key={scenario.scenario_id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{scenario.name}</CardTitle>
                <CardDescription>{scenario.description || "No description"}</CardDescription>
              </div>
              <Badge variant={scenario.is_active ? "default" : "secondary"}>
                {scenario.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version:</span>
                <span>{scenario.current_version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nodes:</span>
                <span>{scenario.scenario_data.nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Edges:</span>
                <span>{scenario.scenario_data.edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(scenario.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Link href={`/scenarios/${scenario.scenario_id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
              <Link href={`/scenarios/${scenario.scenario_id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
            </div>
            <div className="flex space-x-2">
              <Link href={`/scenarios/${scenario.scenario_id}/versions`}>
                <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-1" />
                  History
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => handleDeleteScenario(scenario.scenario_id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
