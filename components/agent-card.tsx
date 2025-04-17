"use client"

import { Bot, Sparkles, Edit, Copy, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface AgentCardProps {
  agent: any
  expanded: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export default function AgentCard({ agent, expanded, onToggleExpand, onEdit, onDuplicate, onDelete }: AgentCardProps) {
  // Map personality to icon color
  const getIconColor = (personality: string) => {
    switch (personality) {
      case "Friendly":
        return "text-blue-500"
      case "Formal":
        return "text-emerald-500"
      case "Funny":
        return "text-amber-500"
      default:
        return "text-purple-500"
    }
  }

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn("w-14 h-14 rounded-full flex items-center justify-center", "bg-gray-100 dark:bg-gray-800")}
            >
              <Bot className={cn("w-7 h-7", getIconColor(agent.personality))} />
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{agent.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{agent.language}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggleExpand}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{agent.role}</p>

        {expanded && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="text-gray-500 dark:text-gray-400 flex items-center gap-2"
                  style={{ fontSize: "0.6rem" }}
                >
                  <Sparkles className="h-4 w-4" /> Personality
                </label>
                <Select defaultValue={agent.personality} disabled>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={agent.personality}>{agent.personality}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  className="text-gray-500 dark:text-gray-400 flex items-center gap-2"
                  style={{ fontSize: "0.6rem" }}
                >
                  <Sparkles className="h-4 w-4" /> Voice
                </label>
                <Select defaultValue={agent.voice} disabled>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={agent.voice}>{agent.voice}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {agent.tools.map((tool: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                  style={{ fontSize: "0.6rem" }}
                >
                  {tool}
                </span>
              ))}
              {agent.tools.length === 0 && (
                <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.6rem" }}>
                  No tools attached
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 border-t border-gray-200 dark:border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center justify-center gap-2 rounded-none h-12 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center justify-center gap-2 rounded-none h-12 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 border-l border-r border-gray-200 dark:border-gray-800"
          onClick={onDuplicate}
        >
          <Copy className="h-4 w-4" />
          <span>Duplicate</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center justify-center gap-2 rounded-none h-12 text-red-500 hover:bg-gray-50 dark:hover:bg-gray-900"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  )
}
