"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Connection,
  type Edge,
  type NodeTypes,
  type Node,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"
import {
  PlusCircle,
  Trash2,
  Edit,
  Eye,
  Download,
  Upload,
  MoreVertical,
  Search,
  X,
  Layout,
  Play,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card"
import { AgentNode } from "./scenarios/agent-node"
import { useToast } from "@/components/ui/use-toast"
import { EdgeText } from "./scenarios/edge-text"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Redis } from "@upstash/redis"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ReactFlowProvider, Controls, Background, Panel } from "reactflow"
import { ContextMenu } from "./scenarios/context-menu"

// First, add imports for the API services at the top of the file
import { getAgents, type Agent } from "@/lib/api-service"
import { getTools, type Tool } from "@/lib/tools-api-service"

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
// const sampleAgents = [
//   { id: "1", name: "Customer Service Agent", avatar: "/avatars/avatar-female-13.svg" },
//   { id: "2", name: "Technical Support Agent", avatar: "/avatars/avatar-male-13.svg" },
//   { id: "3", name: "Sales Agent", avatar: "/avatars/avatar-female-25.svg" },
//   { id: "4", name: "Booking Agent", avatar: "/avatars/avatar-male-15.svg" },
//   { id: "5", name: "FAQ Agent", avatar: "/avatars/avatar-female-31.svg" },
// ]

// Sample data for tools from the Tools tab
// const sampleTools = [
//   { id: "1", name: "Get User Information", method: "GET", url: "/api/users/{id}" },
//   { id: "2", name: "Create New Order", method: "POST", url: "/api/orders" },
//   { id: "3", name: "Update Product", method: "PUT", url: "/api/products/{id}" },
//   { id: "4", name: "Delete Customer", method: "DELETE", url: "/api/customers/{id}" },
//   { id: "5", name: "List Transactions", method: "GET", url: "/api/transactions" },
// ]

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

// Generate a unique ID for scenarios
const generateScenarioId = () => {
  return `scenario-${Math.random().toString(36).substring(2, 9)}`
}

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Update the convertToTreeJSON function to match the desired structure
const convertToTreeJSON = (nodes: Node[], edges: Edge[], scenarioId: string, scenarioName: string) => {
  // Find the starter agent (root)
  const rootNode = nodes.find((node) => node.data.nodeType === "starter") || nodes[0]
  if (!rootNode) return null

  // Create an array to hold all agents
  const agents = []

  // Function to recursively build the agent structure
  const buildAgentStructure = (nodeId: string, visited = new Set<string>()): any => {
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
      type: "function",
      name: tool.data.label,
      description: `${tool.data.method} ${tool.data.url}`,
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
      position: { x: tool.position.x, y: tool.position.y },
    }))

    // Build the toolLogic object
    const toolLogic = {}
    toolNodes.forEach((tool) => {
      toolLogic[tool.data.label] = {
        type: "function",
        endpoint: tool.data.url,
        method: tool.data.method,
        requestConfig: {
          headers: {
            "Content-Type": "application/json",
          },
          authentication: {
            type: "none",
          },
          baseUrl: "https://api.example.com",
          timeout: 3000,
        },
      }
    })

    // Build the downstreamAgents array
    const downstreamAgents = outgoingEdges
      .map((edge) => {
        const targetNode = nodes.find((n) => n.id === edge.target)
        if (!targetNode) return null
        return targetNode.data.label.replace(/\s+/g, "") + "Agent"
      })
      .filter(Boolean)

    // Create the agent object
    const agent = {
      name: node.data.label.replace(/\s+/g, "") + "Agent",
      publicDescription: `This is the ${node.data.label} agent.`,
      instructions: `You are a ${node.data.label.toLowerCase()} assistant.`,
      tools,
      toolLogic,
      downstreamAgents,
      position: { x: node.position.x, y: node.position.y },
      nodeId: node.id,
      agentId: node.data.agentId || node.data.id,
    }

    // Add this agent to the agents array
    agents.push(agent)

    // Process downstream agents recursively
    outgoingEdges.forEach((edge) => {
      buildAgentStructure(edge.target, new Set(visited))
    })

    return agent
  }

  // Build the structure starting from the root node
  const rootAgent = buildAgentStructure(rootNode.id)
  if (!rootAgent) return null

  // Create the final JSON structure
  return {
    scenario_id: scenarioId,
    name: scenarioName,
    description: "A scenario with agents, tools, and connections.",
    agents,
    rootAgent: rootAgent.name,
  }
}

