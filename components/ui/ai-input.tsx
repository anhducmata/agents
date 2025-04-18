"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowRight, Bot, Mic, CornerRightUp } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"
import { useClickOutside } from "@/hooks/use-click-outside"

// Define available agents
const DEFAULT_AGENTS = [
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
]

// Define available scenarios
const DEFAULT_SCENARIOS = [
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
]

export interface OptionItem {
  id: string
  name: string
  method?: string
  description?: string
  url?: string
  avatar?: string
}

export interface AIInputProps {
  variant?: "default" | "command" | "voice" | "minimal"
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string, agent?: string) => void
  onVoiceToggle?: () => void
  selectedAgent?: string
  onAgentChange?: (agent: string) => void
  selectedScenario?: string
  onScenarioChange?: (scenario: string) => void
  placeholder?: string
  agents?: OptionItem[]
  scenarios?: OptionItem[]
  options?: string[]
  optionsData?: OptionItem[]
  isDemo?: boolean
  className?: string
  disabled?: boolean
}

export function AIInput({
  variant = "default",
  value = "",
  onChange,
  onSubmit,
  onVoiceToggle,
  selectedAgent = "Copywriter Agent",
  onAgentChange,
  selectedScenario,
  onScenarioChange,
  placeholder = "Ask me anything!",
  agents = DEFAULT_AGENTS,
  scenarios = DEFAULT_SCENARIOS,
  options = [],
  optionsData = [],
  isDemo = false,
  className,
  disabled = false,
}: AIInputProps) {
  // State for internal input value if not controlled
  const [inputValue, setInputValue] = useState(value)
  const [submitted, setSubmitted] = useState(false)
  const [time, setTime] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(isDemo)
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false)
  const [selectionType, setSelectionType] = useState<"agent" | "scenario">("agent")
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false)
  const [dropDirection, setDropDirection] = useState<"up" | "down">("down")
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  // Refs
  const inputRef = React.useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use auto-resize for textarea
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: variant === "default" ? 52 : 40,
    maxHeight: 200,
  })

  // Click outside handler
  useClickOutside(menuRef, () => {
    setIsAgentMenuOpen(false)
    setIsModelMenuOpen(false)
  })

  // Client-side effects
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Timer for voice mode
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (submitted && variant === "voice") {
      intervalId = setInterval(() => {
        setTime((t) => t + 1)
      }, 1000)
    } else if (variant === "voice") {
      setTime(0)
    }

    return () => clearInterval(intervalId)
  }, [submitted, variant])

  // Demo mode animation
  useEffect(() => {
    if (!isDemoMode || variant !== "voice") return

    let timeoutId: NodeJS.Timeout
    const runAnimation = () => {
      setSubmitted(true)
      timeoutId = setTimeout(() => {
        setSubmitted(false)
        timeoutId = setTimeout(runAnimation, 1000)
      }, 3000)
    }

    const initialTimeout = setTimeout(runAnimation, 100)
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(initialTimeout)
    }
  }, [isDemoMode, variant])

  // Update internal value when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value)
    }
  }, [value])

  // Format time for voice mode
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)
    if (variant === "default" || variant === "minimal") {
      adjustHeight()
    }
  }

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }

    // For command variant
    if (variant === "command") {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && options.length > 0) {
            // Handle unselect for last item
          }
        }
        if (e.key === "Escape") {
          input.blur()
          setOpen(false)
        }
      }
    }
  }

  // Handle submit
  const handleSubmit = () => {
    if (!inputValue.trim() && variant !== "voice") return

    if (variant === "voice") {
      if (isDemoMode) {
        setIsDemoMode(false)
        setSubmitted(false)
      } else {
        const newState = !submitted
        setSubmitted(newState)
        if (newState) {
          onVoiceToggle?.()
        } else {
          onSubmit?.("", selectedAgent)
        }
      }
    } else {
      if (selectionType === "agent") {
        onSubmit?.(inputValue, selectedAgent)
      } else {
        onScenarioChange?.(selectedScenario || "")
        onSubmit?.(inputValue, "")
      }

      // Reset input if not controlled
      if (onChange === undefined) {
        setInputValue("")
      }

      if (variant === "default" || variant === "minimal") {
        adjustHeight(true)
      }
    }
  }

  // Toggle menu
  const toggleMenu = () => {
    if (!isModelMenuOpen && variant === "command") {
      // Check if there's enough space below
      const buttonRect = buttonRef.current?.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - (buttonRect?.bottom || 0)

      // If space below is less than 200px, show dropdown above
      const direction = spaceBelow < 200 ? "up" : "down"

      setDropDirection(direction)
    }

    if (variant === "command") {
      setIsModelMenuOpen(!isModelMenuOpen)
    } else {
      setIsAgentMenuOpen(!isAgentMenuOpen)
    }
  }

  // Get display name for a value (command variant)
  const getDisplayName = (id: string) => {
    const optionMap = new Map<string, OptionItem>()
    if (optionsData.length > 0) {
      optionsData.forEach((option) => {
        optionMap.set(option.id, option)
      })
    }
    return optionMap.get(id)?.name || id
  }

  // Method badge color mapping
  const getMethodColor = (method?: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "POST":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "PUT":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  // Render different variants
  if (variant === "voice") {
    return (
      <div className={cn("w-full py-4", className)}>
        <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
          <button
            className={cn(
              "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
              submitted ? "bg-none" : "bg-none hover:bg-black/10 dark:hover:bg-white/10",
            )}
            type="button"
            onClick={handleSubmit}
            disabled={disabled}
          >
            {submitted ? (
              <div
                className="w-6 h-6 rounded-sm animate-spin bg-black dark:bg-white cursor-pointer pointer-events-auto"
                style={{ animationDuration: "3s" }}
              />
            ) : (
              <Mic className="w-6 h-6 text-black/70 dark:text-white/70" />
            )}
          </button>

          <span
            className={cn(
              "font-mono text-sm transition-opacity duration-300",
              submitted ? "text-black/70 dark:text-white/70" : "text-black/30 dark:text-white/30",
            )}
          >
            {formatTime(time)}
          </span>

          <div className="h-4 w-64 flex items-center justify-center gap-0.5">
            {[...Array(48)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-0.5 rounded-full transition-all duration-300",
                  submitted ? "bg-black/50 dark:bg-white/50 animate-pulse" : "bg-black/10 dark:bg-white/10 h-1",
                )}
                style={
                  submitted && isClient
                    ? {
                        height: `${20 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.05}s`,
                      }
                    : undefined
                }
              />
            ))}
          </div>

          <p className="h-4 text-xs text-black/70 dark:text-white/70">
            {submitted ? "Listening..." : "Click to speak"}
          </p>
        </div>
      </div>
    )
  }

  if (variant === "command") {
    return (
      <div className={cn("w-full py-4", className)} ref={containerRef}>
        <div className="rounded-xl bg-black/5 dark:bg-white/5">
          <div className="relative">
            <div className="px-2 pt-2 pb-2 flex items-center">
              <button
                ref={buttonRef}
                type="button"
                onClick={toggleMenu}
                className="flex items-center p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                disabled={disabled}
              >
                <Bot className="w-4 h-4 dark:text-white" />
              </button>

              <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 mx-2" />

              <Textarea
                placeholder={placeholder}
                className={cn(
                  "max-w-xl w-full rounded-3xl pl-2 pr-10 placeholder:text-black/70 dark:placeholder:text-white/70 border-none ring-black/30 dark:ring-white/30 text-black dark:text-white resize-none text-wrap py-2 bg-transparent",
                  "min-h-[40px]",
                )}
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={disabled}
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  className="rounded-xl bg-black/5 dark:bg-white/5 p-1"
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || disabled}
                >
                  <ArrowRight className={cn("w-4 h-4 dark:text-white", inputValue ? "opacity-100" : "opacity-30")} />
                </button>
              </div>
            </div>

            <div className="absolute -bottom-5 left-1 flex items-center gap-1.5 text-[10px] text-muted-foreground dark:text-white/50">
              <span>{selectedAgent}</span>
            </div>

            {/* Model Selection Menu - With dynamic positioning */}
            {isModelMenuOpen && (
              <div
                ref={menuRef}
                className={cn(
                  "absolute left-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-black/10 dark:border-white/10 py-1 w-72 z-50 max-h-[300px] overflow-y-auto",
                  dropDirection === "up" ? "bottom-12 mb-1" : "top-12 mt-1",
                )}
              >
                {agents.map((model) => (
                  <button
                    key={model.name}
                    type="button"
                    onClick={() => {
                      onAgentChange?.(model.name)
                      setIsModelMenuOpen(false)
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
                  >
                    <div>
                      <div className="text-sm dark:text-white">{model.name}</div>
                      <div className="text-xs text-black/50 dark:text-white/50">{model.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default and minimal variants
  return (
    <div className={cn("w-full", className)}>
      <div className="relative w-full mx-auto">
        <div className="bg-black/5 dark:bg-white/5 rounded-3xl">
          <div className="flex items-center px-4">
            {variant === "default" && (
              <>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                      selectionType === "agent"
                        ? "bg-black/10 dark:bg-white/10"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                    onClick={() => setSelectionType("agent")}
                    disabled={disabled}
                  >
                    Agent
                  </button>
                  <button
                    type="button"
                    className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                      selectionType === "scenario"
                        ? "bg-black/10 dark:bg-white/10"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                    onClick={() => setSelectionType("scenario")}
                    disabled={disabled}
                  >
                    Scenario
                  </button>

                  <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 mx-2" />

                  <button
                    type="button"
                    onClick={toggleMenu}
                    className="flex items-center p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
                    disabled={disabled}
                  >
                    {(() => {
                      if (selectionType === "agent") {
                        // Find the selected agent or use the first one as default
                        const agent = agents.find((a) => a.name === selectedAgent) || agents[0]
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
              </>
            )}

            <Textarea
              placeholder={placeholder}
              className={cn(
                "max-w-xl bg-transparent rounded-3xl pl-2",
                variant === "default" ? "pr-16" : "pr-10",
                "placeholder:text-black/50 dark:placeholder:text-white/50",
                "border-none ring-0",
                "text-black dark:text-white text-wrap",
                "overflow-y-auto resize-none",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "transition-[height] duration-100 ease-out",
                "leading-[1.2] py-[16px]",
                variant === "default" ? "min-h-[52px]" : "min-h-[40px]",
                "max-h-[200px]",
              )}
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />
          </div>
        </div>

        {variant === "default" && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1 transition-all duration-200",
              inputValue ? "right-10" : "right-3",
            )}
            onClick={onVoiceToggle}
          >
            <Mic className="w-4 h-4 text-black/70 dark:text-white/70" />
          </div>
        )}

        <button
          onClick={handleSubmit}
          type="button"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1 transition-all duration-700",
            inputValue ? "block right-3 animate-slide-in cursor-pointer" : "hidden",
          )}
          disabled={disabled}
        >
          {variant === "default" ? (
            <CornerRightUp className="w-4 h-4 text-black/70 dark:text-white/70 transition-opacity duration-700" />
          ) : (
            <ArrowRight className="w-4 h-4 text-black/70 dark:text-white/70 transition-opacity duration-700" />
          )}
        </button>

        {/* Agent/Scenario Selection Menu */}
        {isAgentMenuOpen && variant === "default" && (
          <div
            ref={menuRef}
            className="absolute bottom-full left-2 mb-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-black/10 dark:border-white/10 py-1 w-72 z-50"
          >
            {selectionType === "agent"
              ? // Show agents
                agents.map((agent) => (
                  <button
                    key={agent.name}
                    type="button"
                    onClick={() => {
                      onAgentChange?.(agent.name)
                      setIsAgentMenuOpen(false)
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
                scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => {
                      onScenarioChange?.(scenario.id)
                      setIsAgentMenuOpen(false)
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
