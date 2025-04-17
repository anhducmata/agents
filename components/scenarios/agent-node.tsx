"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { ChevronDown } from "lucide-react"

export const AgentNode = memo(({ data }: NodeProps) => {
  // Check if the node is a tool, starter, or exit agent
  const isTool = data.nodeType === "tool"
  const isStarterAgent = data.nodeType === "starter"
  const isExitAgent = data.nodeType === "exit"

  // State to track if the node is expanded
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={`px-2 py-1.5 shadow-md rounded-md relative ${
        isStarterAgent
          ? "bg-green-50 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-700"
          : isExitAgent
            ? "bg-red-50 dark:bg-red-900/30 border-2 border-red-500 dark:border-red-700"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      } ${isTool ? "min-w-[100px]" : "min-w-[150px]"} ${isExpanded && !isTool ? "pb-6" : ""}`}
    >
      {isTool ? (
        // Tool card layout - only shows name and method
        <div>
          <div className="text-xs font-medium">{data.label}</div>
          <div className="text-[10px] text-gray-500">{data.method || "GET"}</div>
        </div>
      ) : (
        // Agent card layout - shows avatar and ID
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

          {/* Expanded details section */}
          {isExpanded && !isStarterAgent && !isExitAgent && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-[10px]">
              {data.instruction && (
                <div className="mb-1">
                  <div className="text-gray-500 font-medium">Instruction:</div>
                  <div className="text-gray-700 dark:text-gray-300 line-clamp-2">{data.instruction}</div>
                </div>
              )}
              {data.tone && (
                <div className="mb-1">
                  <div className="text-gray-500 font-medium">Tone:</div>
                  <div className="text-gray-700 dark:text-gray-300">{data.tone}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-1 mt-1">
                {data.voice && (
                  <>
                    <div className="text-gray-500">Voice:</div>
                    <div className="text-gray-700 dark:text-gray-300">{data.voice}</div>
                  </>
                )}
                {data.tone && (
                  <>
                    <div className="text-gray-500">Tone:</div>
                    <div className="text-gray-700 dark:text-gray-300">{data.tone}</div>
                  </>
                )}
                {data.language && (
                  <>
                    <div className="text-gray-500">Language:</div>
                    <div className="text-gray-700 dark:text-gray-300">{data.language}</div>
                  </>
                )}
              </div>
              {data.tags && data.tags.length > 0 && (
                <div className="mt-1">
                  <div className="text-gray-500">Tags:</div>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {data.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-[8px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Expand/collapse button at the bottom */}
          {!isStarterAgent && !isExitAgent && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>
          )}
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
