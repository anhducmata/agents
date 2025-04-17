"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  Bot,
  MessageSquare,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Sample transcription data
const transcriptions = [
  {
    id: "tr-1",
    agentName: "Customer Support",
    agentAvatar: "/avatars/avatar-female-13.svg",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    duration: "4m 12s",
    messageCount: 12,
    sentiment: "positive",
    status: "completed",
    summary: "User inquired about product features and pricing. Agent provided information and offered a demo.",
    transcript: [
      { role: "agent", content: "Hello! How can I help you today?", timestamp: "00:00" },
      {
        role: "user",
        content: "I'm interested in your product. Can you tell me more about the features?",
        timestamp: "00:05",
      },
      {
        role: "agent",
        content:
          "Of course! Our product offers voice assistant capabilities with customizable agents, RAG data integration, and analytics.",
        timestamp: "00:12",
      },
      { role: "user", content: "That sounds interesting. What about pricing?", timestamp: "00:30" },
      {
        role: "agent",
        content:
          "We have several pricing tiers starting at $29/month for the basic plan. Would you like me to go through the details?",
        timestamp: "00:38",
      },
      { role: "user", content: "Yes, please.", timestamp: "00:45" },
      {
        role: "agent",
        content: "The basic plan includes 1,000 conversations per month, 3 custom agents, and basic analytics...",
        timestamp: "00:48",
      },
    ],
  },
  {
    id: "tr-2",
    agentName: "Technical Support",
    agentAvatar: "/avatars/avatar-male-13.svg",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: "8m 45s",
    messageCount: 18,
    sentiment: "neutral",
    status: "completed",
    summary:
      "User reported issues with widget integration. Agent provided troubleshooting steps and resolved the issue.",
    transcript: [
      { role: "agent", content: "Hello! How can I assist you with technical support today?", timestamp: "00:00" },
      { role: "user", content: "I'm having trouble integrating the widget on my website.", timestamp: "00:08" },
      {
        role: "agent",
        content: "I'm sorry to hear that. Could you please provide more details about the issue you're experiencing?",
        timestamp: "00:15",
      },
    ],
  },
  {
    id: "tr-3",
    agentName: "Sales Assistant",
    agentAvatar: "/avatars/avatar-male-01.svg",
    userName: "Emily Chen",
    userEmail: "emily.chen@example.com",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: "5m 30s",
    messageCount: 10,
    sentiment: "positive",
    status: "completed",
    summary:
      "User requested information about enterprise plans. Agent provided details and scheduled a follow-up call.",
    transcript: [
      { role: "agent", content: "Hello! How can I help you with our products today?", timestamp: "00:00" },
      { role: "user", content: "I'm looking for information about your enterprise plans.", timestamp: "00:07" },
      {
        role: "agent",
        content:
          "I'd be happy to help with that. Our enterprise plans offer unlimited conversations, priority support, and custom integrations...",
        timestamp: "00:15",
      },
    ],
  },
  {
    id: "tr-4",
    agentName: "Customer Support",
    agentAvatar: "/avatars/avatar-female-13.svg",
    userName: "Michael Brown",
    userEmail: "michael.b@example.com",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: "3m 15s",
    messageCount: 8,
    sentiment: "negative",
    status: "completed",
    summary: "User complained about billing issues. Agent apologized and provided steps to resolve the problem.",
    transcript: [
      { role: "agent", content: "Hello! How can I help you today?", timestamp: "00:00" },
      { role: "user", content: "I was charged twice for my subscription this month.", timestamp: "00:06" },
      {
        role: "agent",
        content: "I apologize for the inconvenience. Let me look into this issue for you right away.",
        timestamp: "00:12",
      },
    ],
  },
  {
    id: "tr-5",
    agentName: "Technical Support",
    agentAvatar: "/avatars/avatar-male-13.svg",
    userName: "Alex Wilson",
    userEmail: "alex.w@example.com",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: "12m 20s",
    messageCount: 25,
    sentiment: "neutral",
    status: "completed",
    summary: "User needed help with API integration. Agent provided documentation and code examples.",
    transcript: [
      { role: "agent", content: "Hello! How can I assist you with technical support today?", timestamp: "00:00" },
      {
        role: "user",
        content: "I'm trying to integrate your API but getting authentication errors.",
        timestamp: "00:10",
      },
      {
        role: "agent",
        content: "I understand. Let's troubleshoot this together. Could you share the error message you're seeing?",
        timestamp: "00:18",
      },
    ],
  },
]

