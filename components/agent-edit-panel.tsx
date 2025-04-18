"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BasicTab } from "@/components/agent-edit/basic-tab"
import { AdvancedTab } from "@/components/agent-edit/advanced-tab"
import { VoiceTab } from "@/components/agent-edit/voice-tab"

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

// Sample tag suggestions
const tagSuggestions = [
  "Customer Service",
  "Sales",
  "Technical",
  "Support",
  "Onboarding",
  "Billing",
  "Product",
  "Marketing",
  "Feedback",
  "Troubleshooting",
]

// Model options
const models = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Supper Fast, affordable small model for focused tasks" },
  { id: "gpt-4o", name: "GPT-4o", description: "Medium, intelligent, flexible GPT model" },
  { id: "o3-mini", name: "o3-mini", description: "Slow, flexible, intelligent reasoning model" },
]

// Updated voices with descriptions
const voices = [
  { id: "allison", name: "Allison", description: "Female, professional and clear", gender: "female" },
  { id: "matthew", name: "Matthew", description: "Male, authoritative and confident", gender: "male" },
  { id: "james", name: "James", description: "Male, British accent, sophisticated", gender: "male" },
  { id: "emma", name: "Emma", description: "Female, warm and friendly", gender: "female" },
  { id: "brian", name: "Brian", description: "Male, deep and resonant", gender: "male" },
  { id: "joanna", name: "Joanna", description: "Female, articulate and precise", gender: "female" },
  { id: "olivia", name: "Olivia", description: "Female, gentle and soothing", gender: "female" },
  { id: "amy", name: "Amy", description: "Female, cute and cheerful", gender: "female" },
  { id: "neural", name: "Neural", description: "AI-generated, natural and fluid", gender: "neutral" },
]

const personalities = ["Friendly", "Formal", "Funny", "Empathetic", "Concise"]

// Update the availableTools array to include URLs
const availableTools = [
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    method: "GET",
    url: "https://api.example.com/knowledge",
    description: "Retrieve information from knowledge base",
  },
  {
    id: "order-lookup",
    name: "Order Lookup",
    method: "GET",
    url: "https://api.example.com/orders",
    description: "Look up customer order details",
  },
  {
    id: "ticket-creation",
    name: "Ticket Creation",
    method: "POST",
    url: "https://api.example.com/tickets",
    description: "Create support tickets",
  },
  {
    id: "product-catalog",
    name: "Product Catalog",
    method: "GET",
    url: "https://api.example.com/products",
    description: "Browse product information",
  },
  {
    id: "pricing-calculator",
    name: "Pricing Calculator",
    method: "GET",
    url: "https://api.example.com/pricing",
    description: "Calculate product pricing",
  },
  {
    id: "order-processing",
    name: "Order Processing",
    method: "POST",
    url: "https://api.example.com/orders/process",
    description: "Process customer orders",
  },
  {
    id: "diagnostic-tools",
    name: "Diagnostic Tools",
    method: "GET",
    url: "https://api.example.com/diagnostics",
    description: "Run system diagnostics",
  },
  {
    id: "remote-access",
    name: "Remote Access",
    method: "POST",
    url: "https://api.example.com/remote",
    description: "Access remote systems",
  },
  {
    id: "calendar",
    name: "Calendar",
    method: "GET",
    url: "https://api.example.com/calendar",
    description: "View and manage calendar",
  },
  {
    id: "email",
    name: "Email",
    method: "POST",
    url: "https://api.example.com/email",
    description: "Send and receive emails",
  },
  {
    id: "customer-update",
    name: "Customer Update",
    method: "PUT",
    url: "https://api.example.com/customers",
    description: "Update customer information",
  },
  {
    id: "record-deletion",
    name: "Record Deletion",
    method: "DELETE",
    url: "https://api.example.com/records",
    description: "Delete customer records",
  },
]

const availableAgents = [
  "Customer Support",
  "Sales Manager",
  "Technical Support",
  "Billing Department",
  "Hardware Team",
  "Software Team",
  "Human Agent",
  "Exit Agent",
]

