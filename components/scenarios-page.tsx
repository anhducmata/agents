"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
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
  type Node,
} from "reactflow"
import "reactflow/dist/style.css"
import { PlusCircle, Trash2, Edit, Eye, Layout, Play, X, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AgentNode } from "./scenarios/agent-node"
import { useToast } from "@/components/ui/use-toast"
import { EdgeText } from "./scenarios/edge-text"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ContextMenu } from "./scenarios/context-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Special default agents
const defaultAgents = [
  {
    id: "exit",
    name: "Exit Agent",
    avatar: "/avatars/avatar-female-02.svg",
    nodeType: "exit",
    description: "Ending point of the flow",
  },
]

// Sample data for regular agents
const sampleAgents = [
  { id: "1", name: "Customer Service Agent", avatar: "/avatars/avatar-female-13.svg" },
  { id: "2", name: "Technical Support Agent", avatar: "/avatars/avatar-male-13.svg" },
  { id: "3", name: "Sales Agent", avatar: "/avatars/avatar-female-25.svg" },
  { id: "4", name: "Booking Agent", avatar: "/avatars/avatar-male-15.svg" },
  { id: "5", name: "FAQ Agent", avatar: "/avatars/avatar-female-31.svg" },
]

// Sample data for tools from the Tools tab
const sampleTools = [
  { id: "1", name: "Get User Information", method: "GET", url: "/api/users/{id}" },
  { id: "2", name: "Create New Order", method: "POST", url: "/api/orders" },
  { id: "3", name: "Update Product", method: "PUT", url: "/api/products/{id}" },
  { id: "4", name: "Delete Customer", method: "DELETE", url: "/api/customers/{id}" },
  { id: "5", name: "List Transactions", method: "GET", url: "/api/transactions" },
]

// Helper function to get method color
const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "POST":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "PUT":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "DELETE":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  }
}

// Define custom node types
const nodeTypes: NodeTypes = {
  agentNode: AgentNode,
}

// Define custom edge types
const edgeTypes = {
  customEdge: EdgeText,
}

// Utility functions for tree-based JSON conversion
const convertToTreeJSON = (nodes: Node[], edges: Edge[]) => {
  // Find the starter agent (root)
  const rootNode = nodes.find((node) => node.data.nodeType === "starter") || nodes[0]
  if (!rootNode) return null

  // Function to recursively build the tree
  const buildTree = (nodeId: string, visited = new Set<string>()): any => {
    // Prevent infinite recursion
    if (visited.has(nodeId)) return null
    visited.add(nodeId)

    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return null

    // Find all tools connected to this agent
    const toolNodes = nodes.filter((n) => {
      return n.data.nodeType === "tool" && edges.some((e) => e.source === nodeId && e.target === n.id)
    })

    // Find all outgoing edges from this agent to other agents
    const outgoingEdges = edges.filter(
      (e) => e.source === nodeId && nodes.find((n) => n.id === e.target && n.data.nodeType !== "tool"),
    )

    // Build the tools array
    const tools = toolNodes.map((tool) => ({
      tool_id: tool.data.toolId,
      position: { x: tool.position.x, y: tool.position.y },
    }))

    // Build the handoffs array recursively
    const handoffs = outgoingEdges
      .map((edge) => {
        const targetNode = nodes.find((n) => n.id === edge.target)
        if (!targetNode) return null

        const handoffTree = buildTree(edge.target, new Set(visited))
        if (!handoffTree) return null

        return {
          handoff_description: edge.label || "Default handoff",
          agent_id: targetNode.data.agentId,
          position: { x: targetNode.position.x, y: targetNode.position.y },
          tools: handoffTree.tools || [],
          handoffs: handoffTree.handoffs || [],
        }
      })
      .filter(Boolean)

    return {
      agent_id: node.data.agentId,
      position: { x: node.position.x, y: node.position.y },
      tools,
      handoffs,
    }
  }

  // Build the tree starting from the root node
  const rootTree = buildTree(rootNode.id)
  if (!rootTree) return null

  // Create the final JSON structure
  return {
    scenario_id: `scenario_${Date.now()}`,
    name: "New Scenario",
    description: "A tree-structured flow with visual position and tools for each agent.",
    root: rootTree,
  }
}