export default function ConversationHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTranscript, setSelectedTranscript] = useState<any>(null)
  const [expandedTranscripts, setExpandedTranscripts] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState("all")
  const [agentFilter, setAgentFilter] = useState("all")
  const [sentimentFilter, setSentimentFilter] = useState("all")

  const toggleExpand = (id: string) => {
    setExpandedTranscripts((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const openTranscript = (transcript: any) => {
    setSelectedTranscript(transcript)
  }

  const filteredTranscriptions = transcriptions.filter((transcript) => {
    // Search query filter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      transcript.userName.toLowerCase().includes(searchLower) ||
      transcript.userEmail.toLowerCase().includes(searchLower) ||
      transcript.agentName.toLowerCase().includes(searchLower) ||
      transcript.summary.toLowerCase().includes(searchLower)

    // Time range filter
    let matchesTimeRange = true
    const now = new Date()
    if (timeRange === "24h") {
      matchesTimeRange = now.getTime() - transcript.date.getTime() < 24 * 60 * 60 * 1000
    } else if (timeRange === "7d") {
      matchesTimeRange = now.getTime() - transcript.date.getTime() < 7 * 24 * 60 * 60 * 1000
    } else if (timeRange === "30d") {
      matchesTimeRange = now.getTime() - transcript.date.getTime() < 30 * 24 * 60 * 60 * 1000
    }

    // Agent filter
    const matchesAgent = agentFilter === "all" || transcript.agentName === agentFilter

    // Sentiment filter
    const matchesSentiment = sentimentFilter === "all" || transcript.sentiment === sentimentFilter

    return matchesSearch && matchesTimeRange && matchesAgent && matchesSentiment
  })

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Unknown date"

    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Positive</Badge>
      case "negative":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Negative</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">Neutral</Badge>
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Conversation History</h1>
          <p className="text-muted-foreground mt-1 text-sm">View and search past conversations</p>
        </div>
        <Button
          variant="default"
          size="sm"
          className="gap-2 bg-black hover:bg-black/80 text-white dark:bg-black dark:hover:bg-black/80"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, agent, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-[150px]">
              <Bot className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All agents</SelectItem>
              <SelectItem value="Customer Support">Customer Support</SelectItem>
              <SelectItem value="Technical Support">Technical Support</SelectItem>
              <SelectItem value="Sales Assistant">Sales Assistant</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setTimeRange("all")
              setAgentFilter("all")
              setSentimentFilter("all")
            }}
            className="flex items-center gap-1 h-10"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTranscriptions.length > 0 ? (
          filteredTranscriptions.map((transcript) => (
            <Card key={transcript.id} className="relative border-[0.5px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              <div className="relative z-10">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border bg-muted">
                        <img
                          src={transcript.agentAvatar || "/placeholder.svg"}
                          alt={transcript.agentName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{transcript.agentName}</CardTitle>
                        <CardDescription className="flex items-center flex-wrap gap-1 text-xs">
                          <User className="h-3 w-3" />
                          <span>
                            {transcript.userName} ({transcript.userEmail})
                          </span>
                          <span className="mx-1">-</span>
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(transcript.date)}</span>
                          <span className="mx-1">-</span>
                          <Clock className="h-3 w-3" />
                          <span>Duration: {transcript.duration}</span>
                          <span className="mx-1">-</span>
                          <MessageSquare className="h-3 w-3" />
                          <span>{transcript.messageCount} messages</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSentimentBadge(transcript.sentiment)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openTranscript(transcript)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>View Full Transcript</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{transcript.summary}</p>

                  {expandedTranscripts.includes(transcript.id) && (
                    <div className="mt-4 space-y-3 border-t border-t-[0.5px] pt-3">
                      {transcript.transcript.map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex gap-3 text-sm",
                            message.role === "agent" ? "text-primary" : "text-foreground",
                          )}
                        >
                          <div className="text-xs text-muted-foreground w-10">{message.timestamp}</div>
                          <div className="flex-1">
                            <span className="font-medium">
                              {message.role === "agent" ? transcript.agentName : transcript.userName}:{" "}
                            </span>
                            {message.content}
                          </div>
                        </div>
                      ))}
                      <div className="text-center text-xs text-muted-foreground pt-2">
                        <Button variant="link" size="sm" onClick={() => openTranscript(transcript)}>
                          View full transcript
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-t-[0.5px] p-3 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => toggleExpand(transcript.id)}
                  >
                    {expandedTranscripts.includes(transcript.id) ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" />
                        Hide preview
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" />
                        Show preview
                      </>
                    )}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="text-xs bg-black hover:bg-black/80 text-white dark:bg-black dark:hover:bg-black/80"
                    onClick={() => openTranscript(transcript)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No conversations found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedTranscript} onOpenChange={() => setSelectedTranscript(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto pb-0 border-[0.5px]">
          <DialogHeader>
            <DialogTitle>Conversation Transcript</DialogTitle>
            <DialogDescription>
              {selectedTranscript?.agentName} with {selectedTranscript?.userName} (
              {formatDate(selectedTranscript?.date)})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{selectedTranscript?.date ? selectedTranscript.date.toLocaleString() : "Unknown date"}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Duration: {selectedTranscript?.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                {selectedTranscript && getSentimentBadge(selectedTranscript.sentiment)}
              </div>
            </div>

            <div className="border-[0.5px] rounded-lg p-4 bg-muted/20">
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">{selectedTranscript?.summary}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium mb-2">Full Transcript</h4>
              <div className="space-y-3">
                {selectedTranscript?.transcript.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3 p-3 rounded-lg",
                      message.role === "agent" ? "bg-primary/10 text-primary" : "bg-muted text-foreground",
                    )}
                  >
                    <div className="text-xs text-muted-foreground w-10">{message.timestamp}</div>
                    <div className="flex-1">
                      <span className="font-medium">
                        {message.role === "agent" ? selectedTranscript.agentName : selectedTranscript.userName}:{" "}
                      </span>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
