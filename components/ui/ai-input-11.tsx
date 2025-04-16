"use client"

import type React from "react"

import { ArrowRight, Bot } from "lucide-react"
import { useState, useRef, type RefObject } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"
import { useClickOutside } from "@/hooks/use-click-outside"

const AI_AGENTS = [
  { name: "Copywriter Agent", description: "Write anything you want" },
  { name: "Nextjs Agent", description: "Write code for anything you want" },
].map((model) => ({ ...model }))

interface AIInput11Props {
  onSubmit?: (value: string, model: string) => void
  className?: string
}

export default function AIInput11({ onSubmit, className }: AIInput11Props) {
  const [state, setState] = useState({
    value: "",
    fileName: "",
    selectedModel: "Copywriter Agent",
    isModelMenuOpen: false,
    dropDirection: "down" as "up" | "down",
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 40,
    maxHeight: 200,
  })
  const menuRef = useRef<HTMLDivElement>(null)

  useClickOutside(menuRef as RefObject<HTMLElement>, () => {
    updateState({ isModelMenuOpen: false })
  })

  const updateState = (updates: Partial<typeof state>) => setState((prev) => ({ ...prev, ...updates }))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (state.value.trim() && onSubmit) {
        onSubmit(state.value, state.selectedModel)
      }
      updateState({ value: "" })
      adjustHeight(true)
    }
  }

  const handleSubmit = () => {
    if (state.value.trim() && onSubmit) {
      onSubmit(state.value, state.selectedModel)
      updateState({ value: "" })
      adjustHeight(true)
    }
  }

  // Determine dropdown direction based on available space
  const toggleMenu = () => {
    if (!state.isModelMenuOpen) {
      // Check if there's enough space below
      const buttonRect = buttonRef.current?.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - (buttonRect?.bottom || 0)

      // If space below is less than 200px, show dropdown above
      const direction = spaceBelow < 200 ? "up" : "down"

      updateState({
        isModelMenuOpen: true,
        dropDirection: direction,
      })
    } else {
      updateState({ isModelMenuOpen: false })
    }
  }

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
            >
              <Bot className="w-4 h-4 dark:text-white" />
            </button>

            <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 mx-2" />

            <Textarea
              id="ai-input-11"
              placeholder="Ask me anything!"
              className={cn(
                "max-w-xl w-full rounded-3xl pl-2 pr-10 placeholder:text-black/70 dark:placeholder:text-white/70 border-none ring-black/30 dark:ring-white/30 text-black dark:text-white resize-none text-wrap py-2 bg-transparent",
                "min-h-[40px]",
              )}
              ref={textareaRef}
              value={state.value}
              onChange={(e) => {
                updateState({ value: e.target.value })
                adjustHeight()
              }}
              onKeyDown={handleKeyDown}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <button
                type="button"
                className="rounded-xl bg-black/5 dark:bg-white/5 p-1"
                onClick={handleSubmit}
                disabled={!state.value.trim()}
              >
                <ArrowRight className={cn("w-4 h-4 dark:text-white", state.value ? "opacity-100" : "opacity-30")} />
              </button>
            </div>
          </div>

          <div className="absolute -bottom-5 left-1 flex items-center gap-1.5 text-[10px] text-muted-foreground dark:text-white/50">
            <span>{state.selectedModel}</span>
          </div>

          {/* Model Selection Menu - With dynamic positioning */}
          {state.isModelMenuOpen && (
            <div
              ref={menuRef}
              className={cn(
                "absolute left-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-black/10 dark:border-white/10 py-1 w-72 z-50 max-h-[300px] overflow-y-auto",
                state.dropDirection === "up" ? "bottom-12 mb-1" : "top-12 mt-1",
              )}
            >
              {AI_AGENTS.map((model) => (
                <button
                  key={model.name}
                  type="button"
                  onClick={() => {
                    updateState({
                      selectedModel: model.name,
                      isModelMenuOpen: false,
                    })
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

