"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

export const AgentNode = memo(({ data }: NodeProps) => {
  // Check if the node is a tool, starter, or exit agent
  const isTool = data.nodeType === "tool"
  const isStarterAgent = data.nodeType === "starter"
  const isExitAgent = data.nodeType === "exit"

  return (
    <div
      className={`px-2 py-1.5 shadow-md rounded-md relative ${
        isStarterAgent
          ? "bg-green-50 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-700"
          : isExitAgent
            ? "bg-red-50 dark:bg-red-900/30 border-2 border-red-500 dark:border-red-700"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      } ${isTool ? "min-w-[100px]" : "min-w-[150px]"}`}
    >
      {isTool ? (
        // Tool card layout - simple view with basic info
        <div>
          <div className="text-xs font-medium">{data.label}</div>
          <div className="text-[10px] text-gray-500">{data.method || "GET"}</div>
          {data.endpoint && (
            <div className="text-[10px] text-gray-500 truncate max-w-[120px]" title={data.endpoint}>
              {data.endpoint}
            </div>
          )}
        </div>
      ) : (
        // Agent card layout - simple view with avatar and ID
        <div>
          <div className="flex items-center">
            <img src={data.avatar || "/placeholder.svg"} alt={data.label} className="w-7 h-7 rounded-full mr-1.5" />
            <div>
              <div className="text-xs font-medium">{data.label}</div>
              <div className="text-[10px] text-gray-500">
                {isStarterAgent ? "Start" : isExitAgent ? "Exit" : `ID: ${data.agentId}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input handle - shown for tools and regular agents, not for starter agent */}
      {!isStarterAgent && <Handle type="target" position={Position.Top} className="w-2 h-2 bg-teal-500" />}

      {/* Output handle - shown for regular agents and starter agent, not for tools or exit agent */}
      {!isTool && !isExitAgent && <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-pink-500" />}
    </div>
  )
})

AgentNode.displayName = "AgentNode"
