"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BentoGrid from "@/components/bento-grid"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { AgentEditSimple } from "@/components/agent-edit-simple"
import { getAgents, createAgent, updateAgent, deleteAgent, type Agent } from "@/lib/api-service"

// Sample data for dropdowns
const languages = [
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
]

const avatarOptions = [
  {
    id: "avatar-male-17",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Girl%3DOff%2C%20Avatar%3D17-TwIcNhEetTGz7OV1zMDjSg9a2GE4aB.svg",
    label: "Male 17",
  },
  {
    id: "avatar-male-15",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Girl%3DOff%2C%20Avatar%3D15-GfpYLIm2N8nHhjVRjpYR35LE8z7D6d.svg",
    label: "Male 15",
  },
  {
    id: "avatar-female-31",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Girl%3DOn%2C%20Avatar%3D31-JIph4tLdEfGFhuEwGNMTNbVEThTwHH.svg",
    label: "Female 31",
  },
  {
    id: "avatar-male-13",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Girl%3DOff%2C%20Avatar%3D13-9YuMacxfZqRPF4Jh13CcJmVOPJyGRb.svg",
    label: "Male 13",
  },
  {
    id: "avatar-female-13",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Girl%3DOn%2C%20Avatar%3D13-u6vGmxzPFfgBuMSA4s6T54jV3bouW2.svg",
    label: "Female 13",
  },
  {
    id: "avatar-female-02",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Girl%3DOn%2C%20Avatar%3D02-5EeurYtg2mWxAmAf3g0zcxKf8qRQYX.svg",
    label: "Female 02",
  },
  {
    id: "avatar-female-25",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Girl%3DOn%2C%20Avatar%3D25-wZ9L4obZRuM6UdmmY9F64zNimq6b7G.svg",
    label: "Female 25",
  },
  {
    id: "avatar-male-01",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Girl%3DOn%2C%20Avatar%3D35-OOaJHFTbMdDvUa885Zo1T1zBn4VmRU.svg",
    label: "Male 01",
  },
  {
    id: "avatar-female-35",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Girl%3DOn%2C%20Avatar%3D12-FOltPXF42t1HPSQ7vJd9zoTYlJvHEn.svg",
    label: "Female 35",
  },
  {
    id: "avatar-female-12",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Girl%3DOn%2C%20Avatar%3D12-FOltPXF42t1HPSQ7vJd9zoTYlJvHEn.svg",
    label: "Female 12",
  }, // Using the same URL for the last one since we only have 9 URLs
]

