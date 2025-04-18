"use client"

import { useState, useEffect } from "react"
import type { ScenarioVersion } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Eye, Clock, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ScenarioVersionHistoryProps {
  scenarioId: string
}

export default function ScenarioVersionHistory({ scenarioId }: ScenarioVersionHistoryProps) {
  const [versions, setVersions] = useState<ScenarioVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchVersions() {
      try {
        const response = await fetch(`/api/scenarios/versions?scenarioId=${scenarioId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch scenario versions")
        }
        const data = await response.json()
        setVersions(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVersions()
  }, [scenarioId])

  const handleRestoreVersion = async (versionNumber: number) => {
    if (!confirm(`Are you sure you want to restore version ${versionNumber}?`)) {
      return
    }

    try {
      const response = await fetch("/api/scenarios/versions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenarioId,
          versionNumber,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to restore version")
      }

      // Redirect to the scenario page after successful restoration
      router.push(`/scenarios/${scenarioId}`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading version history...</div>
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <Link href={`/scenarios/${scenarioId}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scenario
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Version History</h1>
      </div>

      {versions.length === 0 ? (
        <div className="text-center p-8">
          <p>No version history found for this scenario.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((version) => (
            <Card key={version.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Version {version.version_number}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleRestoreVersion(version.version_number)}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Restore
                    </Button>
                    <Link href={`/scenarios/${scenarioId}/versions/${version.version_number}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Created on {new Date(version.created_at).toLocaleString()}</span>
                  </div>
                  {version.created_by && (
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      <span>By {version.created_by}</span>
                    </div>
                  )}
                  {version.change_description && (
                    <div className="mt-2 p-2 bg-muted rounded-md">
                      <p className="text-sm">{version.change_description}</p>
                    </div>
                  )}
                  <div className="mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Nodes:</span>
                      <span>{version.scenario_data.nodes.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Edges:</span>
                      <span>{version.scenario_data.edges.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
