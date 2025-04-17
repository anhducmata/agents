import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

export const AgentNode = memo(({ data }: NodeProps) => {
  // Check if the node is a tool or an agent
  const isTool = data.nodeType === "tool"

  return (
    <div
      className={`px-2 py-1.5 shadow-md rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${isTool ? "min-w-[100px]" : "min-w-[120px]"}`}
    >
      {isTool ? (
        // Tool card layout - only shows name and method
        <div>
          <div className="text-xs font-medium">{data.label}</div>
          <div className="text-[10px] text-gray-500">{data.method || "GET"}</div>
        </div>
      ) : (
        // Agent card layout - shows avatar and ID
        <div className="flex items-center">
          <img src={data.avatar || "/placeholder.svg"} alt={data.label} className="w-7 h-7 rounded-full mr-1.5" />
          <div>
            <div className="text-xs font-medium">{data.label}</div>
            <div className="text-[10px] text-gray-500">ID: {data.agentId}</div>
          </div>
        </div>
      )}

      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-pink-500" />
    </div>
  )
})

AgentNode.displayName = "AgentNode"
