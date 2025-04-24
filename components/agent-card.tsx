"use client"

import { Bot, Edit, Copy, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { Agent } from "@/lib/api-service"

interface AgentCardProps {
  agent: Agent
  expanded: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export default function AgentCard({ agent, expanded, onToggleExpand, onEdit, onDuplicate, onDelete }: AgentCardProps) {
  // Format the updated date if available
  const formattedDate = agent.updated ? formatDistanceToNow(new Date(agent.updated), { addSuffix: true }) : "Recently"

  // Get language from rawSettings if available
  const language = agent.rawSettings?.language || "English"

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn("w-14 h-14 rounded-full flex items-center justify-center", "bg-gray-100 dark:bg-gray-800")}
            >
              {agent.avatarUrl && agent.avatarUrl.startsWith("/") ? (
                <Bot className="w-7 h-7 text-blue-500" />
              ) : (
                <img
                  src={agent.avatarUrl || "/avatars/avatar-male-01.svg"}
                  alt={agent.agentName}
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{agent.agentName}</h3>
              <p className="text-gray-500 dark:text-gray-400">Updated {formattedDate}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggleExpand}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{agent.instruction}</p>

        {expanded && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Instruction:</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">{agent.instruction}</p>
            </div>

            {agent.rawSettings && Object.keys(agent.rawSettings).length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Language:</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{language}</p>
              </div>
            )}
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