// Sample RAG datasources
const ragDatasources = [
  { id: "kb-1", name: "Product Documentation", description: "Technical documentation for all products" },
  { id: "kb-2", name: "FAQ Database", description: "Frequently asked questions and answers" },
  { id: "kb-3", name: "Support Articles", description: "Troubleshooting guides and how-to articles" },
  { id: "kb-4", name: "Company Policies", description: "Internal policies and procedures" },
  { id: "kb-5", name: "Customer Feedback", description: "Historical customer feedback and reviews" },
]

// Updated avatar options with the new SVGs
const avatarOptions = [
  { id: "avatar-male-17", src: "/avatars/avatar-male-17.svg", label: "Male 17" },
  { id: "avatar-male-15", src: "/avatars/avatar-male-15.svg", label: "Male 15" },
  { id: "avatar-female-31", src: "/avatars/avatar-female-31.svg", label: "Female 31" },
  { id: "avatar-male-13", src: "/avatars/avatar-male-13.svg", label: "Male 13" },
  { id: "avatar-female-13", src: "/avatars/avatar-female-13.svg", label: "Female 13" },
  { id: "avatar-female-02", src: "/avatars/avatar-female-02.svg", label: "Female 02" },
  { id: "avatar-female-25", src: "/avatars/avatar-female-25.svg", label: "Female 25" },
  { id: "avatar-male-01", src: "/avatars/avatar-male-01.svg", label: "Male 01" },
  { id: "avatar-female-35", src: "/avatars/avatar-female-35.svg", label: "Female 35" },
  { id: "avatar-female-12", src: "/avatars/avatar-female-12.svg", label: "Female 12" },
]

// Default handoff rule
const defaultHandoffRule = {
  condition: "If the user asks to end the conversation or indicates they want to finish",
  handoffTo: "Exit Agent",
}

