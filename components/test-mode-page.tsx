"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AIInput } from "@/components/ui/ai-input"

type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  agent?: string
}

export default function TestModePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I assist you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState("Copywriter Agent")
  const [selectedAgentIcon, setSelectedAgentIcon] = useState("Pencil")

  const handleSend = (input: string, agent: string) => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      agent,
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate assistant response after a short delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${input}"`,
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      // Starting recording
      console.log("Voice recording started")
    } else {
      // Stopping recording - simulate a voice message
      console.log("Voice recording stopped")

      const voiceMessage: Message = {
        id: Date.now().toString(),
        content: "This is a simulated voice message",
        sender: "user",
        timestamp: new Date(),
        agent: selectedAgent,
      }

      setMessages((prev) => [...prev, voiceMessage])

      // Simulate assistant response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I received your voice message and processed it.",
          sender: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }, 1000)
    }
  }

  const handleAgentChange = (agent: string, icon?: string) => {
    setSelectedAgent(agent)
    if (icon) {
      setSelectedAgentIcon(icon)
    }
  }

  const resetConversation = () => {
    setMessages([
      {
        id: "reset",
        content: "Hello! How can I assist you today?",
        sender: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="h-full">
      <div className="flex flex-col p-6 overflow-hidden h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Test Your Agent</h1>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={resetConversation}
              className="gap-2 bg-black hover:bg-black/80 text-white dark:bg-black dark:hover:bg-black/80"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Conversation
            </Button>
          </div>
        </div>

        <Card className="flex-1 mb-6 overflow-hidden rounded-2xl shadow-sm border-[0.5px]">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 p-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex animate-in fade-in-0 zoom-in-95 duration-300",
                    message.sender === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {message.content}
                    {message.agent && <div className="text-[10px] mt-1 opacity-70">via {message.agent}</div>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Display selected agent name outside the textbox */}
        <div className="text-xs text-black/50 dark:text-white/50 mb-2 ml-2">{selectedAgent}</div>

        {/* Input component with agent selection */}
        <AIInput
          variant="default"
          onSubmit={handleSend}
          onVoiceToggle={toggleVoiceRecording}
          selectedAgent={selectedAgent}
          onAgentChange={handleAgentChange}
        />

        {/* Voice recording indicator */}
        {isRecording && (
          <div className="text-center text-sm text-red-500 animate-pulse mt-2">
            Recording... Click the microphone again to stop.
          </div>
        )}
      </div>
    </div>
  )
}
