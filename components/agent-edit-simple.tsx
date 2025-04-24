"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Agent } from "@/lib/api-service"
import { AvatarPicker } from "@/components/ui/avatar-picker"

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

// Replace the avatarOptions array with the updated URLs
const avatarOptions = [
  {
    id: "avatar-male-17",
    src: "https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/avatar-male-17.svg",
    label: "Male 17",
  },
  {
    id: "avatar-male-15",
    src: "https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/avatar-male-15.svg",
    label: "Male 15",
  },
  {
    id: "avatar-female-31",
    src: "https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/avatar-female-31.svg",
    label: "Female 31",
  },
  {
    id: "avatar-male-13",
    src: "https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/avatar-male-13.svg",
    label: "Male 13",
  },
  {
    id: "avatar-female-13",
    src: "https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/avatar-female-13.svg",
    label: "Female 13",
  },
  {
    id: "avatar-female-02",
    src: "https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/avatar-female-02.svg",
    label: "Female 02",
  },
  {
    id: "avatar-female-25",
    src: "https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/avatar-female-25.svg",
    label: "Female 25",
  },
  {
    id: "avatar-male-01",
    src: "https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/avatar-male-01.svg",
    label: "Male 01",
  },
  {
    id: "avatar-female-35",
    src: "https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/avatar-female-35.svg",
    label: "Female 35",
  },
  {
    id: "avatar-female-12",
    src: "https://mata-agents.s3.ap-southeast-1.amazonaws.com/avatars/avatar-female-12.svg",
    label: "Female 12",
  },
]

