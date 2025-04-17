"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  MarkerType,
  type Connection,
  type Edge,
  type NodeTypes,
} from "reactflow"
import "reactflow/dist/style.css"
import { PlusCircle, Trash2, Edit, Eye, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AgentNode } from "./scenarios/agent-node"
import { useToast } from "@/components/ui/use-toast"
import { EdgeText } from "./scenarios/edge-text"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"

// Sample data for agents
const sampleAgents = [
  { id: "1", name: "Customer Service Agent", avatar: "/avatars/avatar-female-02.svg" },
  { id: "2", name: "Technical Support Agent", avatar: "/avatars/avatar-male-01.svg" },
  { id: "3", name: "Sales Agent", avatar: "/avatars/avatar-female-13.svg" },
  { id: "4", name: "Booking Agent", avatar: "/avatars/avatar-male-13.svg" },
  { id: "5", name: "FAQ Agent", avatar: "/avatars/avatar-female-25.svg" },
]

// Define custom node types
const nodeTypes: NodeTypes = {
  agentNode: AgentNode,
}

// Define custom edge types
const edgeTypes = {
  customEdge: EdgeText,
}

// Initial nodes and edges for a new scenario
const initialNodes = []
const initialEdges = []

export default function ScenariosPage() {
  const { toast } = useToast()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [scenarioName, setScenarioName] = useState("New Scenario")
  const [scenarios, setScenarios] = useState([
    { id: "default", name: "Default Scenario", nodes: initialNodes, edges: initialEdges },
  ])
  const [activeScenario, setActiveScenario] = useState("default")
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewOnly, setIsViewOnly] = useState(false)

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
        ;(reactFlowInstance as any).fitView({ padding: 0.2 })
      }
    }, 50)

    toast({
      title: "Auto layout applied",
      description: "Nodes have been automatically arranged for better visibility.",
    })
  }, [nodes, setNodes, reactFlowInstance, toast])

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // Create a custom edge with an editable label
      const edge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        type: "customEdge",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#ff0071" },
        animated: true,
        label: "when user wants to",
        data: { handoffRule: "when user wants to" },
      }
      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges],
  )

  // Handle drag over for dropping agents onto the canvas
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // Handle dropping agents onto the canvas
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (reactFlowWrapper.current && reactFlowInstance) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const agentId = event.dataTransfer.getData("application/agentId")
        const agent = sampleAgents.find((a) => a.id === agentId)

        if (!agent) return

        // Get position from drop coordinates
        const position = (reactFlowInstance as any).project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        // Create a new node
        const newNode = {
          id: `agent-${agentId}-${Date.now()}`,
          type: "agentNode",
          position,
          data: {
            label: agent.name,
            avatar: agent.avatar,
            agentId: agent.id,
          },
        }

        setNodes((nds) => nds.concat(newNode))
      }
    },
    [reactFlowInstance, setNodes],
  )

  // Save the current scenario
  const saveScenario = () => {
    if (isEditing) {
      const updatedScenarios = scenarios.map((scenario) =>
        scenario.id === activeScenario ? { ...scenario, name: scenarioName, nodes, edges } : scenario,
      )
      setScenarios(updatedScenarios)
      toast({
        title: "Scenario updated",
        description: `"${scenarioName}" has been updated successfully.`,
      })
    } else {
      const newId = `scenario-${Date.now()}`
      const newScenario = {
        id: newId,
        name: scenarioName,
        nodes,
        edges,
      }
      setScenarios([...scenarios, newScenario])
      setActiveScenario(newId)
      toast({
        title: "Scenario created",
        description: `"${scenarioName}" has been created successfully.`,
      })
    }
    setIsModalOpen(false)
  }

  // Create a new scenario
  const createNewScenario = () => {
    setIsEditing(false)
    setIsViewOnly(false)
    setScenarioName("New Scenario")
    setNodes([])
    setEdges([])
    setIsModalOpen(true)
  }

  // Edit an existing scenario
  const editScenario = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId)
    if (scenario) {
      setActiveScenario(scenarioId)
      setScenarioName(scenario.name)
      setNodes(scenario.nodes)
      setEdges(scenario.edges)
      setIsEditing(true)
      setIsViewOnly(false)
      setIsModalOpen(true)
    }
  }

  // View a scenario
  const viewScenario = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId)
    if (scenario) {
      setActiveScenario(scenarioId)
      setScenarioName(scenario.name)
      setNodes(scenario.nodes)
      setEdges(scenario.edges)
      setIsViewOnly(true)
      setIsModalOpen(true)
    }
  }

  // Delete a scenario
  const deleteScenario = (scenarioId: string) => {
    if (scenarios.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one scenario.",
        variant: "destructive",
      })
      return
    }

    const updatedScenarios = scenarios.filter((s) => s.id !== scenarioId)
    setScenarios(updatedScenarios)

    toast({
      title: "Scenario deleted",
      description: "The scenario has been deleted successfully.",
    })
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agent Scenarios</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create and manage your agent flow scenarios</p>
        </div>
        <Button onClick={createNewScenario} size="sm" className="gap-2 bg-black hover:bg-black/90 text-white">
          <PlusCircle className="h-4 w-4" />
          New Scenario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle>{scenario.name}</CardTitle>
              <CardDescription>
                {scenario.nodes.length} agents, {scenario.edges.length} connections
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-3 border-t border-gray-200 dark:border-gray-800">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center justify-center gap-2 rounded-none h-12 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                  onClick={() => viewScenario(scenario.id)}
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center justify-center gap-2 rounded-none h-12 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 border-l border-r border-gray-200 dark:border-gray-800"
                  onClick={() => editScenario(scenario.id)}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center justify-center gap-2 rounded-none h-12 text-red-500 hover:bg-gray-50 dark:hover:bg-gray-900"
                  onClick={() => deleteScenario(scenario.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal for creating/editing scenarios */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] flex flex-col">
          <div className="flex-1 flex flex-col overflow-hidden">
            {!isViewOnly && (
              <div className="relative group mb-1">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="text-md font-semibold outline-none border-b-2 border-transparent focus:border-gray-300 transition-colors py-1 px-0.5 w-fit max-w-full overflow-hidden text-ellipsis"
                  onBlur={(e) => setScenarioName(e.currentTarget.textContent || "Untitled Scenario")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      e.currentTarget.blur()
                    }
                  }}
                >
                  {scenarioName}
                </div>
              </div>
            )}

            <div className="flex flex-1 gap-3">
              {!isViewOnly && (
                <div className="w-56">
                  <Card className="h-full">
                    <CardContent className="p-3">
                      <h3 className="font-medium mb-2 text-sm">Available Agents</h3>
                      <p className="text-xs text-gray-500 mb-3">Drag agents to the canvas to create a flow</p>
                      <div className="space-y-1.5">
                        {sampleAgents.map((agent) => (
                          <div
                            key={agent.id}
                            draggable
                            onDragStart={(event) => {
                              event.dataTransfer.setData("application/agentId", agent.id)
                            }}
                            className="flex items-center p-1.5 border rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <img
                              src={agent.avatar || "/placeholder.svg"}
                              alt={agent.name}
                              className="w-6 h-6 mr-2 rounded-full"
                            />
                            <span className="text-xs">{agent.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex-1 border rounded-md overflow-hidden" ref={reactFlowWrapper}>
                <ReactFlowProvider>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={isViewOnly ? undefined : onNodesChange}
                    onEdgesChange={isViewOnly ? undefined : onEdgesChange}
                    onConnect={isViewOnly ? undefined : onConnect}
                    onInit={setReactFlowInstance as any}
                    onDrop={isViewOnly ? undefined : onDrop}
                    onDragOver={isViewOnly ? undefined : onDragOver}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    proOptions={{ hideAttribution: true }}
                    nodesDraggable={!isViewOnly}
                    nodesConnectable={!isViewOnly}
                    elementsSelectable={!isViewOnly}
                  >
                    <Controls showFitView={false} />
                    <Background />
                    {!isViewOnly && (
                      <Panel position="top-right">
                        <div className="bg-white dark:bg-gray-800 p-1.5 rounded shadow-md space-y-2">
                          <p className="text-[10px] text-gray-500">
                            Drag agents from the sidebar and connect them to create flows
                          </p>
                          <Button
                            onClick={handleAutoLayout}
                            size="sm"
                            variant="outline"
                            className="w-auto h-6 text-xs px-2 flex items-center gap-1"
                          >
                            <Layout className="h-3 w-3" />
                            <span className="text-[10px]">Auto layout</span>
                          </Button>
                        </div>
                      </Panel>
                    )}
                  </ReactFlow>
                </ReactFlowProvider>
              </div>
            </div>
          </div>

          <DialogFooter className="py-1.5 px-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} size="sm" className="h-7 text-xs px-2.5">
              {isViewOnly ? "Close" : "Cancel"}
            </Button>
            {!isViewOnly && (
              <Button onClick={saveScenario} size="sm" className="h-7 text-xs px-2.5">
                {isEditing ? "Update" : "Create"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