export default function AgentEditPanel({ agent, onSave, onCancel }: any) {
  // First, add a new state for app variables
  const [appVariables, setAppVariables] = useState<{ key: string; value: string }[]>(() => {
    // Initialize with any existing app variables or an empty array with one empty variable
    return agent.appVariables || [{ key: "", value: "" }]
  })

  // First, add a new state for pronunciation dictionaries
  const [pronunciationDictionaries, setPronunciationDictionaries] = useState<{ word: string; pronunciation: string }[]>(
    () => {
      // Initialize with any existing dictionaries or an empty array with one empty dictionary
      return agent.pronunciationDictionaries || []
    },
  )

  // Also update the initial state to ensure avatarId is properly set
  const findDefaultAvatar = () => {
    if (agent.avatarId && avatarOptions.some((opt) => opt.id === agent.avatarId)) {
      return agent.avatarId
    }
    return "avatar-male-01" // Default to first avatar if not found
  }

  const handleAvatarChange = (avatarId: string) => {
    const selectedAvatar = avatarOptions.find((option) => option.id === avatarId)
    if (selectedAvatar) {
      // Update both avatarId and avatarSrc in a single state update
      setEditedAgent({
        ...editedAgent,
        avatarId: avatarId,
        avatarSrc: selectedAvatar.src,
      })
    }
  }

  // Update the editedAgent useState initialization to include the new voice settings with default values
  const [editedAgent, setEditedAgent] = useState(() => {
    // Make sure we have a valid avatarId
    const defaultAvatarId = findDefaultAvatar()
    const defaultAvatar = avatarOptions.find((opt) => opt.id === defaultAvatarId)

    // Set default language to Vietnamese if not specified
    const primaryLanguage = agent.language || "vi"
    const alternativeLanguage = agent.alternativeLanguage || "none"

    // Convert voice string to voice id if needed
    let voiceId = agent.voice
    if (voiceId && typeof voiceId === "string") {
      const matchedVoice = voices.find((v) => v.name.toLowerCase() === voiceId.toLowerCase())
      if (matchedVoice) {
        voiceId = matchedVoice.id
      }
    }

    // Ensure speedValue is a string
    let speedValue = agent.speedValue
    if (typeof speedValue === "number") {
      // Convert number to string value
      if (speedValue < 0.9) speedValue = "slow"
      else if (speedValue > 1.1) speedValue = "fast"
      else speedValue = "normal"
    } else if (!speedValue || (speedValue !== "slow" && speedValue !== "fast" && speedValue !== "normal")) {
      speedValue = "normal"
    }

    // Set up handoff rules with default rule if none exist
    let handoffRules = agent.handoffRules || []
    if (handoffRules.length === 0) {
      handoffRules = [defaultHandoffRule]
    }

    const initialAgent = {
      ...agent,
      avatarId: defaultAvatarId,
      avatarSrc: defaultAvatar?.src || "/avatars/avatar-male-01.svg",
      ragDatasources: agent.ragDatasources || [],
      language: primaryLanguage,
      alternativeLanguage: alternativeLanguage,
      voice: voiceId || voices[0].id,
      model: agent.model || "gpt-4o-mini", // Add default model
      tags: agent.tags || [],
      firstMessage: agent.firstMessage || "", // Add firstMessage property
      speedValue: speedValue, // Ensure this is a string: "normal", "slow", or "fast"
      confidenceValue: agent.confidenceValue !== undefined ? agent.confidenceValue : 50,
      motivationValue: agent.motivationValue !== undefined ? agent.motivationValue : 50,
      // Add default values for new voice settings
      voiceIdentity: agent.voiceIdentity || "b",
      voiceDemeanor: agent.voiceDemeanor || "b",
      voiceTone: agent.voiceTone || "b",
      voiceEnthusiasm: agent.voiceEnthusiasm || "b",
      voiceFormality: agent.voiceFormality || "b",
      voiceEmotion: agent.voiceEmotion || "b",
      voiceFillerWords: agent.voiceFillerWords || "b",
      voicePacing: agent.voicePacing || "b",
      // Add default handoff rule if none exist
      handoffRules: handoffRules,
    }
    return initialAgent
  })

  const [activeTab, setActiveTab] = useState("basic")

  // Add this with the other useState declarations
  const [voiceEnabled, setVoiceEnabled] = useState(agent.voiceEnabled !== false)

  const handleChange = (field: string, value: any) => {
    setEditedAgent({ ...editedAgent, [field]: value })
  }

  // Update the handleTagsChange function to ensure it always receives an array
  const handleTagsChange = (tags: string[]) => {
    handleChange("tags", tags || [])
  }

  // Update the handleSaveAgent function to include appVariables
  const handleSave = () => {
    // Filter out empty variables and dictionaries
    const filteredVariables = appVariables.filter((v) => v.key.trim() !== "" && v.value.trim() !== "")
    const filteredDictionaries = pronunciationDictionaries.filter(
      (d) => d.word.trim() !== "" && d.pronunciation.trim() !== "",
    )
    onSave({
      ...editedAgent,
      appVariables: filteredVariables,
      pronunciationDictionaries: filteredDictionaries,
    })
  }

  return (
    <div className="relative bg-background w-full h-full flex flex-col">
      {/* Add the background pattern div */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

      {/* Scrollable content area */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="p-6 relative">
          {/* Add the background pattern div */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

          <div className="relative z-10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="voice">Voice</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <BasicTab
                  editedAgent={editedAgent}
                  handleChange={handleChange}
                  handleTagsChange={handleTagsChange}
                  handleAvatarChange={handleAvatarChange}
                  avatarOptions={avatarOptions}
                  languages={languages}
                  tagSuggestions={tagSuggestions}
                />
              </TabsContent>

              <TabsContent value="advanced">
                <AdvancedTab
                  editedAgent={editedAgent}
                  handleChange={handleChange}
                  appVariables={appVariables}
                  setAppVariables={setAppVariables}
                  models={models}
                  availableTools={availableTools}
                  ragDatasources={ragDatasources}
                />
              </TabsContent>

              <TabsContent value="voice">
                <VoiceTab
                  editedAgent={editedAgent}
                  handleChange={handleChange}
                  voiceEnabled={voiceEnabled}
                  setVoiceEnabled={setVoiceEnabled}
                  pronunciationDictionaries={pronunciationDictionaries}
                  setPronunciationDictionaries={setPronunciationDictionaries}
                  voices={voices}
                  personalities={personalities}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Footer outside of scrollable area */}
      <div className="relative z-10 bg-background p-4 border-t flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="h-9 text-xs text-black border-black">
          Cancel
        </Button>
        <Button onClick={handleSave} size="sm" className="gap-2 h-9 text-xs bg-black hover:bg-black/90 text-white">
          <Sparkles className="h-3.5 w-3.5" />
          Save Agent
        </Button>
      </div>
    </div>
  )
}
