"use client"

import React from "react"
import { useState } from "react"
import { BarChart3, Database, Bot, Wrench, Key, MessageSquare, Settings, Beaker } from "lucide-react"
import { Button } from "@/components/ui/button"
import AgentsPage from "@/components/agents-page"
import ToolsPage from "@/components/tools-page"
import RagDataPage from "@/components/rag-data-page"
import AnalyticsPage from "@/components/analytics-page"
import WidgetSettingsPage from "@/components/widget-settings-page"
import TranscriptionHistoryPage from "@/components/transcription-history-page"
import SecretsManagementPage from "@/components/secrets-management-page"
import TestModePage from "@/components/test-mode-page"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("agents")
  const [agentToEdit, setAgentToEdit] = React.useState<string | null>(null)

  const isActive = (view: string) => activeView === view

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Voice Assistant</h1>
        </div>
        <nav className="p-6 space-y-2">
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-sm", isActive("agents") && "bg-gray-100 dark:bg-gray-800")}
            onClick={() => setActiveView("agents")}
          >
            <Bot className="h-4 w-4 mr-2" />
            Agents
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-sm", isActive("tools") && "bg-gray-100 dark:bg-gray-800")}
            onClick={() => setActiveView("tools")}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Tools
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-sm", isActive("rag-data") && "bg-gray-100 dark:bg-gray-800")}
            onClick={() => setActiveView("rag-data")}
          >
            <Database className="h-4 w-4 mr-2" />
            RAG Data
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-sm", isActive("analytics") && "bg-gray-100 dark:bg-gray-800")}
            onClick={() => setActiveView("analytics")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-sm", isActive("transcriptions") && "bg-gray-100 dark:bg-gray-800")}
            onClick={() => setActiveView("transcriptions")}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Conversations
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-sm", isActive("secrets") && "bg-gray-100 dark:bg-gray-800")}
            onClick={() => setActiveView("secrets")}
          >
            <Key className="h-4 w-4 mr-2" />
            Secrets
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sm",
              isActive("widget-settings") && "bg-gray-100 dark:bg-gray-800",
            )}
            onClick={() => setActiveView("widget-settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Widget
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-sm", isActive("test-mode") && "bg-gray-100 dark:bg-gray-800")}
            onClick={() => setActiveView("test-mode")}
          >
            <Beaker className="h-4 w-4 mr-2" />
            Test Mode
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeView === "agents" && <AgentsPage agentToEdit={agentToEdit} setAgentToEdit={setAgentToEdit} />}
        {activeView === "tools" && <ToolsPage onNavigateToAgent={setAgentToEdit} />}
        {activeView === "rag-data" && <RagDataPage />}
        {activeView === "analytics" && <AnalyticsPage />}
        {activeView === "transcriptions" && <TranscriptionHistoryPage />}
        {activeView === "secrets" && <SecretsManagementPage />}
        {activeView === "widget-settings" && <WidgetSettingsPage />}
        {activeView === "test-mode" && <TestModePage />}
      </div>
    </div>
  )
}
