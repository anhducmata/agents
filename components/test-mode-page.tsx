"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function TestModePage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("1")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [iframeKey, setIframeKey] = useState<number>(0)
  const [scenarios, setScenarios] = useState<{ id: string; name: string }[]>([])
  const [isLoadingScenarios, setIsLoadingScenarios] = useState<boolean>(false)

  // Construct the iframe URL
  const iframeUrl = `https://agent-service.ducmata.com?scenario=${selectedScenarioId}`

  // Load scenarios on component mount
  useEffect(() => {
    loadScenarios()
  }, [])

  // Load scenarios from the mock API
  const loadScenarios = async () => {
    setIsLoadingScenarios(true)
    try {
      const response = await fetch("https://5f677b0438ce870016398690.mockapi.io/api/scenarios")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Extract scenarios from the API response
      const extractedScenarios = data.flatMap((item) => {
        // Check if content and scenarios exist
        if (item.content && item.content.scenarios && Array.isArray(item.content.scenarios)) {
          // Map each scenario in the array
          return item.content.scenarios.map((scenario, index) => ({
            id: `${item.id}_${index}`,
            name: scenario.name || `Scenario ${index + 1}`,
          }))
        } else if (item.content && item.content.scenario_name) {
          // Handle single scenario format
          return [
            {
              id: item.id,
              name: item.content.scenario_name,
            },
          ]
        }
        // Default fallback
        return [
          {
            id: item.id,
            name: `Scenario ${item.id}`,
          },
        ]
      })

      setScenarios(extractedScenarios)

      // If we have scenarios, select the first one
      if (extractedScenarios.length > 0) {
        setSelectedScenarioId(extractedScenarios[0].id)
      }

      toast({
        title: "Scenarios loaded",
        description: `${extractedScenarios.length} scenario(s) loaded from the API.`,
      })
    } catch (error) {
      console.error("Error loading scenarios:", error)
      toast({
        title: "Failed to load scenarios",
        description: "There was an error loading scenarios from the API.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingScenarios(false)
    }
  }

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId)
    setIsLoading(true)
    // Force iframe reload by changing the key
    setIframeKey((prevKey) => prevKey + 1)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleRefresh = () => {
    setIframeKey((prevKey) => prevKey + 1)
    setIsLoading(true)
  }

  return (
    <div className="h-full">
      <div className="flex flex-col p-6 overflow-hidden h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Test Your Agent</h1>
          <Button
            variant="default"
            size="sm"
            onClick={handleRefresh}
            className="gap-2 bg-black hover:bg-black/80 text-white dark:bg-black dark:hover:bg-black/80"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="mb-6">
          <div className="space-y-2 max-w-md">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                {isLoadingScenarios ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading scenarios...</span>
                  </div>
                ) : (
                  <Select value={selectedScenarioId} onValueChange={handleScenarioChange}>
                    <SelectTrigger id="scenario-select" className="w-full">
                      <SelectValue placeholder="Select a scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.map((scenario) => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          {scenario.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadScenarios}
                className="gap-2"
                disabled={isLoadingScenarios}
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingScenarios ? "animate-spin" : ""}`} />
                Reload
              </Button>
            </div>
          </div>
        </div>

        <Card className="w-full overflow-hidden rounded-xl shadow-sm border-[0.5px] flex-1">
          <CardContent className="p-0 h-full relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading agent...</p>
                </div>
              </div>
            )}
            <iframe
              key={iframeKey}
              src={iframeUrl}
              title="Agent Service"
              width="100%"
              height="100%"
              style={{ border: "none" }}
              allow="microphone; camera; autoplay; clipboard-write"
              allowFullScreen
              onLoad={handleIframeLoad}
            />
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground mt-4">
          <p>
            Currently testing:{" "}
            <span className="font-medium">
              {scenarios.find((s) => s.id === selectedScenarioId)?.name || "Unknown Scenario"}
            </span>
          </p>
          <p className="text-xs mt-1">
            URL: <span className="font-mono text-xs opacity-70">{iframeUrl}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