interface AgentEditSimpleProps {
  agent?: Agent | null
  onSave: (agent: any) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function AgentEditSimple({ agent, onSave, onCancel, isSubmitting = false }: AgentEditSimpleProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState({
    agentName: "",
    instruction: "",
    language: "en-US",
    firstMessage: "",
    avatarUrl: "/avatars/avatar-male-01.svg",
    // Voice settings
    voiceIdentity: "b",
    voiceDemeanor: "b",
    voiceTone: "b",
    voiceEnthusiasm: "b",
    voiceFormality: "b",
    voiceEmotion: "b",
    voiceFillerWords: "b",
    voicePacing: "b",
  })
  const [isGeneratingInstruction, setIsGeneratingInstruction] = useState(false)

  useEffect(() => {
    if (agent) {
      const rawSettings = agent.rawSettings || {}
      setFormData({
        agentName: agent.agentName || "",
        instruction: rawSettings.instruction || "",
        language: rawSettings.language || "en-US",
        firstMessage: rawSettings.firstMessage || "",
        avatarUrl: agent.avatarUrl || "/avatars/avatar-male-01.svg",
        // Voice settings
        voiceIdentity: rawSettings.voiceIdentity || "b",
        voiceDemeanor: rawSettings.voiceDemeanor || "b",
        voiceTone: rawSettings.voiceTone || "b",
        voiceEnthusiasm: rawSettings.voiceEnthusiasm || "b",
        voiceFormality: rawSettings.voiceFormality || "b",
        voiceEmotion: rawSettings.voiceEmotion || "b",
        voiceFillerWords: rawSettings.voiceFillerWords || "b",
        voicePacing: rawSettings.voicePacing || "b",
      })
    }
  }, [agent])

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleAvatarChange = (avatarUrl: string) => {
    handleChange("avatarUrl", avatarUrl)
  }

  const handleSubmit = async () => {
    try {
      setIsGeneratingInstruction(true)

      // First, prepare the prompt for GPT-4o based on current agent settings
      const languageInfo = languages.find((l) => l.code === formData.language)

      // Map voice settings to their descriptive values
      const voiceIdentityValue =
        formData.voiceIdentity === "a" ? "Assertive" : formData.voiceIdentity === "c" ? "Cautious" : "Balanced"
      const voiceDemeanorValue =
        formData.voiceDemeanor === "a" ? "Animated" : formData.voiceDemeanor === "c" ? "Calm" : "Balanced"
      const voiceToneValue =
        formData.voiceTone === "a" ? "Authoritative" : formData.voiceTone === "c" ? "Conversational" : "Balanced"
      const voiceEnthusiasmValue =
        formData.voiceEnthusiasm === "a" ? "Animated" : formData.voiceEnthusiasm === "c" ? "Calm" : "Balanced"
      const voiceFormalityValue =
        formData.voiceFormality === "a" ? "Formal" : formData.voiceFormality === "c" ? "Casual" : "Balanced"
      const voiceEmotionValue =
        formData.voiceEmotion === "a" ? "Emotive" : formData.voiceEmotion === "c" ? "Neutral" : "Balanced"
      const voiceFillerWordsValue =
        formData.voiceFillerWords === "a" ? "More" : formData.voiceFillerWords === "c" ? "Less" : "Balanced"
      const voicePacingValue =
        formData.voicePacing === "a" ? "Faster" : formData.voicePacing === "c" ? "Slower" : "Balanced"

      // Construct the prompt for GPT-4o
      const prompt = `Please summarize the configuration and behavioral instructions for the agent based on the following settings:

Language: ${languageInfo?.name || "English"} (${formData.language})

First message to the user: "${formData.firstMessage || "No first message specified"}"

Voice characteristics:
- Identity: ${voiceIdentityValue}
- Demeanor: ${voiceDemeanorValue}
- Tone: ${voiceToneValue}
- Enthusiasm: ${voiceEnthusiasmValue}
- Formality: ${voiceFormalityValue}
- Emotion: ${voiceEmotionValue}
- Filler Words: ${voiceFillerWordsValue}
- Pacing: ${voicePacingValue}

Additional note: ${formData.instruction ? "The agent has custom instructions that should be incorporated." : "No additional instructions specified."}

Provide a concise overview of how the agent is expected to behave and communicate with the user. Make sure to highlight how these voice characteristics affect its interaction style.`

      console.log("Sending prompt to GPT-4o:", prompt)

      // Make the actual API call to our route handler
      let generatedInstruction = ""

      try {
        const response = await fetch("/api/generate-instruction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        generatedInstruction = data.instruction

        console.log("Generated instruction:", generatedInstruction)
      } catch (apiError) {
        console.error("Error calling instruction API:", apiError)
        // Fall back to using the existing instruction
        generatedInstruction =
          formData.instruction ||
          `This agent speaks ${languageInfo?.name || "English"} and has a ${voiceIdentityValue.toLowerCase()} identity, ${voiceDemeanorValue.toLowerCase()} demeanor, ${voiceToneValue.toLowerCase()} tone, ${voiceEnthusiasmValue.toLowerCase()} enthusiasm, ${voiceFormalityValue.toLowerCase()} formality, ${voiceEmotionValue.toLowerCase()} emotion, ${voiceFillerWordsValue.toLowerCase()} filler words, and ${voicePacingValue.toLowerCase()} pacing.`
      }

      // Prepare the data for saving
      const saveData = {
        agentName: formData.agentName,
        avatarUrl: formData.avatarUrl,
        rawSettings: {
          language: formData.language,
          firstMessage: formData.firstMessage,
          voiceIdentity: formData.voiceIdentity,
          voiceDemeanor: formData.voiceDemeanor,
          voiceTone: formData.voiceTone,
          voiceEnthusiasm: formData.voiceEnthusiasm,
          voiceFormality: formData.voiceFormality,
          voiceEmotion: formData.voiceEmotion,
          voiceFillerWords: formData.voiceFillerWords,
          voicePacing: formData.voicePacing,
          instruction: formData.instruction, // Store original instruction in rawSettings
        },
      }

      // Add language to the head of the prompt
      const languagePrefix = `Language to speak: ${languageInfo?.name || "English"}\n\n`

      // Add voice adjustments to the instruction
      const voiceAdjustments = `
Advanced Voice Adjustments:
Identity: ${voiceIdentityValue}
Demeanor: ${voiceDemeanorValue}
Tone: ${voiceToneValue}
Enthusiasm: ${voiceEnthusiasmValue}
Formality: ${voiceFormalityValue}
Emotion: ${voiceEmotionValue}
Filler Words: ${voiceFillerWordsValue}
Pacing: ${voicePacingValue}
`

      // Add first message example if provided
      const firstMessageExample = formData.firstMessage ? `\nFirst message example: "${formData.firstMessage}"` : ""

      // Combine all parts for the final instruction
      const finalInstruction = languagePrefix + generatedInstruction + voiceAdjustments + firstMessageExample

      saveData.instruction = finalInstruction

      onSave(saveData)
    } catch (error) {
      console.error("Error generating instruction with GPT-4o:", error)
      // Fall back to the original save method if there's an error
      const languageInfo = languages.find((l) => l.code === formData.language)
      const languagePrefix = `Language to speak: ${languageInfo?.name || "English"}\n\n`

      const saveData = {
        agentName: formData.agentName,
        avatarUrl: formData.avatarUrl,
        instruction: languagePrefix + formData.instruction,
        rawSettings: {
          language: formData.language,
          firstMessage: formData.firstMessage,
          voiceIdentity: formData.voiceIdentity,
          voiceDemeanor: formData.voiceDemeanor,
          voiceTone: formData.voiceTone,
          voiceEnthusiasm: formData.voiceEnthusiasm,
          voiceFormality: formData.voiceFormality,
          voiceEmotion: formData.voiceEmotion,
          voiceFillerWords: formData.voiceFillerWords,
          voicePacing: formData.voicePacing,
          instruction: formData.instruction,
        },
      }

      onSave(saveData)
    } finally {
      setIsGeneratingInstruction(false)
    }
  }

  // Update the UI to be more modern, clean and lean with smaller text and elements

  // Replace the return statement with this more modern UI:
  return (
    <div className="relative bg-background w-full h-full flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="p-4 md:p-5 relative">
          <div className="relative z-10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 w-full">
                <TabsTrigger value="basic" className="text-xs py-1.5">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="voice" className="text-xs py-1.5">
                  Voice Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="space-y-4 w-full">
                  <div className="space-y-3">
                    <div className="flex flex-col items-center gap-2 mb-3">
                      <AvatarPicker
                        options={avatarOptions}
                        value={formData.avatarUrl}
                        onChange={handleAvatarChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="name" className="text-xs font-medium">
                          Agent Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter agent name"
                          value={formData.agentName}
                          onChange={(e) => handleChange("agentName", e.target.value)}
                          className="h-8 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="instruction" className="text-xs font-medium">
                        Instruction
                      </Label>
                      <Textarea
                        id="instruction"
                        placeholder="Provide detailed instructions for the agent..."
                        value={formData.instruction}
                        onChange={(e) => handleChange("instruction", e.target.value)}
                        className="min-h-24 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Detailed instructions for how the agent should behave and respond
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="firstMessage" className="text-xs font-medium">
                        First Message
                      </Label>
                      <Input
                        id="firstMessage"
                        placeholder="Hello! How can I assist you today?"
                        value={formData.firstMessage}
                        onChange={(e) => handleChange("firstMessage", e.target.value)}
                        className="h-8 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        The first message the agent will send to the user
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="primaryLanguage" className="text-xs font-medium">
                      Primary Language
                    </Label>
                    <Select value={formData.language} onValueChange={(value) => handleChange("language", value)}>
                      <SelectTrigger
                        id="primaryLanguage"
                        className="h-8 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                      >
                        <SelectValue placeholder="Select primary language">
                          {languages.find((l) => l.code === formData.language)?.flag}{" "}
                          {languages.find((l) => l.code === formData.language)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.code} value={language.code} className="text-xs">
                            <span className="flex items-center gap-2">
                              <span className="text-sm">{language.flag}</span> {language.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="voice">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">Voice Personality</h3>
                      <div className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
                        Advanced
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Fine-tune your agent's voice personality by selecting options from these dropdowns.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="space-y-1">
                      <Label htmlFor="voiceIdentity" className="text-xs font-medium">
                        Identity
                      </Label>
                      <Select
                        value={formData.voiceIdentity}
                        onValueChange={(value) => handleChange("voiceIdentity", value)}
                      >
                        <SelectTrigger
                          id="voiceIdentity"
                          className="h-8 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="Select identity">
                            {formData.voiceIdentity === "a"
                              ? "Assertive"
                              : formData.voiceIdentity === "c"
                                ? "Cautious"
                                : "Balanced"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a" className="text-xs">
                            Assertive
                          </SelectItem>
                          <SelectItem value="b" className="text-xs">
                            Balanced
                          </SelectItem>
                          <SelectItem value="c" className="text-xs">
                            Cautious
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Controls how confident and decisive the agent sounds. Assertive is more direct, while Cautious
                        is more thoughtful.
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="voiceDemeanor" className="text-xs font-medium">
                        Demeanor
                      </Label>
                      <Select
                        value={formData.voiceDemeanor}
                        onValueChange={(value) => handleChange("voiceDemeanor", value)}
                      >
                        <SelectTrigger
                          id="voiceDemeanor"
                          className="h-8 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="Select demeanor">
                            {formData.voiceDemeanor === "a"
                              ? "Animated"
                              : formData.voiceDemeanor === "c"
                                ? "Calm"
                                : "Balanced"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a" className="text-xs">
                            Animated
                          </SelectItem>
                          <SelectItem value="b" className="text-xs">
                            Balanced
                          </SelectItem>
                          <SelectItem value="c" className="text-xs">
                            Calm
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Affects the overall energy level. Animated is more expressive and energetic, while Calm is more
                        relaxed and steady.
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="voiceTone" className="text-xs font-medium">
                        Tone
                      </Label>
                      <Select value={formData.voiceTone} onValueChange={(value) => handleChange("voiceTone", value)}>
                        <SelectTrigger
                          id="voiceTone"
                          className="h-8 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="Select tone">
                            {formData.voiceTone === "a"
                              ? "Authoritative"
                              : formData.voiceTone === "c"
                                ? "Conversational"
                                : "Balanced"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a" className="text-xs">
                            Authoritative
                          </SelectItem>
                          <SelectItem value="b" className="text-xs">
                            Balanced
                          </SelectItem>
                          <SelectItem value="c" className="text-xs">
                            Conversational
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Determines how the agent presents information. Authoritative sounds more expert and formal,
                        while Conversational is more friendly and approachable.
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="voiceEnthusiasm" className="text-xs font-medium">
                        Enthusiasm
                      </Label>
                      <Select
                        value={formData.voiceEnthusiasm}
                        onValueChange={(value) => handleChange("voiceEnthusiasm", value)}
                      >
                        <SelectTrigger
                          id="voiceEnthusiasm"
                          className="h-8 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="Select enthusiasm">
                            {formData.voiceEnthusiasm === "a"
                              ? "Animated"
                              : formData.voiceEnthusiasm === "c"
                                ? "Calm"
                                : "Balanced"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a" className="text-xs">
                            Animated
                          </SelectItem>
                          <SelectItem value="b" className="text-xs">
                            Balanced
                          </SelectItem>
                          <SelectItem value="c" className="text-xs">
                            Calm
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Controls excitement level in speech. Animated shows more excitement and passion, while Calm
                        maintains a more reserved demeanor.
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="voiceFormality" className="text-xs font-medium">
                        Formality
                      </Label>
                      <Select
                        value={formData.voiceFormality}
                        onValueChange={(value) => handleChange("voiceFormality", value)}
                      >
                        <SelectTrigger
                          id="voiceFormality"
                          className="h-8 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="Select formality">
                            {formData.voiceFormality === "a"
                              ? "Formal"
                              : formData.voiceFormality === "c"
                                ? "Casual"
                                : "Balanced"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a" className="text-xs">
                            Formal
                          </SelectItem>
                          <SelectItem value="b" className="text-xs">
                            Balanced
                          </SelectItem>
                          <SelectItem value="c" className="text-xs">
                            Casual
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Adjusts language style. Formal uses more professional and structured language, while Casual is
                        more relaxed and colloquial.
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="voiceEmotion" className="text-xs font-medium">
                        Emotion
                      </Label>
                      <Select
                        value={formData.voiceEmotion}
                        onValueChange={(value) => handleChange("voiceEmotion", value)}
                      >
                        <SelectTrigger
                          id="voiceEmotion"
                          className="h-8 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="Select emotion">
                            {formData.voiceEmotion === "a"
                              ? "Emotive"
                              : formData.voiceEmotion === "c"
                                ? "Neutral"
                                : "Balanced"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a" className="text-xs">
                            Emotive
                          </SelectItem>
                          <SelectItem value="b" className="text-xs">
                            Balanced
                          </SelectItem>
                          <SelectItem value="c" className="text-xs">
                            Neutral
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Controls emotional expression. Emotive conveys more feelings and empathy, while Neutral
                        maintains a more even-keeled tone.
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="voiceFillerWords" className="text-xs font-medium">
                        Filler Words
                      </Label>
                      <Select
                        value={formData.voiceFillerWords}
                        onValueChange={(value) => handleChange("voiceFillerWords", value)}
                      >
                        <SelectTrigger
                          id="voiceFillerWords"
                          className="h-8 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="Select filler words">
                            {formData.voiceFillerWords === "a"
                              ? "More"
                              : formData.voiceFillerWords === "c"
                                ? "Less"
                                : "Balanced"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a" className="text-xs">
                            More
                          </SelectItem>
                          <SelectItem value="b" className="text-xs">
                            Balanced
                          </SelectItem>
                          <SelectItem value="c" className="text-xs">
                            Less
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Adjusts use of words like "um," "uh," "like," etc. More creates a more natural human-like speech
                        pattern, while Less sounds more polished.
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="voicePacing" className="text-xs font-medium">
                        Pacing
                      </Label>
                      <Select
                        value={formData.voicePacing}
                        onValueChange={(value) => handleChange("voicePacing", value)}
                      >
                        <SelectTrigger
                          id="voicePacing"
                          className="h-8 text-xs border transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="Select pacing">
                            {formData.voicePacing === "a"
                              ? "Faster"
                              : formData.voicePacing === "c"
                                ? "Slower"
                                : "Balanced"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a" className="text-xs">
                            Faster
                          </SelectItem>
                          <SelectItem value="b" className="text-xs">
                            Balanced
                          </SelectItem>
                          <SelectItem value="c" className="text-xs">
                            Slower
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Controls speech speed. Faster delivers information more quickly, while Slower is more deliberate
                        and easier to follow.
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-background p-3 border-t flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="h-7 text-xs text-black border-black">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          size="sm"
          className="gap-1.5 h-7 text-xs bg-black hover:bg-black/90 text-white"
          disabled={isSubmitting || isGeneratingInstruction}
        >
          <Sparkles className="h-3 w-3" />
          {isSubmitting || isGeneratingInstruction ? "Generating..." : "Save Agent"}
        </Button>
      </div>
    </div>
  )
}
