"use client"

import { TooltipContent } from "@/components/ui/tooltip"

import { TooltipTrigger } from "@/components/ui/tooltip"

import { Tooltip } from "@/components/ui/tooltip"

import { TooltipProvider } from "@/components/ui/tooltip"

import React from "react"
import { useState } from "react"
import {
  BarChart3,
  Database,
  Bot,
  Wrench,
  Key,
  MessageSquare,
  Settings,
  Beaker,
  GitBranch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import AgentsPage from "@/components/agents-page"
import ToolsPage from "@/components/tools-page"
import RagDataPage from "@/components/rag-data-page"
import AnalyticsPage from "@/components/analytics-page"
import WidgetSettingsPage from "@/components/widget-settings-page"
import TranscriptionHistoryPage from "@/components/transcription-history-page"
import SecretsManagementPage from "@/components/secrets-management-page"
import TestModePage from "@/components/test-mode-page"
import ScenariosPage from "@/components/scenarios-page"
import { cn } from "@/lib/utils"

// Add the import for the AgentIdDisplay component
import { AgentIdDisplay } from "@/components/agent-id-display"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("agents")
  const [agentToEdit, setAgentToEdit] = React.useState<string | null>(null)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  const isActive = (view: string) => activeView === view

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-all duration-300 ease-in-out relative",
          isSidebarExpanded ? "w-64" : "w-16",
        )}
      >
        {/* Toggle button positioned in the middle of the right border */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-50 dark:bg-gray-900 rounded-full p-1 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out shadow-sm z-10"
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <div className="transition-transform duration-300 ease-in-out">
            {isSidebarExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </button>
        <div className={cn("transition-all duration-300 ease-in-out", isSidebarExpanded ? "p-6" : "p-4 text-center")}>
          <div
            className={cn(
              "transition-opacity duration-300 ease-in-out",
              isSidebarExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden",
            )}
          >
            <h1 className="text-2xl font-bold">Voice Assistant</h1>
          </div>
          <div
            className={cn(
              "transition-opacity duration-300 ease-in-out",
              isSidebarExpanded ? "opacity-0 h-0 overflow-hidden" : "opacity-100",
            )}
          >
            <Bot className="h-6 w-6 mx-auto" />
          </div>
        </div>
        <nav
          className={cn(
            "flex-grow transition-all duration-300 ease-in-out",
            isSidebarExpanded ? "p-6 space-y-2" : "p-3 space-y-2",
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("agents") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("agents")}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Agents
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Agents</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("scenarios") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("scenarios")}
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Scenarios
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Scenarios</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("tools") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("tools")}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Tools
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Tools</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("rag-data") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("rag-data")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    RAG Data
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">RAG Data</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("analytics") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("analytics")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Analytics
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Analytics</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("transcriptions") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("transcriptions")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Conversations
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Conversations</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("secrets") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("secrets")}
                >
                  <Key className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Secrets
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Secrets</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("widget-settings") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("widget-settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Widget
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Widget</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("test-mode") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("test-mode")}
                >
                  <Beaker className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Test Mode
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Test Mode</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </nav>
        <div
          className={cn(
            "border-t border-gray-200 dark:border-gray-800 mt-auto transition-all duration-300 ease-in-out",
            isSidebarExpanded ? "p-6 pt-4" : "p-3 pt-3",
          )}
        >
          {isSidebarExpanded && (
            <div className="mb-4">
              <AgentIdDisplay showControls={false} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeView === "agents" && <AgentsPage agentToEdit={agentToEdit} setAgentToEdit={setAgentToEdit} />}
        {activeView === "scenarios" && <ScenariosPage />}
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
