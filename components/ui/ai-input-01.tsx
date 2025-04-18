"use client"

import { CornerRightUp, Mic } from "lucide-react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"
import { useClickOutside } from "@/hooks/use-click-outside"

// Define available agents
const AI_AGENTS = [
  {
    name: "Copywriter Agent",
    description: "Write anything you want",
    avatar: "/avatars/avatar-female-02.svg",
    icon: "Pencil",
  },
  {
    name: "Nextjs Agent",
    description: "Write code for anything you want",
    avatar: "/avatars/avatar-male-01.svg",
    icon: "Code",
  },
  {
    name: "Customer Support",
    description: "Get help with your questions",
    avatar: "/avatars/avatar-female-13.svg",
    icon: "HelpCircle",
  },
  {
    name: "Data Analyst",
    description: "Analyze and visualize your data",
    avatar: "/avatars/avatar-male-13.svg",
    icon: "BarChart",
  },
].map((model) => ({ ...model }))

// Define available scenarios
const SCENARIOS = [
  {
    name: "Customer Support Flow",
    description: "Handle customer inquiries and support requests",
    id: "scenario-1",
  },
  {
    name: "Sales Conversation",
    description: "Guide customers through product offerings",
    id: "scenario-2",
  },
  {
    name: "Technical Troubleshooting",
    description: "Help users solve technical problems",
    id: "scenario-3",
  },
].map((scenario) => ({ ...scenario }))

interface AIInput01Props {
  onSubmit: (input: string, agent: string) => void
  onVoiceToggle: () => void
  selectedAgent: string
  onAgentChange: (agent: string) => void
  selectedScenario?: string
  onScenarioChange?: (scenario: string) => void
}

export default function AIInput01({
  onSubmit,
  onVoiceToggle,
  selectedAgent,
  onAgentChange,
  selectedScenario,
  onScenarioChange,
}: AIInput01Props) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 52,
    maxHeight: 200,
  })

  const [state, setState] = useState({
    value: "",
    isAgentMenuOpen: false,
    selectionType: "agent", // "agent" or "scenario"
  })

  const menuRef = useRef<HTMLDivElement>(null)

  useClickOutside(menuRef, () => {
    setState((prev) => ({ ...prev, isAgentMenuOpen: false }))
  })

  const handleReset = () => {
    if (state.selectionType === "agent") {
      onSubmit(state.value, selectedAgent)
    } else {
      // If a scenario is selected and the callback exists
      if (onScenarioChange && selectedScenario) {
        onSubmit(state.value, selectedScenario)
      }
    }
    setState((prev) => ({ ...prev, value: "" }))
    adjustHeight(true)
  }

  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="w-full">
      <div className="relative w-full mx-auto">
        <div className="bg-black/5 dark:bg-white/5 rounded-3xl">
          <div className="flex items-center px-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                  state.selectionType === "agent"
                    ? "bg-black/10 dark:bg-white/10"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                onClick={() => updateState({ selectionType: "agent" })}
              >
                Agent
              </button>
              <button
                type="button"
                className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                  state.selectionType === "scenario"
                    ? "bg-black/10 dark:bg-white/10"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                onClick={() => updateState({ selectionType: "scenario" })}
              >
                Scenario
              </button>

              <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 mx-2" />

              <button
                type="button"
                onClick={() => updateState({ isAgentMenuOpen: !state.isAgentMenuOpen })}
                className="flex items-center p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
              >
                {(() => {
                  if (state.selectionType === "agent") {
                    // Find the selected agent or use the first one as default
                    const agent = AI_AGENTS.find((a) => a.name === selectedAgent) || AI_AGENTS[0]
                    return (
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                        <img
                          src={agent.avatar || "/placeholder.svg"}
                          alt={agent.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  } else {
                    // Show scenario icon
                    return (
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                      </div>
                    )
                  }
                })()}
              </button>
            </div>

            <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 mx-2" />

            <Textarea
              id="ai-input-01"
              placeholder="Ask me anything!"
              className={cn(
                "max-w-xl bg-transparent rounded-3xl pl-2 pr-16",
                "placeholder:text-black/50 dark:placeholder:text-white/50",
                "border-none ring-0",
                "text-black dark:text-white text-wrap",
                "overflow-y-auto resize-none",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "transition-[height] duration-100 ease-out",
                "leading-[1.2] py-[16px]",
                "min-h-[52px]",
                "max-h-[200px]",
              )}
              ref={textareaRef}
              value={state.value}
              onChange={(e) => {
                updateState({ value: e.target.value })
                adjustHeight()
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleReset()
                }
              }}
            />
          </div>
        </div>

        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1 transition-all duration-200",
            state.value ? "right-10" : "right-3",
          )}
          onClick={onVoiceToggle}
        >
          <Mic className="w-4 h-4 text-black/70 dark:text-white/70" />
        </div>

        <button
          onClick={handleReset}
          type="button"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1 transition-all duration-700",
            state.value ? "block right-3 animate-slide-in cursor-pointer" : "hidden",
          )}
        >
          <CornerRightUp className="w-4 h-4 text-black/70 dark:text-white/70 transition-opacity duration-700" />
        </button>

        {/* Agent/Scenario Selection Menu */}
        {state.isAgentMenuOpen && (
          <div
            ref={menuRef}
            className="absolute bottom-full left-2 mb-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-black/10 dark:border-white/10 py-1 w-72 z-50"
          >
            {state.selectionType === "agent"
              ? // Show agents
                AI_AGENTS.map((agent) => (
                  <button
                    key={agent.name}
                    type="button"
                    onClick={() => {
                      onAgentChange(agent.name)
                      updateState({ isAgentMenuOpen: false })
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      <img
                        src={agent.avatar || "/placeholder.svg"}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm dark:text-white">{agent.name}</div>
                      <div className="text-xs text-black/50 dark:text-white/50">{agent.description}</div>
                    </div>
                  </button>
                ))
              : // Show scenarios
                SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => {
                      if (onScenarioChange) onScenarioChange(scenario.id)
                      updateState({ isAgentMenuOpen: false })
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm dark:text-white">{scenario.name}</div>
                      <div className="text-xs text-black/50 dark:text-white/50">{scenario.description}</div>
                    </div>
                  </button>
                ))}
          </div>
        )}
      </div>
    </div>
  )
}