export default function AgentsPage({
  agentToEdit,
  setAgentToEdit,
}: {
  agentToEdit?: string | null
  setAgentToEdit?: (agent: string | null) => void
}) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents()
  }, [])

  // Handle opening the specified agent
  useEffect(() => {
    if (agentToEdit && agents.length > 0) {
      const agent = agents.find((a) => a.agentName === agentToEdit)
      if (agent) {
        handleEditAgent(agent)
        // Reset the agentToEdit after opening
        if (setAgentToEdit) {
          setAgentToEdit(null)
        }
      }
    }
  }, [agentToEdit, agents, setAgentToEdit])

  const fetchAgents = async () => {
    setIsLoading(true)
    try {
      const data = await getAgents()
      setAgents(data)
    } catch (error) {
      console.error("Failed to fetch agents:", error)
      toast({
        title: "Error",
        description: "Failed to load agents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewAgent = () => {
    const newAgent: Agent = {
      id: "",
      agentName: "New Agent",
      instruction: "Describe what this agent does...",
      avatarUrl: "/avatars/avatar-male-01.svg",
      rawSettings: {
        language: "en-US",
        firstMessage: "Hello! How can I assist you today?",
        voiceIdentity: "b",
        voiceDemeanor: "b",
        voiceTone: "b",
        voiceEnthusiasm: "b",
        voiceFormality: "b",
        voiceEmotion: "b",
        voiceFillerWords: "b",
        voicePacing: "b",
      },
    }
    setCurrentAgent(newAgent)
    setIsEditing(true)
  }

  const handleEditAgent = (agent: Agent) => {
    setCurrentAgent(agent)
    setIsEditing(true)
  }

  const handleDuplicateAgent = async (agent: Agent) => {
    try {
      setIsSubmitting(true)
      const duplicatedAgent = {
        agentName: `${agent.agentName} (Copy)`,
        instruction: agent.instruction,
        avatarUrl: agent.avatarUrl,
        rawSettings: agent.rawSettings || {},
      }

      const newAgent = await createAgent(duplicatedAgent)
      setAgents([...agents, newAgent])

      toast({
        title: "Success",
        description: "Agent duplicated successfully.",
      })
    } catch (error) {
      console.error("Failed to duplicate agent:", error)
      toast({
        title: "Error",
        description: "Failed to duplicate agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAgent = async (agentId: string) => {
    try {
      setIsSubmitting(true)
      await deleteAgent(agentId)
      setAgents(agents.filter((agent) => agent.id !== agentId))

      toast({
        title: "Success",
        description: "Agent deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete agent:", error)
      toast({
        title: "Error",
        description: "Failed to delete agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAgent = async (agentData: any) => {
    try {
      setIsSubmitting(true)

      if (currentAgent?.id) {
        // Update existing agent
        const updatedAgent = await updateAgent(currentAgent.id, agentData)
        setAgents(agents.map((agent) => (agent.id === currentAgent.id ? updatedAgent : agent)))

        toast({
          title: "Success",
          description: "Agent updated successfully.",
        })
      } else {
        // Create new agent
        const newAgent = await createAgent(agentData)
        setAgents([...agents, newAgent])

        toast({
          title: "Success",
          description: "Agent created successfully.",
        })
      }

      setIsEditing(false)
      setCurrentAgent(null)
    } catch (error) {
      console.error("Failed to save agent:", error)
      toast({
        title: "Error",
        description: "Failed to save agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
        agent.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (agent.instruction && agent.instruction.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .map((agent) => ({
      title: agent.agentName,
      description: agent.instruction?.substring(0, 100) || "No description",
      avatarSrc:
        agent.avatarUrl && !agent.avatarUrl.startsWith("/")
          ? agent.avatarUrl
          : avatarOptions.find((opt) => opt.id === agent.avatarUrl?.replace("/avatars/", "").replace(".svg", ""))
              ?.src || avatarOptions[0].src,
      language: agent.rawSettings?.language || "en-US",
      updatedAt: agent.updated ? new Date(agent.updated) : new Date(),
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

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-4 text-sm text-gray-500">Loading agents...</p>
        </div>
      ) : bentoItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h3 className="text-lg font-medium">No agents found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? "Try a different search term" : "Create a new agent to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={handleNewAgent} className="mt-4">
                Create New Agent
              </Button>
            )}
          </div>
        </div>
      ) : (
        <BentoGrid
          items={bentoItems}
          onItemClick={(index) => handleEditAgent(agents[index])}
          onItemAction={handleItemAction}
        />
      )}

      {isEditing && currentAgent && (
        <Dialog
          open={isEditing}
          onOpenChange={(open) => {
            if (!open) handleCancelEdit()
          }}
        >
          <DialogContent className="max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] w-full h-[90vh] p-0 border-none shadow-lg rounded-xl overflow-hidden">
            <div className="w-full sticky top-0 bg-background z-50 flex items-center justify-between p-4 border-b">
              <h2 className="text-base font-medium">
                {currentAgent.id ? `Edit: ${currentAgent.agentName}` : "Create New Agent"}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AgentEditSimple
                agent={currentAgent}
                onSave={handleSaveAgent}
                onCancel={handleCancelEdit}
                isSubmitting={isSubmitting}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
