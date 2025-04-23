"use client"

import { useState } from "react"
import { RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Default agent config URL provided by the user
const DEFAULT_AGENT_CONFIG =
  "https://gist.githubusercontent.com/anhducmata/a0ffc94806d4f7a50adef27c0310a04c/raw/2cecbc4c9e840670f4297ad487989466d72156bd/scenario.json"

// Sample agents with their config URLs
const SAMPLE_AGENTS = [
  {
    id: "default",
    name: "Default Agent",
    configUrl: DEFAULT_AGENT_CONFIG,
  },
  {
    id: "customer-support",
    name: "Customer Support",
    configUrl: "https://example.com/customer_support.json",
  },
  {
    id: "sales-assistant",
    name: "Sales Assistant",
    configUrl: "https://example.com/sales_assistant.json",
  },
  {
    id: "technical-support",
    name: "Technical Support",
    configUrl: "https://example.com/technical_support.json",
  },
]

export default function TestModePage() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("default")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [iframeKey, setIframeKey] = useState<number>(0) // Used to force iframe reload

  // Get the selected agent object
  const selectedAgent = SAMPLE_AGENTS.find((agent) => agent.id === selectedAgentId) || SAMPLE_AGENTS[0]

  // Construct the iframe URL
  const iframeUrl = `https://agent-service.ducmata.com?agentConfig=${selectedAgent.configUrl}`

  const handleAgentChange = (agentId: string) => {
    setIsLoading(true)
    setSelectedAgentId(agentId)
    // Force iframe reload by changing the key
    setIframeKey((prevKey) => prevKey + 1)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="h-full">
      <div className="flex flex-col p-6 overflow-hidden h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Test Your Agent</h1>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIframeKey((prevKey) => prevKey + 1)} // Reload iframe
              className="gap-2 bg-black hover:bg-black/80 text-white dark:bg-black dark:hover:bg-black/80"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="agent-select">Select Agent</Label>
              <Select value={selectedAgentId} onValueChange={handleAgentChange}>
                <SelectTrigger id="agent-select" className="w-full">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_AGENTS.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="w-full overflow-hidden rounded-xl shadow-sm border-[0.5px]">
            <CardContent className="p-0 h-[600px] relative">
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
                onLoad={handleIframeLoad}
              />
            </CardContent>
          </Card>
        </div>

        <div className="text-sm text-muted-foreground mt-2">
          <p>
            Currently testing: <span className="font-medium">{selectedAgent.name}</span>
          </p>
          <p className="text-xs">
            Agent config: <span className="font-mono text-xs opacity-70">{selectedAgent.configUrl}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
