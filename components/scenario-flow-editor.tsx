"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  type Connection,
  type Edge,
  type NodeTypes,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Panel,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Scenario, ScenarioData } from "@/lib/types"
import { Save, Layout, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Define custom node types here if needed
const nodeTypes: NodeTypes = {
  // Add custom node types
}

interface ScenarioFlowEditorProps {
  scenarioId?: string
  initialData?: ScenarioData
  readOnly?: boolean
}

export default function ScenarioFlowEditor({ scenarioId, initialData, readOnly = false }: ScenarioFlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.nodes || [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || [])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const router = useRouter()

  // Fetch scenario data if scenarioId is provided
  useEffect(() => {
    if (scenarioId) {
      const fetchScenario = async () => {
        try {
          const response = await fetch(`/api/scenarios?id=${scenarioId}`)
          if (!response.ok) {
            throw new Error("Failed to fetch scenario")
          }
          const scenario: Scenario = await response.json()
          setName(scenario.name)
          setDescription(scenario.description || "")
          setNodes(scenario.scenario_data.nodes || [])
          setEdges(scenario.scenario_data.edges || [])
        } catch (err: any) {
          setError(err.message)
        }
      }

      fetchScenario()
    }
  }, [scenarioId, setNodes, setEdges])

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // Create a custom edge with an editable label
      const edge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        type: "default",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        animated: true,
        label: "Connection",
        data: {
          handoffRule: "Default handoff",
        },
      }
      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges],
  )

  // Auto layout function to arrange nodes in a grid
  const handleAutoLayout = useCallback(() => {
    if (!nodes.length) return

    const nodeWidth = 180
    const nodeHeight = 80
    const gapX = 250
    const gapY = 150
    const perRow = Math.ceil(Math.sqrt(nodes.length))

    const newNodes = [...nodes].map((node, index) => {
      const row = Math.floor(index / perRow)
      const col = index % perRow

      return {
        ...node,
        position: {
          x: col * (nodeWidth + gapX),
          y: row * (nodeHeight + gapY),
        },
      }
    })

    setNodes(newNodes)

    // Use setTimeout to ensure nodes are updated before fitting view
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2 })
      }
    }, 50)
  }, [nodes, setNodes, reactFlowInstance])

  // Save the scenario
  const handleSave = async () => {
    if (!name.trim()) {
      setError("Scenario name is required")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const scenarioData: ScenarioData = {
        nodes,
        edges,
      }

      let response
      if (scenarioId) {
        // Update existing scenario
        response = await fetch("/api/scenarios", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scenarioId,
            name,
            description,
            scenarioData,
            changeDescription: "Updated scenario",
          }),
        })
      } else {
        // Create new scenario
        response = await fetch("/api/scenarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            scenarioData,
          }),
        })
      }

      if (!response.ok) {
        throw new Error("Failed to save scenario")
      }

      const savedScenario = await response.json()
      router.push(`/scenarios/${savedScenario.scenario_id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Link href="/scenarios">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <Input
                type="text"
                placeholder="Scenario Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-bold mb-2"
                disabled={readOnly}
              />
              <Textarea
                placeholder="Scenario Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-sm"
                disabled={readOnly}
              />
            </div>
          </div>
          {!readOnly && (
            <Button onClick={handleSave} disabled={saving} className="gap-2 bg-black hover:bg-black/90 text-white">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Scenario"}
            </Button>
          )}
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      <div className="flex-grow" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={readOnly ? undefined : onNodesChange}
            onEdgesChange={readOnly ? undefined : onEdgesChange}
            onConnect={readOnly ? undefined : onConnect}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            nodesDraggable={!readOnly}
            nodesConnectable={!readOnly}
            elementsSelectable={!readOnly}
          >
            <Controls />
            <Background />
            {!readOnly && (
              <Panel position="top-right">
                <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-md">
                  <Button
                    onClick={handleAutoLayout}
                    size="sm"
                    variant="outline"
                    className="w-auto h-8 text-xs px-2 flex items-center gap-1"
                  >
                    <Layout className="h-3 w-3" />
                    <span>Auto layout</span>
                  </Button>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  )
}
