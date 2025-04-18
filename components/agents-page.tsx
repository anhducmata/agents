"use client"

import React, { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import AgentEditPanel from "@/components/agent-edit-panel"
import BentoGrid from "@/components/bento-grid"
import "react"
import { Input } from "@/components/ui/input"

// Import the Dialog components
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Sample agent data with updated avatars
const initialAgents = [
  {
    id: "1",
    name: "Customer Support",
    description: "Friendly assistant for customer inquiries and product support",
    role: "Provides friendly customer support for {{client:user_name}} about {{app:company_product}} inquiries and troubleshooting.",
    firstMessage: "Hello! I'm your customer support assistant. How can I help you with {{app:company_product}} today?",
    avatarId: "avatar-female-13",
    avatarSrc: "/avatars/avatar-female-13.svg",
    status: "Prod",
    language: "vi",
    tone: "Friendly",
    voice: "Allison",
    voiceEnabled: true,
    speed: "medium",
    confidence: "normal",
    motivation: "interested",
    model: "gpt-4o-mini",
    conversationCount: 1243,
    tools: ["Knowledge Base", "Order Lookup", "Ticket Creation"],
    memory: true,
    personality: "Friendly",
    handoffRules: [
      { condition: "technical issue", handoffTo: "Technical Support" },
      { condition: "billing question", handoffTo: "Billing Department" },
    ],
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    version: "1.3",
    ragDatasources: ["kb-1", "kb-3"],
    appVariables: [
      { key: "company_product", value: "SaaS Platform" },
      { key: "company_name", value: "TechCorp" },
    ],
    pronunciationDictionaries: [
      { word: "SaaS", pronunciation: "sass" },
      { word: "TechCorp", pronunciation: "tek-corp" },
    ],
    speedValue: 1.0,
    confidenceValue: 50,
    motivationValue: 75,
  },
  {
    id: "2",
    name: "Sales Assistant",
    description: "Helps customers find the right products and complete purchases",
    role: "Helps {{client:customer_name}} find the right {{app:product_type}} and completes sales transactions.",
    firstMessage:
      "Welcome! I'm here to help you find the perfect {{app:product_type}} for your needs. What are you looking for today?",
    avatarId: "avatar-male-01",
    avatarSrc: "/avatars/avatar-male-01.svg",
    status: "Prod",
    language: "vi",
    tone: "Formal",
    voice: "Matthew",
    voiceEnabled: true,
    speed: "medium",
    confidence: "normal",
    motivation: "interested",
    model: "gpt-4o",
    conversationCount: 856,
    tools: ["Product Catalog", "Pricing Calculator", "Order Processing"],
    memory: true,
    personality: "Formal",
    handoffRules: [{ condition: "discount request", handoffTo: "Sales Manager" }],
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    version: "2.1",
    ragDatasources: ["kb-2", "kb-4"],
    appVariables: [{ key: "product_type", value: "Software Solutions" }],
    speedValue: 1.1,
    confidenceValue: 75,
    motivationValue: 100,
  },
  {
    id: "3",
    name: "Technical Support",
    description: "Advanced technical troubleshooting and product support",
    role: "Provides technical troubleshooting and advanced product support.",
    firstMessage: "Hello! I'm your technical support assistant. What issue are you experiencing today?",
    avatarId: "avatar-male-13",
    avatarSrc: "/avatars/avatar-male-13.svg",
    status: "Dev",
    language: "en-GB",
    tone: "Formal",
    voice: "James",
    voiceEnabled: true,
    speed: "medium",
    confidence: "normal",
    motivation: "interested",
    model: "o3-mini",
    conversationCount: 427,
    tools: ["Diagnostic Tools", "Knowledge Base", "Remote Access"],
    memory: true,
    personality: "Formal",
    handoffRules: [{ condition: "hardware failure", handoffTo: "Hardware Team" }],
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    version: "0.9",
    ragDatasources: ["kb-1"],
    appVariables: [],
    speedValue: 0.9,
    confidenceValue: 50,
    motivationValue: 50,
  },
  {
    id: "4",
    name: "AI Coding Assistant",
    description: "Helps with code suggestions, debugging, and documentation",
    role: "Helps developers with code suggestions, debugging, and documentation.",
    firstMessage: "Hi there! I'm your coding assistant. What programming challenge can I help you with today?",
    avatarId: "avatar-male-15",
    avatarSrc: "/avatars/avatar-male-15.svg",
    status: "Beta",
    language: "en-US",
    tone: "Funny",
    voice: "Neural",
    voiceEnabled: true,
    speed: "medium",
    confidence: "normal",
    motivation: "interested",
    model: "gpt-4o",
    conversationCount: 112,
    tools: ["Code Analyzer", "Documentation Search", "GitHub Integration"],
    memory: true,
    personality: "Funny",
    handoffRules: [],
    updatedAt: new Date(), // Just now
    version: "0.4",
    ragDatasources: [],
    appVariables: [],
    speedValue: 1.0,
    confidenceValue: 25,
    motivationValue: 50,
  },
  {
    id: "5",
    name: "Multi-Language Support",
    description: "Multilingual assistant for international customers",
    role: "Helps international customers with product inquiries in multiple languages.",
    firstMessage: "¡Hola! Soy su asistente multilingüe. ¿Cómo puedo ayudarle hoy?",
    avatarId: "avatar-female-25",
    avatarSrc: "/avatars/avatar-female-25.svg",
    status: "Dev",
    language: "es",
    tone: "Friendly",
    voice: "Sofia",
    voiceEnabled: true,
    speed: "medium",
    confidence: "normal",
    motivation: "interested",
    model: "gpt-4o-mini",
    conversationCount: 78,
    tools: ["Translation", "Knowledge Base", "Ticket Creation"],
    memory: true,
    personality: "Friendly",
    handoffRules: [],
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    version: "0.7",
    ragDatasources: ["kb-5"],
    appVariables: [],
    speedValue: 0.8,
    confidenceValue: 50,
    motivationValue: 75,
  },
]

// Update the AgentsPage component to accept and use the agentToEdit prop

// Add this to the props at the top of the function
export default function AgentsPage({
  agentToEdit,
  setAgentToEdit,
}: {
  agentToEdit?: string | null
  setAgentToEdit?: (agent: string | null) => void
}) {
  const [agents, setAgents] = useState(initialAgents)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Add this useEffect to handle opening the specified agent
  React.useEffect(() => {
    if (agentToEdit) {
      const agent = agents.find((a) => a.name === agentToEdit)
      if (agent) {
        handleEditAgent(agent)
        // Reset the agentToEdit after opening
        if (setAgentToEdit) {
          setAgentToEdit(null)
        }
      }
    }
  }, [agentToEdit, agents])

  const handleNewAgent = () => {
    const newAgent = {
      id: Date.now().toString(),
      name: "New Agent",
      description: "Brief description of what this agent does",
      role: "Describe what this agent does... You can use {{client:user_name}} or {{app:company_name}} variables.",
      firstMessage: "Hello! How can I assist you today?", // Add default first message
      avatarId: "avatar-male-01",
      avatarSrc: "/avatars/avatar-male-01.svg",
      status: "Dev",
      language: "vi",
      tone: "Friendly",
      voice: "Allison",
      voiceEnabled: true,
      speed: "medium",
      confidence: "normal",
      motivation: "interested",
      model: "gpt-4o-mini",
      conversationCount: 0,
      tools: [],
      memory: true,
      personality: "Friendly",
      handoffRules: [],
      updatedAt: new Date(),
      version: "0.1",
      ragDatasources: [],
      appVariables: [{ key: "", value: "" }],
      pronunciationDictionaries: [],
      speedValue: 1.0,
      confidenceValue: 50,
      motivationValue: 50,
    }
    setCurrentAgent(newAgent)
    setIsEditing(true)
  }

  const handleEditAgent = (agent: any) => {
    setCurrentAgent(agent)
    setIsEditing(true)
  }

  const handleDuplicateAgent = (agent: any) => {
    const duplicatedAgent = {
      ...agent,
      id: Date.now().toString(),
      name: `${agent.name} (Copy)`,
      status: "Dev",
      conversationCount: 0,
      updatedAt: new Date(),
      version: "0.1",
    }
    setAgents([...agents, duplicatedAgent])
  }

  const handleDeleteAgent = (agentId: string) => {
    setAgents(agents.filter((agent) => agent.id !== agentId))
  }

  // Update the handleSaveAgent function to ensure avatar data is preserved
  const handleSaveAgent = (updatedAgent: any) => {
    // Update the agent with current timestamp and other needed properties
    const formattedAgent = {
      ...updatedAgent,
      updatedAt: new Date(),
      // Make sure avatar data is preserved
      avatarId: updatedAgent.avatarId,
      avatarSrc: updatedAgent.avatarSrc,
      // Preserve version and conversation count
      version: updatedAgent.version || "0.1",
      conversationCount: updatedAgent.conversationCount || 0,
    }

    if (agents.some((agent) => agent.id === formattedAgent.id)) {
      setAgents(agents.map((agent) => (agent.id === formattedAgent.id ? formattedAgent : agent)))
    } else {
      setAgents([...agents, formattedAgent])
    }
    setIsEditing(false)
    setCurrentAgent(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setCurrentAgent(null)
  }

  // Format agents for BentoGrid
  const bentoItems = agents
    .filter(
      (agent) =>
        searchQuery === "" ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (agent.role && agent.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (agent.personality && agent.personality.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .map((agent) => ({
      title: agent.name,
      description: agent.description || agent.role.substring(0, 100),
      avatarSrc: agent.avatarSrc,
      status: agent.status,
      language: agent.language,
      tone: agent.personality,
      voice: agent.voice,
      model: agent.model,
      tags: agent.tools,
      conversationCount: agent.conversationCount,
      updatedAt: agent.updatedAt,
      version: agent.version,
      originalData: agent,
    }))

  const handleItemAction = (index: number, action: string) => {
    const agent = agents[index]
    if (action === "edit") {
      handleEditAgent(agent)
    } else if (action === "duplicate") {
      handleDuplicateAgent(agent)
    } else if (action === "delete") {
      handleDeleteAgent(agent.id)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create and manage your voice assistant agents</p>
        </div>
        <Button onClick={handleNewAgent} size="sm" className="gap-2 bg-black hover:bg-black/90 text-white">
          <Plus className="h-4 w-4" />
          New Agent
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search agents..."
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <BentoGrid
        items={bentoItems}
        onItemClick={(index) => handleEditAgent(agents[index])}
        onItemAction={handleItemAction}
      />

      {isEditing && currentAgent && (
        <Dialog
          open={isEditing}
          onOpenChange={(open) => {
            if (!open) handleCancelEdit()
          }}
        >
          <DialogContent className="max-w-[60vw] w-full h-[95vh] flex flex-col">
            <div className="w-fit sticky top-0 bg-background z-50 flex items-center p-3 border-b border-b-[0.5px]">
              <h2 className="text-base font-medium">Edit Agent</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AgentEditPanel agent={currentAgent} onSave={handleSaveAgent} onCancel={handleCancelEdit} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
