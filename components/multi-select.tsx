"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

export interface MultiSelectProps {
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  children: React.ReactNode
}

export function MultiSelect({
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  children,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-wrap gap-1 border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          className,
        )}
        onClick={() => setOpen(true)}
      >
        {selected.length > 0 ? (
          selected.map((item) => (
            <Badge key={item} variant="secondary" className="rounded-sm px-1 font-normal">
              {item}
              <button
                className="ml-1 rounded-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleUnselect(item)
                }}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </div>

      {open && (
        <div className="absolute z-10 w-full mt-1">
          <Command className="rounded-md border border-input bg-popover text-popover-foreground shadow-md">
            <CommandInput placeholder="Search..." value={inputValue} onValueChange={setInputValue} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                      onSelect: (value: string) => {
                        setInputValue("")
                        onChange(
                          selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value],
                        )
                      },
                      selected,
                    })
                  }
                  return child
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}

      {/* Invisible overlay to handle clicking outside */}
      {open && <div className="fixed inset-0 z-0" onClick={() => setOpen(false)} />}
    </div>
  )
}

interface MultiSelectItemProps {
  value: string
  children: React.ReactNode
  selected?: string[]
  onSelect?: (value: string) => void
}

export function MultiSelectItem({ value, children, selected = [], onSelect }: MultiSelectItemProps) {
  const isSelected = selected.includes(value)

  return (
    <CommandItem
      value={value}
      onSelect={() => onSelect?.(value)}
      className={cn("cursor-pointer", isSelected ? "bg-accent text-accent-foreground" : "")}
    >
      <div
        className={cn(
          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
          isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      {children}
    </CommandItem>
  )
}
