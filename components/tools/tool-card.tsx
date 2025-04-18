"use client"

import type React from "react"
import { MoreHorizontal, Edit, Copy, Trash2, Globe } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Tool } from "./types"
import { getCategoryIcon, getMethodColor, formatTimeAgo } from "@/lib/tool-utils"

interface ToolCardProps {
  tool: Tool
  onEdit: (tool: Tool) => void
  onDuplicate: (tool: Tool) => void
  onDelete: (toolId: string) => void
  onAgentClick: (agentName: string, e: React.MouseEvent) => void
}

export function ToolCard({ tool, onEdit, onDuplicate, onDelete, onAgentClick }: ToolCardProps) {
  // Dynamically import the icon based on the category
  const IconComponent = (props: any) => {
    const { Database, Zap, Wrench, Globe, Code } = require("lucide-react")
    const iconName = getCategoryIcon(tool.category)

    switch (iconName) {
      case "Database":
        return <Database {...props} />
      case "Zap":
        return <Zap {...props} />
      case "Wrench":
        return <Wrench {...props} />
      case "Globe":
        return <Globe {...props} />
      default:
        return <Code {...props} />
    }
  }

  return (
    <Card
      className="relative overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onEdit(tool)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
      <div className="relative z-10">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-medium px-2 py-1 rounded-full", getMethodColor(tool.method))}>
                {tool.method}
              </span>
              <Badge variant="outline" className="flex items-center gap-1">
                <IconComponent className="h-4 w-4" />
                <span className="capitalize">{tool.category}</span>
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(tool)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(tool)}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(tool.id)} className="text-red-500 focus:text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle className="text-xl mt-2">{tool.name}</CardTitle>
          <CardDescription>{tool.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-3">
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">URL</div>
              <div className="flex items-start gap-1.5 text-xs">
                <Globe className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground mt-0.5" />
                <span className="break-all">{tool.url}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Agents</div>
              <div className="flex flex-wrap gap-1.5">
                {tool.agents?.length ? (
                  tool.agents.map((agent, index) => (
                    <button
                      key={index}
                      onClick={(e) => onAgentClick(agent, e)}
                      className="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      {agent}
                    </button>
                  ))
                ) : (
                  <span className="text-xs">None</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-3 flex justify-between text-xs text-muted-foreground">
          <div>Used {tool.usageCount} times</div>
          <div>Updated {formatTimeAgo(tool.updatedAt)}</div>
        </CardFooter>
      </div>
    </Card>
  )
}