const convertFromTreeJSON = (scenarioJSON: any) => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  let nodeIdCounter = 1
  let edgeIdCounter = 1

  // Function to recursively process the tree
  const processNode = (node: any, parentId: string | null = null, handoffDescription: string | null = null) => {
    // Create a unique ID for this node
    const nodeId = `agent-${node.agent_id}-${nodeIdCounter++}`

    // Find agent data from sample agents
    const agentData = sampleAgents.find((a) => a.id === node.agent_id) || {
      name: node.agent_id,
      avatar: "/avatars/avatar-male-01.svg",
    }

    // Add the agent node
    nodes.push({
      id: nodeId,
      type: "agentNode",
      position: { x: node.position.x, y: node.position.y },
      data: {
        label: agentData.name,
        avatar: agentData.avatar,
        agentId: node.agent_id,
        id: node.agent_id,
        nodeType: "agent",
      },
    })

    // If this node has a parent, create an edge
    if (parentId && handoffDescription) {
      edges.push({
        id: `edge-${edgeIdCounter++}`,
        source: parentId,
        target: nodeId,
        type: "customEdge",
        label: handoffDescription,
        data: {
          handoffRule: handoffDescription,
        },
      })
    }

    // Process tools
    if (node.tools && node.tools.length > 0) {
      node.tools.forEach((tool: any) => {
        const toolId = `tool-${tool.tool_id}-${nodeIdCounter++}`

        // Find tool data from sample tools
        const toolData = sampleTools.find((t) => t.id === tool.tool_id) || {
          name: `Tool ${tool.tool_id}`,
          method: "GET",
          url: "/api/unknown",
        }

        // Add the tool node
        nodes.push({
          id: toolId,
          type: "agentNode",
          position: { x: tool.position.x, y: tool.position.y },
          data: {
            label: toolData.name,
            method: toolData.method,
            url: toolData.url,
            toolId: tool.tool_id,
            nodeType: "tool",
          },
        })

        // Create an edge from agent to tool
        edges.push({
          id: `edge-${edgeIdCounter++}`,
          source: nodeId,
          target: toolId,
          type: "customEdge",
          label: "Use tool",
          data: {
            handoffRule: "Use tool",
            isToolConnection: true,
          },
        })
      })
    }

    // Process handoffs recursively
    if (node.handoffs && node.handoffs.length > 0) {
      node.handoffs.forEach((handoff: any) => {
        processNode(handoff, nodeId, handoff.handoff_description)
      })
    }
  }

  // Start processing from the root
  if (scenarioJSON.root) {
    processNode(scenarioJSON.root)
  }

  return { nodes, edges }
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
    {
      id: "default",
      name: "Default Scenario",
      description: "The default conversation flow for your agents",
      status: "active",
      nodes: initialNodes,
      edges: initialEdges,
      treeJSON: null,
    },
  ])
  const [activeScenario, setActiveScenario] = useState("default")
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [agentSearch, setAgentSearch] = useState("")
  const [toolSearch, setToolSearch] = useState("")
  const [activeItemType, setActiveItemType] = useState<"agent" | "tool">("agent")
  const [editingDescriptionId, setEditingDescriptionId] = useState<string | null>(null)

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    show: boolean
    x: number
    y: number
    type: "node" | "edge"
    id: string
    label?: string
  } | null>(null)

  // Track which agents are already in the flow
  const [availableAgents, setAvailableAgents] = useState([...defaultAgents, ...sampleAgents])

  // Update available agents whenever nodes change
  useEffect(() => {
    // Get IDs of agents already in the flow
    const usedAgentIds = nodes
      .filter((node) => !node.data.nodeType || node.data.nodeType !== "tool")
      .map((node) => node.data.agentId || node.data.id)

    // Check if starter agent is used
    const hasStarterAgent = nodes.some((node) => node.data.nodeType === "starter")

    // Check if exit agent is used
    const hasExitAgent = nodes.some((node) => node.data.nodeType === "exit")

    // Filter default agents based on usage
    const filteredDefaultAgents = defaultAgents.filter((agent) => {
      if (agent.id === "starter" && hasStarterAgent) return false
      if (agent.id === "exit" && hasExitAgent) return false
      return true
    })

    // Filter regular agents that aren't already used
    const filteredRegularAgents = sampleAgents.filter((agent) => !usedAgentIds.includes(agent.id))

    // Update available agents
    setAvailableAgents([...filteredDefaultAgents, ...filteredRegularAgents])
  }, [nodes])

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
      // Get source and target nodes
      const sourceNode = nodes.find((node) => node.id === params.source)
      const targetNode = nodes.find((node) => node.id === params.target)

      // Check if target is a tool
      const isToolTarget = targetNode?.data.nodeType === "tool"

      // Check if this connection would create a loop
      if (params.source && params.target && !isToolTarget) {
        // Function to check if there's a path from target back to source (which would create a loop)
        const wouldCreateLoop = (currentNode: string, visited = new Set<string>()): boolean => {
          // If we've reached the source node, we've found a loop
          if (currentNode === params.source) return true

          // If we've already visited this node, skip it to avoid infinite recursion
          if (visited.has(currentNode)) return false

          // Mark current node as visited
          visited.add(currentNode)

          // Check all outgoing edges from the current node
          for (const edge of edges) {
            if (edge.source === currentNode) {
              if (wouldCreateLoop(edge.target, new Set(visited))) {
                return true
              }
            }
          }

          return false
        }

        // Check if adding this edge would create a loop
        if (wouldCreateLoop(params.target)) {
          toast({
            title: "Loop detected",
            description: "Cannot create a connection that would result in a loop.",
            variant: "destructive",
          })
          return
        }
      }

      // Create a custom edge with an editable label
      const edge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        type: "customEdge",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: isToolTarget ? "#1677ff" : "#ff0071" },
        animated: true,
        label: isToolTarget ? "Use tool" : "when user wants to",
        data: {
          handoffRule: isToolTarget ? "Use tool" : "when user wants to",
          isToolConnection: isToolTarget,
        },
      }
      setEdges((eds) => addEdge(edge, eds))
    },
    [nodes, edges, setEdges, toast],
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
        const toolId = event.dataTransfer.getData("application/toolId")
        const isDefaultAgent = event.dataTransfer.getData("application/isDefaultAgent") === "true"

        // Get position from drop coordinates
        const position = (reactFlowInstance as any).project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        if (agentId) {
          // Find the agent data
          let agent
          if (isDefaultAgent) {
            agent = defaultAgents.find((a) => a.id === agentId)
          } else {
            agent = sampleAgents.find((a) => a.id === agentId)
          }

          if (!agent) return

          // Create a new agent node
          const newNode = {
            id: `${agent.nodeType || "agent"}-${agentId}-${Date.now()}`,
            type: "agentNode",
            position,
            data: {
              label: agent.name,
              avatar: agent.avatar,
              agentId: agent.id,
              id: agent.id,
              nodeType: agent.nodeType || "agent",
            },
          }

          setNodes((nds) => nds.concat(newNode))

          // Show toast for special agents
          if (agent.nodeType === "starter") {
            toast({
              title: "Starter Agent Added",
              description: "This agent can only connect to other nodes and cannot receive connections.",
            })
          } else if (agent.nodeType === "exit") {
            toast({
              title: "Exit Agent Added",
              description: "This agent can only receive connections and cannot connect to other nodes.",
            })
          }
        } else if (toolId) {
          const tool = sampleTools.find((t) => t.id === toolId)
          if (!tool) return

          // Create a new tool node
          const newNode = {
            id: `tool-${toolId}-${Date.now()}`,
            type: "agentNode",
            position,
            data: {
              label: tool.name,
              method: tool.method,
              url: tool.url,
              toolId: tool.id,
              nodeType: "tool",
            },
          }

          setNodes((nds) => nds.concat(newNode))
        }
      }
    },
    [reactFlowInstance, setNodes, toast],
  )

  // Handle node right-click to show context menu
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Prevent default context menu
      event.preventDefault()

      // Get node label
      const nodeLabel = node.data.label || "Unnamed Node"

      // Show context menu
      setContextMenu({
        show: true,
        x: event.clientX,
        y: event.clientY,
        type: "node",
        id: node.id,
        label: nodeLabel,
      })
    },
    [setContextMenu],
  )

  // Handle edge right-click to show context menu
  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      // Prevent default context menu
      event.preventDefault()

      // Get edge label
      const edgeLabel = edge.label || "Unnamed Connection"

      // Show context menu
      setContextMenu({
        show: true,
        x: event.clientX,
        y: event.clientY,
        type: "edge",
        id: edge.id,
        label: edgeLabel,
      })
    },
    [setContextMenu],
  )

  // Handle delete from context menu
  const handleContextMenuDelete = useCallback(() => {
    if (!contextMenu) return

    if (contextMenu.type === "node") {
      // Delete node
      setNodes((nds) => nds.filter((node) => node.id !== contextMenu.id))
      // Also delete connected edges
      setEdges((eds) => eds.filter((edge) => edge.source !== contextMenu.id && edge.target !== contextMenu.id))
      toast({
        title: "Item deleted",
        description: `${contextMenu.label} has been removed from the flow.`,
      })
    } else if (contextMenu.type === "edge") {
      // Delete edge
      setEdges((eds) => eds.filter((edge) => edge.id !== contextMenu.id))
      toast({
        title: "Connection deleted",
        description: "The connection has been removed from the flow.",
      })
    }

    // Close context menu
    setContextMenu(null)
  }, [contextMenu, setNodes, setEdges, toast])

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  // Save the current scenario
  const saveScenario = () => {
    // Generate the tree-based JSON
    const treeJSON = convertToTreeJSON(nodes, edges)

    if (isEditing) {
      const updatedScenarios = scenarios.map((scenario) =>
        scenario.id === activeScenario
          ? {
              ...scenario,
              name: scenarioName,
              nodes,
              edges,
              treeJSON,
            }
          : scenario,
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
        description: "New conversation flow scenario",
        status: "active",
        nodes,
        edges,
        treeJSON,
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

  const saveDescription = (scenarioId: string, newDescription: string) => {
    const updatedScenarios = scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? {
            ...scenario,
            description: newDescription,
          }
        : scenario,
    )
    setScenarios(updatedScenarios)
    setEditingDescriptionId(null)

    toast({
      title: "Description updated",
      description: "Scenario description has been updated successfully.",
    })
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

  // Export scenario as JSON
  const exportScenario = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId)
    if (!scenario) return

    // Generate tree JSON if it doesn't exist
    const treeJSON = scenario.treeJSON || convertToTreeJSON(scenario.nodes, scenario.edges)

    // Create a blob with the JSON data
    const blob = new Blob([JSON.stringify(treeJSON, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `${scenario.name.replace(/\s+/g, "_")}.json`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Scenario exported",
      description: `"${scenario.name}" has been exported as JSON.`,
    })
  }

  // Import scenario from JSON
  const importScenario = (scenarioId: string) => {
    // Create a file input element
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string)
          console.log("Imported JSON:", jsonData) // Debug log

          // Convert the tree JSON to ReactFlow format
          const { nodes: importedNodes, edges: importedEdges } = convertFromTreeJSON(jsonData)
          console.log("Converted nodes:", importedNodes) // Debug log
          console.log("Converted edges:", importedEdges) // Debug log

          if (scenarioId === "new") {
            // Create a new scenario with the imported data
            const newId = `scenario-${Date.now()}`
            const newScenario = {
              id: newId,
              name: jsonData.name || "Imported Scenario",
              nodes: importedNodes,
              edges: importedEdges,
              treeJSON: jsonData,
            }
            setScenarios([...scenarios, newScenario])

            // Open the modal to show the imported scenario
            setActiveScenario(newId)
            setScenarioName(jsonData.name || "Imported Scenario")
            setNodes(importedNodes)
            setEdges(importedEdges)
            setIsEditing(true)
            setIsViewOnly(false)
            setIsModalOpen(true)

            toast({
              title: "Scenario imported",
              description: `"${jsonData.name || "Imported Scenario"}" has been created.`,
            })
          } else {
            // Update an existing scenario
            const updatedScenarios = scenarios.map((scenario) =>
              scenario.id === scenarioId
                ? {
                    ...scenario,
                    name: jsonData.name || scenario.name,
                    nodes: importedNodes,
                    edges: importedEdges,
                    treeJSON: jsonData,
                  }
                : scenario,
            )

            setScenarios(updatedScenarios)

            // If we're currently viewing this scenario, update the display
            if (activeScenario === scenarioId) {
              setNodes(importedNodes)
              setEdges(importedEdges)
              setScenarioName(jsonData.name || scenarios.find((s) => s.id === scenarioId)?.name || "Imported Scenario")
            }

            toast({
              title: "Scenario imported",
              description: `"${jsonData.name || "Scenario"}" has been imported successfully.`,
            })
          }
        } catch (error) {
          console.error("Import error:", error) // Debug log
          toast({
            title: "Import failed",
            description: "The selected file is not a valid scenario JSON.",
            variant: "destructive",
          })
        }
      }

      reader.readAsText(file)
    }

    // Trigger the file input
    input.click()
  }

  // Filter agents based on search
  const filteredDefaultAgents = availableAgents
    .filter((agent) => agent.id === "starter" || agent.id === "exit")
    .filter((agent) => agent.name.toLowerCase().includes(agentSearch.toLowerCase()))

  const filteredRegularAgents = availableAgents
    .filter((agent) => agent.id !== "starter" && agent.id !== "exit")
    .filter((agent) => agent.name.toLowerCase().includes(agentSearch.toLowerCase()))

  // Filter tools based on search
  const filteredTools = sampleTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.method.toLowerCase().includes(toolSearch.toLowerCase()),
  )

  // Toggle scenario status
  const toggleScenarioStatus = (scenarioId: string) => {
    const updatedScenarios = scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? {
            ...scenario,
            status: scenario.status === "active" ? "disabled" : "active",
          }
        : scenario,
    )
    setScenarios(updatedScenarios)

    toast({
      title: "Status updated",
      description: `Scenario has been ${updatedScenarios.find((s) => s.id === scenarioId)?.status === "active" ? "activated" : "disabled"}.`,
    })
  }

  return (
    <div className="h-full flex flex-col p-3">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agent Scenarios</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create and manage your agent flow scenarios</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-2 bg-black hover:bg-black/90 text-white">
              <PlusCircle className="h-4 w-4" />
              New Scenario
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={createNewScenario}>
              <Edit className="h-4 w-4 mr-2" />
              Design
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => importScenario("new")}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className="group relative overflow-hidden transition-all duration-300 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 hover:shadow-md"
          >
            {/* Add the background pattern div */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

            {/* Add a border glow effect on hover */}
            <div className="absolute inset-0 -z-10 rounded-xl p-px bg-linear-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>{scenario.name}</CardTitle>
                    <div
                      className={`w-2 h-2 rounded-full ${scenario.status === "active" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                    />
                  </div>
                </div>
                <CardDescription className="mt-1 relative group">
                  {editingDescriptionId === scenario.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="w-full text-sm p-1 border rounded focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                        defaultValue={scenario.description || ""}
                        autoFocus
                        onBlur={(e) => saveDescription(scenario.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveDescription(scenario.id, e.currentTarget.value)
                          } else if (e.key === "Escape") {
                            setEditingDescriptionId(null)
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer group-hover:underline group-hover:underline-offset-2 group-hover:decoration-dotted"
                      onClick={() => setEditingDescriptionId(scenario.id)}
                      title="Click to edit description"
                    >
                      {scenario.description || "No description provided"}
                      {scenario.treeJSON && <span className="ml-2 text-green-500 text-xs">• Tree JSON available</span>}
                    </div>
                  )}
                </CardDescription>
              </CardHeader>

              <div className="p-3 pt-0">
                <div className="mt-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {scenario.status === "active" ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Agents:</span>
                        <span className="font-medium">
                          {scenario.nodes.filter((n) => !n.data?.nodeType || n.data?.nodeType === "agent").length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Tools:</span>
                        <span className="font-medium">
                          {scenario.nodes.filter((n) => n.data?.nodeType === "tool").length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">RAG Sources:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 5)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Total Tokens:</span>
                        <span className="font-medium">{(Math.floor(Math.random() * 500) + 100) * 1000}K</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Conversations:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 1000) + 100}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Customers:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 500) + 50}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Talk Time:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 1000) + 100} mins</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Est. Cost:</span>
                        <span className="font-medium">${(Math.random() * 100 + 10).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 border-t border-gray-200 dark:border-gray-800">
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
                  className="flex items-center justify-center gap-2 rounded-none h-12 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 border-l border-gray-200 dark:border-gray-800"
                  onClick={() => editScenario(scenario.id)}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center justify-center gap-2 rounded-none h-12 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 border-l border-gray-200 dark:border-gray-800"
                  onClick={() => exportScenario(scenario.id)}
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center justify-center gap-2 rounded-none h-12 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 border-l border-gray-200 dark:border-gray-800"
                  onClick={() => importScenario(scenario.id)}
                >
                  <Upload className="h-4 w-4" />
                  <span>Import</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center justify-center gap-2 rounded-none h-12 text-red-500 hover:bg-gray-50 dark:hover:bg-gray-900 border-l border-gray-200 dark:border-gray-800"
                  onClick={() => deleteScenario(scenario.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for creating/editing scenarios */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col">
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
                <div className="w-48">
                  <Card className="h-full flex flex-col">
                    <CardContent className="p-2 flex flex-col h-full">
                      {/* Type Selection */}
                      <div className="flex mb-2 border rounded-md overflow-hidden">
                        <button
                          className={`flex-1 text-xs py-1.5 transition-colors ${
                            activeItemType === "agent"
                              ? "bg-black text-white dark:bg-gray-800"
                              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                          }`}
                          onClick={() => setActiveItemType("agent")}
                        >
                          Agents
                        </button>
                        <button
                          className={`flex-1 text-xs py-1.5 transition-colors ${
                            activeItemType === "tool"
                              ? "bg-black text-white dark:bg-gray-800"
                              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                          }`}
                          onClick={() => setActiveItemType("tool")}
                        >
                          Tools
                        </button>
                      </div>

                      {/* Agents Section */}
                      {activeItemType === "agent" && (
                        <div className="flex flex-col flex-1">
                          <div className="mb-1">
                            <Input
                              placeholder="Search agents..."
                              className="h-6 text-[10px]"
                              value={agentSearch}
                              onChange={(e) => setAgentSearch(e.target.value)}
                            />
                          </div>

                          {/* Default Agents */}
                          {filteredDefaultAgents.length > 0 && (
                            <div className="mb-2">
                              <div className="text-[9px] uppercase text-gray-500 font-semibold mb-1">
                                Default Agents
                              </div>
                              <div className="space-y-1">
                                {filteredDefaultAgents.map((agent) => (
                                  <div
                                    key={agent.id}
                                    draggable
                                    onDragStart={(event) => {
                                      event.dataTransfer.setData("application/agentId", agent.id)
                                      event.dataTransfer.setData("application/isDefaultAgent", "true")
                                    }}
                                    className={`flex items-center p-1 border rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                      agent.id === "starter"
                                        ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                                        : "border-red-300 bg-red-50 dark:bg-red-900/20"
                                    }`}
                                  >
                                    <div className="w-5 h-5 rounded-full mr-1.5 flex items-center justify-center">
                                      {agent.id === "starter" ? (
                                        <Play className="w-3 h-3 text-green-600 dark:text-green-400" />
                                      ) : (
                                        <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-medium">{agent.name}</span>
                                      <span className="text-[8px] text-gray-500">{agent.description}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Regular Agents */}
                          {filteredRegularAgents.length > 0 ? (
                            <div className="space-y-1 overflow-y-auto flex-1">
                              <div className="text-[9px] uppercase text-gray-500 font-semibold mb-1">Your Agents</div>
                              {filteredRegularAgents.map((agent) => (
                                <div
                                  key={agent.id}
                                  draggable
                                  onDragStart={(event) => {
                                    event.dataTransfer.setData("application/agentId", agent.id)
                                    event.dataTransfer.setData("application/isDefaultAgent", "false")
                                  }}
                                  className="flex items-center p-1 border rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                  <img
                                    src={agent.avatar || "/placeholder.svg"}
                                    alt={agent.name}
                                    className="w-5 h-5 mr-1.5 rounded-full"
                                  />
                                  <span className="text-[10px]">{agent.name}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[10px] text-gray-500 italic mt-2">
                              {agentSearch ? "No matching agents found" : "All agents are in use"}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tools Section */}
                      {activeItemType === "tool" && (
                        <div className="flex flex-col flex-1">
                          <div className="mb-1">
                            <Input
                              placeholder="Search tools..."
                              className="h-6 text-[10px]"
                              value={toolSearch}
                              onChange={(e) => setToolSearch(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1 overflow-y-auto flex-1">
                            {filteredTools.map((tool) => (
                              <div
                                key={tool.id}
                                draggable
                                onDragStart={(event) => {
                                  event.dataTransfer.setData("application/toolId", tool.id)
                                  event.dataTransfer.setData("application/toolType", "tool")
                                }}
                                className="flex flex-col p-1.5 border rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-[10px] font-medium">{tool.name}</span>
                                  <span
                                    className={`text-[8px] px-1.5 py-0.5 rounded-sm ${getMethodColor(tool.method)}`}
                                  >
                                    {tool.method}
                                  </span>
                                </div>
                                <span className="text-[8px] text-gray-500 mt-0.5 truncate">{tool.url}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-[8px] text-gray-500">Tools are imported from the Tools tab</p>
                          </div>
                        </div>
                      )}
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
                    onNodeContextMenu={isViewOnly ? undefined : onNodeContextMenu}
                    onEdgeContextMenu={isViewOnly ? undefined : onEdgeContextMenu}
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

          {/* Context Menu */}
          {contextMenu && contextMenu.show && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onDelete={handleContextMenuDelete}
              onClose={closeContextMenu}
              itemType={contextMenu.type}
              itemLabel={contextMenu.label}
            />
          )}

          <DialogFooter className="">
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
