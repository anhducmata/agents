"use client"

import * as React from "react"
import { X, Check, ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Update the interface to support complex options with URL
interface OptionItem {
  id: string
  name: string
  method?: string
  description?: string
  url?: string
}

interface AiInputProps {
  value: string[]
  onChange: (value: string[]) => void
  options?: string[]
  optionsData?: OptionItem[]
  placeholder?: string
  emptyMessage?: string
  className?: string
  badgeClassName?: string
  commandClassName?: string
  disabled?: boolean
}

export function AiInput({
  value = [],
  onChange,
  options = [],
  optionsData = [],
  placeholder = "Select items...",
  emptyMessage = "No items found.",
  className,
  badgeClassName,
  commandClassName,
  disabled = false,
  ...props
}: AiInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  // Create a map for quick lookup of option data
  const optionsMap = React.useMemo(() => {
    const map = new Map<string, OptionItem>()
    if (optionsData.length > 0) {
      optionsData.forEach((option) => {
        map.set(option.id, option)
      })
    }
    return map
  }, [optionsData])

  // Get display name for a value
  const getDisplayName = (id: string) => {
    return optionsMap.get(id)?.name || id
  }

  const handleUnselect = React.useCallback(
    (item: string) => {
      onChange(value.filter((i) => i !== item))
    },
    [onChange, value],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && value.length > 0) {
            handleUnselect(value[value.length - 1])
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === "Escape") {
          input.blur()
          setOpen(false)
        }
      }
    },
    [value, handleUnselect],
  )

  const selectables = options.filter((option) => !value.includes(option))

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

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "h-auto min-h-9 w-full justify-between border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0",
              value.length > 0 ? "px-3 py-2" : "px-4 py-2",
            )}
            onClick={() => setOpen(!open)}
          >
            <div className="flex flex-wrap gap-1.5">
              {value.length > 0 ? (
                value.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className={cn("rounded-md px-2 py-1 text-xs font-medium", badgeClassName)}
                  >
                    {getDisplayName(item)}
                    <button
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(item)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={() => handleUnselect(item)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
          <Command className={commandClassName}>
            <CommandInput
              ref={inputRef}
              placeholder="Search tools..."
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {inputValue.length > 0 && !selectables.includes(inputValue) && !value.includes(inputValue) && (
                  <CommandItem
                    key={inputValue}
                    value={inputValue}
                    onSelect={() => {
                      onChange([...value, inputValue])
                      setInputValue("")
                    }}
                  >
                    <Check className="mr-2 h-4 w-4 shrink-0" />
                    Create "{inputValue}"
                  </CommandItem>
                )}
                {selectables
                  .filter((option) => {
                    const optionData = optionsMap.get(option)
                    const searchText = optionData
                      ? `${optionData.name} ${optionData.description || ""}`.toLowerCase()
                      : option.toLowerCase()
                    return searchText.includes(inputValue.toLowerCase())
                  })
                  .map((option) => {
                    const optionData = optionsMap.get(option)

                    return (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={() => {
                          onChange([...value, option])
                          setInputValue("")
                        }}
                        className="flex items-start py-2"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Check className="h-4 w-4 shrink-0 opacity-0 mt-0.5" />

                          {optionData ? (
                            <div className="flex flex-col w-full">
                              <div className="flex items-center gap-2">
                                {optionData.method && (
                                  <span
                                    className={cn(
                                      "text-[10px] font-medium px-1.5 py-0.5 rounded",
                                      getMethodColor(optionData.method),
                                    )}
                                  >
                                    {optionData.method}
                                  </span>
                                )}
                                <span className="font-medium">{optionData.name}</span>
                                {optionData.url && (
                                  <span className="text-xs text-muted-foreground ml-1">- {optionData.url}</span>
                                )}
                              </div>
                              {optionData.description && (
                                <span className="text-xs text-muted-foreground mt-0.5">{optionData.description}</span>
                              )}
                            </div>
                          ) : (
                            <span>{option}</span>
                          )}
                        </div>
                      </CommandItem>
                    )
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