// Update the convertFromTreeJSON function to handle the new structure
const convertFromTreeJSON = (scenarioJSON: any) => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  let nodeIdCounter = 1
  let edgeIdCounter = 1

  // Map to keep track of agent names to node IDs
  const agentNameToNodeId = new Map()

  // Process all agents first to create nodes
  scenarioJSON.agents.forEach((agent: any) => {
    // Create a unique ID for this node
    const nodeId = `agent-${nodeIdCounter++}`

    // Store the mapping from agent name to node ID
    agentNameToNodeId.set(agent.name, nodeId)

    // Find agent data from sample agents or use defaults
    const agentData = {
      name: agent.name.replace(/Agent$/, ""),
      avatar: "/avatars/avatar-male-01.svg",
    }

    // Add the agent node
    nodes.push({
      id: nodeId,
      type: "agentNode",
      position: agent.position || { x: Math.random() * 500, y: Math.random() * 300 },
      data: {
        label: agentData.name,
        avatar: agentData.avatar,
        agentId: agent.agentId || agent.name,
        id: agent.agentId || agent.name,
        nodeType: agent.name === scenarioJSON.rootAgent ? "starter" : "agent",
      },
    })

    // Process tools for this agent
    if (agent.tools && agent.tools.length > 0) {
      agent.tools.forEach((tool: any) => {
        const toolId = `tool-${nodeIdCounter++}`

        // Get method and URL from toolLogic if available
        const toolLogic = agent.toolLogic && agent.toolLogic[tool.name]
        const method = toolLogic ? toolLogic.method : "GET"
        const url = toolLogic ? toolLogic.endpoint : "/api/unknown"

        // Add the tool node
        nodes.push({
          id: toolId,
          type: "agentNode",
          position: tool.position || {
            x: (agent.position?.x || 0) + 200,
            y: (agent.position?.y || 0) + nodes.length * 50,
          },
          data: {
            label: tool.name,
            method: method,
            url: url,
            toolId: tool.name,
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
  })

  // Now process all connections between agents
  scenarioJSON.agents.forEach((agent: any) => {
    const sourceNodeId = agentNameToNodeId.get(agent.name)

    if (agent.downstreamAgents && agent.downstreamAgents.length > 0) {
      agent.downstreamAgents.forEach((targetAgentName: string) => {
        const targetNodeId = agentNameToNodeId.get(targetAgentName)

        if (sourceNodeId && targetNodeId) {
          // Create an edge between agents
          edges.push({
            id: `edge-${edgeIdCounter++}`,
            source: sourceNodeId,
            target: targetNodeId,
            type: "customEdge",
            label: "when user wants to",
            data: {
              handoffRule: "when user wants to",
              isToolConnection: false,
            },
          })
        }
      })
    }
  })

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
  const [scenarios, setScenarios] = useState<any[]>([])
  const [activeScenario, setActiveScenario] = useState("default")
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [agentSearch, setAgentSearch] = useState("")
  const [toolSearch, setToolSearch] = useState("")
  const [activeItemType, setActiveItemType] = useState<"agent" | "tool">("agent")
  const [editingDescriptionId, setEditingDescriptionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingScenarios, setIsLoadingScenarios] = useState<boolean>(false)

  // Add these state variables inside the component function, after the existing state variables
  const [agents, setAgents] = useState<Agent[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoadingAgents, setIsLoadingAgents] = useState(false)
  const [isLoadingTools, setIsLoadingTools] = useState(false)

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
  const [availableAgents, setAvailableAgents] = useState([...defaultAgents])

  // Update available agents whenever nodes change
  // useEffect(() => {
  //   // Get IDs of agents already in the flow
  //   const usedAgentIds = nodes
  //     .filter((node) => !node.data?.nodeType || node.data?.nodeType === "agent")
  //     .map((node) => node.data.agentId || node.data.id)

  //   // Get IDs of tools already in the flow
  //   const usedToolIds = nodes.filter((node) => node.data?.nodeType === "tool").map((node) => node.data.toolId)

  //   // Check if starter agent is used
  //   const hasStarterAgent = nodes.some((node) => node.data.nodeType === "starter")

  //   // Check if exit agent is used
  //   const hasExitAgent = nodes.some((node) => node.data.nodeType === "exit")

  //   // Filter default agents based on usage
  //   const filteredDefaultAgents = defaultAgents.filter((agent) => {
  //     if (agent.id === "starter" && hasStarterAgent) return false
  //     if (agent.id === "exit" && hasExitAgent) return false
  //     return true
  //   })

  //   // Filter regular agents that aren't already used
  //   const filteredRegularAgents = sampleAgents.filter((agent) => !usedAgentIds.includes(agent.id))

  //   // Update available agents
  //   setAvailableAgents([...filteredDefaultAgents, ...filteredRegularAgents])
  // }, [nodes])

  useEffect(() => {
    // Get IDs of agents already in the flow
    const usedAgentIds = nodes
      .filter((node) => !node.data?.nodeType || node.data?.nodeType === "agent")
      .map((node) => node.data.agentId || node.data.id)

    // Get IDs of tools already in the flow
    const usedToolIds = nodes.filter((node) => node.data?.nodeType === "tool").map((node) => node.data.toolId)

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
    const filteredRegularAgents = agents.filter((agent) => !usedAgentIds.includes(agent.id))

    // Update available agents
    setAvailableAgents([...filteredDefaultAgents, ...filteredRegularAgents])
  }, [nodes, agents])

  useEffect(() => {
    const loadScenariosFromMockAPI = async () => {
      setIsLoadingScenarios(true)
      try {
        const response = await fetch("https://5f677b0438ce870016398690.mockapi.io/api/scenarios")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        const loadedScenarios = data
          .map((scenarioInfo) => {
            try {
              // Check if content exists and has the right structure
              if (!scenarioInfo.content) {
                console.log(`Scenario ${scenarioInfo.id} has no content property`)
                return null
              }

              // Handle different content structures
              let scenarioJSON
              let scenarioName = "Unnamed Scenario"

              if (scenarioInfo.content.instruction) {
                // Try to parse instruction as JSON if it's a string
                try {
                  scenarioJSON =
                    typeof scenarioInfo.content.instruction === "string"
                      ? JSON.parse(scenarioInfo.content.instruction)
                      : scenarioInfo.content.instruction

                  scenarioName = scenarioInfo.content.scenario_name || scenarioJSON.name || "Unnamed Scenario"
                } catch (parseError) {
                  console.error(`Error parsing instruction JSON for scenario ${scenarioInfo.id}:`, parseError)
                  return null
                }
              } else if (scenarioInfo.content.scenarios && Array.isArray(scenarioInfo.content.scenarios)) {
                // Handle scenarios array format
                const firstScenario = scenarioInfo.content.scenarios[0]
                scenarioJSON = firstScenario
                scenarioName = firstScenario.name || "Unnamed Scenario"
              } else {
                console.log(`Scenario ${scenarioInfo.id} has unknown content structure`)
                return null
              }

              // Skip if we couldn't get a valid scenario JSON
              if (!scenarioJSON || !scenarioJSON.agents) {
                console.log(`Scenario ${scenarioInfo.id} has invalid or missing agents`)
                return null
              }

              const { nodes: importedNodes, edges: importedEdges } = convertFromTreeJSON(scenarioJSON)

              return {
                id: scenarioInfo.id,
                name: scenarioName,
                description: scenarioJSON.description || "A scenario with agents, tools, and connections.",
                nodes: importedNodes,
                edges: importedEdges,
                treeJSON: scenarioJSON,
                cloudUrl: `https://5f677b0438ce870016398690.mockapi.io/api/scenarios/${scenarioInfo.id}`,
                isPublic: false,
              }
            } catch (error) {
              console.error(`Error loading scenario ${scenarioInfo.id}:`, error)
              return null
            }
          })
          .filter(Boolean)

        setScenarios(loadedScenarios)

        toast({
          title: "Scenarios loaded",
          description: `${loadedScenarios.length} scenario(s) loaded from the mock API.`,
        })
      } catch (error) {
        console.error("Error loading scenarios:", error)
        toast({
          title: "Failed to load scenarios",
          description: "There was an error loading your scenarios from the mock API.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingScenarios(false)
      }
    }

    loadScenariosFromMockAPI()
  }, [toast])

  // Add this after the other useEffect hooks
  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoadingAgents(true)
      try {
        const agentData = await getAgents()
        setAgents(agentData)
      } catch (error) {
        console.error("Error fetching agents:", error)
        toast({
          title: "Failed to load agents",
          description: "There was an error loading the agents.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingAgents(false)
      }
    }

    const fetchTools = async () => {
      setIsLoadingTools(true)
      try {
        const toolData = await getTools()
        setTools(toolData)
      } catch (error) {
        console.error("Error fetching tools:", error)
        toast({
          title: "Failed to load tools",
          description: "There was an error loading the tools.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingTools(false)
      }
    }

    fetchAgents()
    fetchTools()
  }, [toast])

  // Save the current scenario
  const saveScenario = async () => {
    // Generate a scenario ID if this is a new scenario
    const scenarioId = isEditing ? activeScenario : generateScenarioId()

    // Generate the tree-based JSON
    const treeJSON = convertToTreeJSON(nodes, edges, scenarioId, scenarioName)

    try {
      const response = await fetch("https://5f677b0438ce870016398690.mockapi.io/api/scenarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: {
            scenarios: [
              {
                scenario_name: scenarioName,
                instruction: JSON.stringify(treeJSON),
              },
            ],
          },
          id: scenarioId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const a = await response.json()

      // Create the new scenario object
      const newScenario = {
        id: scenarioId,
        name: scenarioName,
        nodes: nodes,
        edges: edges,
        treeJSON: treeJSON,
        cloudUrl: `https://5f677b0438ce870016398690.mockapi.io/api/scenarios/${scenarioId}`,
        isPublic: false,
      }

      // Update the scenarios state
      setScenarios((prevScenarios) => [...prevScenarios, newScenario])

      toast({
        title: "Scenario saved",
        description: `"${scenarioName}" has been saved to the mock API.`,
      })
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Save failed",
        description: `Failed to save the scenario to the mock API: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsModalOpen(false)
    }
  }

  // Auto layout function to arrange nodes in a grid
  const autoLayout = useCallback(() => {
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
          if (isDefaultAgent === "true") {
            agent = defaultAgents.find((a) => a.id === agentId)
          } else {
            agent = agents.find((a) => a.id === agentId)
          }

          if (!agent) return

          // Create a new agent node
          const newNode = {
            id: `${agent.nodeType || "agent"}-${agentId}-${Date.now()}`,
            type: "agentNode",
            position,
            data: {
              label: isDefaultAgent === "true" ? agent.name : agent.agentName,
              avatar:
                isDefaultAgent === "true"
                  ? agent.avatar
                  : agent.avatarUrl
                    ? `https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/${agent.avatarUrl}${agent.avatarUrl.endsWith(".svg") ? "" : ".svg"}`
                    : "/avatars/avatar-male-01.svg",
              agentId: agent.id,
              id: agent.id,
              nodeType: isDefaultAgent === "true" ? agent.nodeType || "agent" : "agent",
            },
          }

          setNodes((nds) => nds.concat(newNode))

          // Show toast for special agents
          if (isDefaultAgent === "true" && agent.nodeType === "starter") {
            toast({
              title: "Starter Agent Added",
              description: "This agent can only connect to other nodes and cannot receive connections.",
            })
          } else if (isDefaultAgent === "true" && agent.nodeType === "exit") {
            toast({
              title: "Exit Agent Added",
              description: "This agent can only receive connections and cannot connect to other nodes.",
            })
          }
        } else if (toolId) {
          const tool = tools.find((t) => t.id === toolId)
          if (!tool) return

          // Extract method and URL from tool content
          const content = tool.content || {}
          const method = content.method || "GET"
          const url = content.url || "/api/unknown"

          // Create a new tool node
          const newNode = {
            id: `tool-${toolId}-${Date.now()}`,
            type: "agentNode",
            position,
            data: {
              label: tool.name,
              method: method,
              url: url,
              toolId: tool.id,
              nodeType: "tool",
            },
          }

          setNodes((nds) => nds.concat(newNode))
        }
      }
    },
    [reactFlowInstance, setNodes, toast, agents, tools],
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
  const deleteScenario = async (scenarioId: string) => {
    if (scenarios.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one scenario.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`https://5f677b0438ce870016398690.mockapi.io/api/scenarios/${scenarioId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedScenarios = scenarios.filter((s) => s.id !== scenarioId)
      setScenarios(updatedScenarios)

      toast({
        title: "Scenario deleted",
        description: "The scenario has been deleted successfully.",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete the scenario from the mock API.",
        variant: "destructive",
      })
    }
  }

  // Export scenario as JSON
  const exportScenario = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId)
    if (!scenario) return

    // Generate tree JSON if it doesn't exist
    const treeJSON = scenario.treeJSON || convertToTreeJSON(scenario.nodes, scenario.edges, scenarioId, scenario.name)

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
            const newId = jsonData.scenario_id || generateScenarioId()
            const newScenario = {
              id: newId,
              name: jsonData.name || "Imported Scenario",
              nodes: importedNodes,
              edges: importedEdges,
              treeJSON: jsonData,
              cloudUrl: null,
              isPublic: false,
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

  const handleNodesChange = useCallback(
    (changes) => {
      setNodes((ns) => {
        return applyNodeChanges(changes, ns)
      })
    },
    [setNodes],
  )

  const handleEdgesChange = useCallback(
    (changes) => {
      setEdges((es) => {
        return applyEdgeChanges(changes, es)
      })
    },
    [setEdges],
  )

  const filteredDefaultAgents = defaultAgents.filter((agent) =>
    agent.name.toLowerCase().includes(agentSearch.toLowerCase()),
  )

  // Update the filteredRegularAgents variable in the render section
  // Find and replace:
  // const filteredRegularAgents = sampleAgents.filter((agent) =>
  //   agent.name.toLowerCase().includes(agentSearch.toLowerCase())
  // )

  // With:
  const filteredRegularAgents = agents.filter((agent) =>
    agent.agentName.toLowerCase().includes(agentSearch.toLowerCase()),
  )

  // Update the filteredTools variable in the render section
  // Find and replace:
  // const filteredTools = sampleTools.filter((tool) => tool.name.toLowerCase().includes(toolSearch.toLowerCase()))

  // With:
  const filteredTools = tools.filter((tool) => tool.name.toLowerCase().includes(toolSearch.toLowerCase()))

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agent Scenarios</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create and manage your agent flow scenarios</p>
        </div>
        <div className="flex gap-2">
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
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search scenarios..."
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoadingScenarios ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-4 text-sm text-gray-500">Loading scenarios from the mock API...</p>
        </div>
      ) : scenarios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h3 className="text-lg font-medium">No scenarios found</h3>
            <p className="mt-1 text-sm text-gray-500">Create a new scenario or import one to get started.</p>
            <div className="mt-4 flex gap-2 justify-center">
              <Button size="sm" onClick={createNewScenario}>
                Create New
              </Button>
              <Button size="sm" variant="outline" onClick={() => importScenario("new")}>
                Import
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios
            .filter(
              (scenario) =>
                searchQuery === "" ||
                scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (scenario.description && scenario.description.toLowerCase().includes(searchQuery.toLowerCase())),
            )
            .map((scenario) => (
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
                        <div className="relative group">
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            className="text-xl font-semibold outline-none border-b-2 border-transparent focus:border-gray-300 transition-colors py-0.5 px-0.5"
                            onBlur={(e) => {
                              const newName = e.currentTarget.textContent || "Untitled Scenario"
                              if (newName !== scenario.name) {
                                const updatedScenarios = scenarios.map((s) =>
                                  s.id === scenario.id ? { ...s, name: newName } : s,
                                )
                                setScenarios(updatedScenarios)
                                toast({
                                  title: "Scenario renamed",
                                  description: "Scenario name has been updated successfully.",
                                })
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                e.currentTarget.blur()
                              } else if (e.key === "Escape") {
                              }
                            }}
                          >
                            {scenario.name}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-[900]">
                          <DropdownMenuItem onClick={() => exportScenario(scenario.id)}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => importScenario(scenario.id)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Import
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteScenario(scenario.id)} className="text-red-500">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                          className="cursor-pointer"
                          onClick={() => setEditingDescriptionId(scenario.id)}
                          title="Click to edit description"
                        >
                          {scenario.description || "No description provided"}
                          {scenario.treeJSON && (
                            <span className="ml-2 text-green-500 text-xs">• Tree JSON available</span>
                          )}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>

                  <div className="grid grid-cols-2 border-t border-gray-200 dark:border-gray-800">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center justify-center gap-2 rounded-none h-12 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                      onClick={() => viewScenario(scenario.id)}
                    >
                      <Eye className="h-3 w-3" />
                      <span className="text-xs">View</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center justify-center gap-2 rounded-none h-12 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 border-l border-gray-200 dark:border-gray-800"
                      onClick={() => editScenario(scenario.id)}
                    >
                      <Edit className="h-3 w-3" />
                      <span className="text-xs">Edit</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Modal for creating/editing scenarios */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col">
          <div className="flex-1 flex flex-col overflow-hidden">
            {!isViewOnly && (
              <DialogTitle className="mb-4 text-xl">
                {isEditing ? `Edit: ${scenarioName}` : `New Scenario: ${scenarioName}`}
              </DialogTitle>
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
                                    className="flex items-center p-1 border rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-gray-800"
                                  >
                                    <div className="w-5 h-5 rounded-full mr-1.5 flex items-center justify-center">
                                      {agent.id === "starter" ? (
                                        <Play className="w-3 h-3 text-green-600 dark:text-green-400" />
                                      ) : (
                                        <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span
                                        className={`text-[10px] ${
                                          agent.id === "exit"
                                            ? "text-red-600 dark:text-red-400 font-bold"
                                            : "font-medium"
                                        }`}
                                      >
                                        {agent.name}
                                      </span>
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
                              {/* Update the agent card rendering in the sidebar */}
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
                                    src={
                                      agent.avatarUrl
                                        ? `https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/${agent.avatarUrl}${agent.avatarUrl.endsWith(".svg") ? "" : ".svg"}`
                                        : "/avatars/avatar-male-01.svg"
                                    }
                                    alt={agent.agentName}
                                    className="w-5 h-5 mr-1.5 rounded-full"
                                  />
                                  <span className="text-[10px]">{agent.agentName}</span>
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
                            {/* Update the tool card rendering in the sidebar */}
                            {filteredTools.map((tool) => {
                              // Extract method and URL from tool content if available
                              const content = tool.content || {}
                              const method = content.method || "GET"
                              const url = content.url || "/api/unknown"

                              return (
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
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-sm ${getMethodColor(method)}`}>
                                      {method}
                                    </span>
                                  </div>
                                  <span className="text-[8px] text-gray-500 mt-0.5 truncate">{url}</span>
                                </div>
                              )
                            })}
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
                    onNodesChange={isViewOnly ? undefined : handleNodesChange}
                    onEdgesChange={isViewOnly ? undefined : handleEdgesChange}
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
                            onClick={autoLayout}
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
