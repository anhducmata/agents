"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTags, type Tag } from "@/hooks/use-tags"

interface InputTagsProps {
  value: string[] | Tag[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function InputTags({ value = [], onChange, placeholder = "Add tags...", className }: InputTagsProps) {
  // Convert string[] to Tag[] if needed
  const defaultTags = React.useMemo(() => {
    if (!value) return []

    return Array.isArray(value)
      ? value.map((item) => (typeof item === "string" ? { id: item, label: item } : (item as Tag)))
      : []
  }, [value])

  const { tags, addTag, removeTag, removeLastTag } = useTags({
    defaultTags,
    onChange: (newTags) => {
      // Convert Tag[] back to string[] for compatibility with existing code
      onChange(newTags.map((tag) => tag.label))
    },
  })

  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      addTag({ id: inputValue.trim(), label: inputValue.trim() })
      setInputValue("")
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeLastTag()
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="rounded-md px-2 py-1 text-xs font-medium">
            {tag.label}
            <button
              type="button"
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(tag.id)
              }}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Remove {tag.label}</span>
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent border-0 p-0 text-sm focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        />
      </div>
    </div>
  )
}
