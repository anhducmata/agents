"use client"

import { useState } from "react"
import { AIInput } from "@/components/ui/ai-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Dashboard from "@/components/dashboard"
import AgentsPage from "@/components/agents-page"
import ToolsPage from "@/components/tools-page"
import ScenariosPage from "@/components/scenarios-page"
import RagDataPage from "@/components/rag-data-page"
import AnalyticsPage from "@/components/analytics-page"
import TranscriptionHistoryPage from "@/components/transcription-history-page"
import WidgetSettingsPage from "@/components/widget-settings-page"
import SecretsManagementPage from "@/components/secrets-management-page"
import TestModePage from "@/components/test-mode-page"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedAgent, setSelectedAgent] = useState("Copywriter Agent")
  const [selectedScenario, setSelectedScenario] = useState("scenario-1")

  const handleSubmit = (value: string, agent: string) => {
    console.log(`Submitting: ${value} with agent: ${agent}`)
    // Handle submission logic here
  }

  const handleVoiceToggle = () => {
    console.log("Voice toggled")
    // Handle voice toggle logic here
  }

  const handleNavigateToAgent = (agentName: string) => {
    setActiveTab("agents")
    // Additional logic to focus on the specific agent
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex-1">
            <TabsContent value="dashboard" className="h-full">
              <Dashboard />
            </TabsContent>
            <TabsContent value="agents" className="h-full">
              <AgentsPage />
            </TabsContent>
            <TabsContent value="tools" className="h-full">
              <ToolsPage onNavigateToAgent={handleNavigateToAgent} />
            </TabsContent>
            <TabsContent value="scenarios" className="h-full">
              <ScenariosPage />
            </TabsContent>
            <TabsContent value="rag" className="h-full">
              <RagDataPage />
            </TabsContent>
            <TabsContent value="analytics" className="h-full">
              <AnalyticsPage />
            </TabsContent>
            <TabsContent value="transcriptions" className="h-full">
              <TranscriptionHistoryPage />
            </TabsContent>
            <TabsContent value="widget" className="h-full">
              <WidgetSettingsPage />
            </TabsContent>
            <TabsContent value="secrets" className="h-full">
              <SecretsManagementPage />
            </TabsContent>
            <TabsContent value="test" className="h-full">
              <TestModePage />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {activeTab === "test" && (
        <div className="border-t">
          <div className="container mx-auto px-4">
            <AIInput
              variant="default"
              onSubmit={handleSubmit}
              onVoiceToggle={handleVoiceToggle}
              selectedAgent={selectedAgent}
              onAgentChange={setSelectedAgent}
              selectedScenario={selectedScenario}
              onScenarioChange={setSelectedScenario}
            />
          </div>
        </div>
      )}
    </main>
  )
}
