"use client"

import { Button } from "@/components/ui/button"

interface ToolFiltersProps {
  filter: string
  setFilter: (filter: string) => void
}

export function ToolFilters({ filter, setFilter }: ToolFiltersProps) {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("all")}
        className={filter === "all" ? "bg-black text-white" : ""}
      >
        All
      </Button>
      <Button
        variant={filter === "GET" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("GET")}
        className={filter === "GET" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
      >
        GET
      </Button>
      <Button
        variant={filter === "POST" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("POST")}
        className={filter === "POST" ? "bg-green-600 text-white hover:bg-green-700" : ""}
      >
        POST
      </Button>
      <Button
        variant={filter === "data" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("data")}
        className={filter === "data" ? "bg-black text-white" : ""}
      >
        Data
      </Button>
      <Button
        variant={filter === "action" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("action")}
        className={filter === "action" ? "bg-black text-white" : ""}
      >
        Action
      </Button>
      <Button
        variant={filter === "utility" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("utility")}
        className={filter === "utility" ? "bg-black text-white" : ""}
      >
        Utility
      </Button>
    </div>
  )
}
