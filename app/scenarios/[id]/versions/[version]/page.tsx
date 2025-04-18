"use client"

import { useState, useEffect } from "react"
import type { ScenarioVersion } from "@/lib/types"
import ScenarioFlowEditor from "@/components/scenario-flow-editor"
import { Button } from "@/components/ui/button"
import { RotateCcw, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ScenarioVersionViewPage({
  params,
}: {
  params: { id: string; version: string }
}) {
  const [version, setVersion] = useState<ScenarioVersion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchVersion() {
      try {
        const response = await fetch(`/api/scenarios/versions?scenarioId=${params.id}&version=${params.version}`)
        if (!response.ok) {
          throw new Error("Failed to fetch scenario version")
        }
        const data = await response.json()
        setVersion(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVersion()
  }, [params.id, params.version])

  const handleRestore = async () => {
    if (!confirm(`Are you sure you want to restore version ${params.version}?`)) {
      return
    }

    setRestoring(true)
    try {
      const response = await fetch("/api/scenarios/versions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenarioId: params.id,
          versionNumber: params.version,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to restore version")
      }

      router.push(`/scenarios/${params.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setRestoring(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading version...</div>
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>
  }

  if (!version) {
    return <div className="p-8">Version not found</div>
  }

  return (
    <div className="h-[calc(100vh-64px)]">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href={`/scenarios/${params.id}/versions`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Versions
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Version {version.version_number}</h1>
            <p className="text-muted-foreground">
              Created on {new Date(version.created_at).toLocaleString()}
              {version.change_description && ` - ${version.change_description}`}
            </p>
          </div>
        </div>
        <Button onClick={handleRestore} disabled={restoring} className="gap-2 bg-black hover:bg-black/90 text-white">
          <RotateCcw className="h-4 w-4" />
          {restoring ? "Restoring..." : "Restore This Version"}
        </Button>
      </div>

      <ScenarioFlowEditor initialData={version.scenario_data} readOnly={true} />
    </div>
  )
}
