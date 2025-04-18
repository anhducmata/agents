"use client"

import type React from "react"

import { useState } from "react"
import {
  Plus,
  Wrench,
  Code,
  Database,
  Globe,
  Zap,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Sparkles,
  Bot,
  Terminal,
  Check,
  Lock,
  Key,
  FileKey,
  ClipboardCopy,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { getMethodColor, getCategoryIcon, formatTimeAgo, parseCurlCommand, generateCurlCommand } from "@/lib/tool-utils"

// First, add the Tabs import at the top with the other imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample tools data
const initialTools = [
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    description: "Retrieve information from knowledge base",
    method: "GET",
    url: "https://api.example.com/knowledge",
    category: "data",
    usageCount: 1243,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    agents: ["Customer Support", "Sales"],
  },
  {
    id: "order-lookup",
    name: "Order Lookup",
    description: "Look up customer order details",
    method: "GET",
    url: "https://api.example.com/orders",
    category: "data",
    usageCount: 856,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    agents: ["Customer Support", "Shipping"],
  },
  {
    id: "ticket-creation",
    name: "Ticket Creation",
    description: "Create support tickets",
    method: "POST",
    url: "https://api.example.com/tickets",
    category: "action",
    usageCount: 427,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    agents: ["Customer Support"],
  },
  {
    id: "product-catalog",
    name: "Product Catalog",
    description: "Browse product information",
    method: "GET",
    url: "https://api.example.com/products",
    category: "data",
    usageCount: 1892,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    agents: ["Sales", "Marketing", "Customer Support"],
  },
  {
    id: "pricing-calculator",
    name: "Pricing Calculator",
    description: "Calculate product pricing",
    method: "GET",
    url: "https://api.example.com/pricing",
    category: "utility",
    usageCount: 634,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    agents: ["Sales"],
  },
  {
    id: "order-processing",
    name: "Order Processing",
    description: "Process customer orders",
    method: "POST",
    url: "https://api.example.com/orders/process",
    category: "action",
    usageCount: 312,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    agents: ["Sales", "Shipping"],
  },
]

// Mock data for available secrets (in a real app, this would be fetched from the secrets management system)
const availableSecrets = [
  { id: "ba1", type: "basicAuth", name: "CRM System", username: "admin", password: "password123" },
  { id: "ba2", type: "basicAuth", name: "Analytics API", username: "service_account", password: "api_secret_2023" },
  { id: "ak1", type: "apiKey", name: "OpenAI API", key: "sk_test_51HZIrULkdIwIHZIrULkdIwIH" },
  { id: "ak2", type: "Maps API", key: "AIzaSyBFw0Qbyg9T5rXlL4Ssomething" },
  {
    id: "bt1",
    type: "bearerToken",
    name: "Auth0 Management",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w",
  },
  { id: "sv1", type: "secretVar", name: "DATABASE_URL", value: "postgres://user:password@localhost:5432/mydb" },
  { id: "sv2", type: "secretVar", name: "SMTP_PASSWORD", value: "mail_password_2023" },
]

export default function ToolsPage({ onNavigateToAgent }: { onNavigateToAgent?: (agentName: string) => void }) {
  const [tools, setTools] = useState(initialTools)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTool, setCurrentTool] = useState<any>(null)
  const [filter, setFilter] = useState("all")
  const [newHeader, setNewHeader] = useState({ key: "", value: "" })
  const [searchQuery, setSearchQuery] = useState("")

  // First, add a new state for parameters near the other state declarations (around line 100)
  const [newParameter, setNewParameter] = useState({
    name: "",
    type: "string",
    required: false,
    description: "",
    location: "query",
    default: "",
  })

  // Add state for the confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  // Then, add a state for the cURL import dialog
  const [curlImportOpen, setCurlImportOpen] = useState(false)
  const [curlCommand, setCurlCommand] = useState("")

  // Add this with the other state declarations
  const [isJsonValid, setIsJsonValid] = useState(false)

  const handleNewTool = () => {
    setCurrentTool({
      id: "",
      name: "",
      description: "",
      method: "GET",
      url: "",
      category: "data",
      headers: [],
      parameters: [], // Add this line
      body: "",
      authentication: {
        type: "none",
        username: "",
        password: "",
        apiKeyName: "",
        apiKeyValue: "",
        bearerToken: "",
      },
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      agents: [],
    })
    setIsEditing(true)
  }

  const handleEditTool = (tool: any) => {
    // Ensure tool has all required properties
    const toolToEdit = {
      ...tool,
      headers: tool.headers || [],
      body: tool.body || "",
      authentication: tool.authentication || {
        type: "none",
        username: "",
        password: "",
        apiKeyName: "",
        apiKeyValue: "",
        bearerToken: "",
      },
      agents: tool.agents || [],
    }
    setCurrentTool(toolToEdit)
    setIsEditing(true)
  }

  const handleDuplicateTool = (tool: any) => {
    const duplicatedTool = {
      ...tool,
      id: `${tool.id}-copy-${Date.now()}`,
      name: `${tool.name} (Copy)`,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTools([...tools, duplicatedTool])
  }

  const handleDeleteTool = (toolId: string) => {
    setTools(tools.filter((tool) => tool.id !== toolId))
  }

  const addHeader = () => {
    if (newHeader.key.trim() && newHeader.value.trim()) {
      setCurrentTool({
        ...currentTool,
        headers: [...(currentTool.headers || []), { ...newHeader }],
      })
      setNewHeader({ key: "", value: "" })
    }
  }

  // Then, add a function to handle adding parameters (after the addHeader function)
  const addParameter = () => {
    if (newParameter.name.trim()) {
      setCurrentTool({
        ...currentTool,
        parameters: [...(currentTool.parameters || []), { ...newParameter }],
      })
      setNewParameter({ name: "", type: "string", required: false, description: "", location: "query", default: "" })
    }
  }

  const removeHeader = (index: number) => {
    const updatedHeaders = [...currentTool.headers]
    updatedHeaders.splice(index, 1)
    setCurrentTool({ ...currentTool, headers: updatedHeaders })
  }

  // Add a function to remove parameters (after the removeHeader function)
  const removeParameter = (index: number) => {
    const updatedParameters = [...currentTool.parameters]
    updatedParameters.splice(index, 1)
    setCurrentTool({ ...currentTool, parameters: updatedParameters })
  }

  const handleSaveTool = () => {
    // Generate an ID if it's a new tool
    const toolToSave = { ...currentTool }
    if (!toolToSave.id) {
      toolToSave.id = toolToSave.name.toLowerCase().replace(/\s+/g, "-")
    }

    // Update or add the tool
    if (tools.some((tool) => tool.id === toolToSave.id)) {
      setTools(tools.map((tool) => (tool.id === toolToSave.id ? { ...toolToSave, updatedAt: new Date() } : tool)))
    } else {
      setTools([...tools, { ...toolToSave, createdAt: new Date(), updatedAt: new Date() }])
    }

    setIsEditing(false)
    setCurrentTool(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setCurrentTool(null)
  }

  const filteredTools = tools.filter((tool) => {
    // Apply category or method filter if not "all"
    const matchesFilter = filter === "all" || tool.category === filter || tool.method === filter

    // Apply search filter if search query exists
    const matchesSearch =
      searchQuery === "" ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.url.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  // Updated to show confirmation dialog
  const handleAgentClick = (agentName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedAgent(agentName)
    setConfirmDialogOpen(true)
  }

  // Function to handle confirmation
  const handleConfirmNavigation = () => {
    if (selectedAgent && onNavigateToAgent) {
      onNavigateToAgent(selectedAgent)
    }
    setConfirmDialogOpen(false)
    setSelectedAgent(null)
  }

  // Add this function to handle the import
  const handleCurlImport = () => {
    const parsedData = parseCurlCommand(curlCommand)
    if (parsedData) {
      // Merge the parsed data with the current tool
      setCurrentTool({
        ...currentTool,
        method: parsedData.method,
        url: parsedData.url,
        headers: parsedData.headers,
        parameters: parsedData.parameters || [], // Add this line to include parameters
        body: parsedData.body,
        bodyType: parsedData.bodyType,
        authentication: parsedData.authentication,
      })
      setCurlImportOpen(false)
      setCurlCommand("")
    }
  }

  // Add this function before the return statement
  const validateJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setIsJsonValid(false)
      return
    }

    try {
      JSON.parse(jsonString)
      setIsJsonValid(true)
    } catch (e) {
      setIsJsonValid(false)
    }
  }

  // Add a function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // You could add a toast notification here
        console.log("Copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tools</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create and manage tools for your voice assistant</p>
        </div>
        <Button onClick={handleNewTool} size="sm" className="gap-2 bg-black hover:bg-black/90 text-white">
          <Plus className="h-4 w-4" />
          New Tool
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div className="mb-6">
        <ToolFilters filter={filter} setFilter={setFilter} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <Card
            key={tool.id}
            className="relative overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => handleEditTool(tool)}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
            <div className="relative z-10">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-medium px-2 py-1 rounded-full", getMethodColor(tool.method))}>
                      {tool.method}
                    </span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getCategoryIcon(tool.category) === "Database" && <Database className="h-4 w-4" />}
                      {getCategoryIcon(tool.category) === "Zap" && <Zap className="h-4 w-4" />}
                      {getCategoryIcon(tool.category) === "Wrench" && <Wrench className="h-4 w-4" />}
                      {getCategoryIcon(tool.category) === "Globe" && <Globe className="h-4 w-4" />}
                      {getCategoryIcon(tool.category) === "Code" && <Code className="h-4 w-4" />}
                      <span className="capitalize">{tool.category}</span>
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditTool(tool)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateTool(tool)}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Duplicate</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteTool(tool.id)}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl mt-2">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-3">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground">URL</div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <Globe className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground mt-0.5" />
                      <span className="break-all">{tool.url}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground">Agents</div>
                    <div className="flex flex-wrap gap-1.5">
                      {tool.agents?.length ? (
                        tool.agents.map((agent, index) => (
                          <button
                            key={index}
                            onClick={(e) => handleAgentClick(agent, e)}
                            className="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
                          >
                            {agent}
                          </button>
                        ))
                      ) : (
                        <span className="text-xs">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-3 flex justify-between text-xs text-muted-foreground">
                <div>Used {tool.usageCount} times</div>
                <div>Updated {formatTimeAgo(tool.updatedAt)}</div>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md border-[0.5px]">
          <DialogHeader>
            <DialogTitle>Navigate to Agent</DialogTitle>
            <DialogDescription>
              Do you want to navigate to the Agents tab and open the "{selectedAgent}" agent?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmNavigation} className="gap-2">
              <Bot className="h-4 w-4" />
              Go to Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isEditing && currentTool && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="relative bg-background w-[60vw] h-[95vh] flex flex-col shadow-lg animate-in zoom-in-90 duration-300 rounded-lg border-[0.5px]">
            {/* Add the background pattern div */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

            {/* Make the content relative to appear above the background */}
            <div className="relative z-10 h-full flex flex-col">
              <div className="sticky top-0 bg-background z-50 flex justify-between items-center p-6 border-b">
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">
                    {currentTool.id ? `Edit ${currentTool.name}` : "Create New Tool"}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-9 text-xs text-black border-black"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveTool}
                    size="sm"
                    className="gap-2 h-9 text-xs bg-black hover:bg-black/90 text-white"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Save Tool
                  </Button>
                </div>
              </div>

              {/* Content area with a single scrollbar */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Add the background pattern div */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

                  <div className="relative z-10">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid grid-cols-2 mb-6">
                        <TabsTrigger value="basic">Basic Information</TabsTrigger>
                        <TabsTrigger value="request">Request Information</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                              Tool Name
                            </Label>
                            <Input
                              id="name"
                              placeholder="Enter tool name"
                              value={currentTool.name}
                              onChange={(e) => setCurrentTool({ ...currentTool, name: e.target.value })}
                              className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              placeholder="Describe what this tool does"
                              value={currentTool.description}
                              onChange={(e) => setCurrentTool({ ...currentTool, description: e.target.value })}
                              className="min-h-[80px] text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="category" className="text-sm font-medium">
                              Category
                            </Label>
                            <Select
                              value={currentTool.category}
                              onValueChange={(value) => setCurrentTool({ ...currentTool, category: value })}
                            >
                              <SelectTrigger
                                id="category"
                                className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                              >
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="data">Data</SelectItem>
                                <SelectItem value="action">Action</SelectItem>
                                <SelectItem value="utility">Utility</SelectItem>
                                <SelectItem value="integration">Integration</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="request" className="space-y-6">
                        {/* Request Information */}
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Request Information</h3>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(generateCurlCommand(currentTool))}
                              className="gap-2 text-xs"
                            >
                              <ClipboardCopy className="h-3.5 w-3.5" />
                              Copy as cURL
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurlImportOpen(true)}
                              className="gap-2 text-xs"
                            >
                              <Terminal className="h-3.5 w-3.5" />
                              Import from cURL
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-10 gap-4">
                            <div className="col-span-3 space-y-2">
                              <Label htmlFor="method" className="text-sm font-medium">
                                Method
                              </Label>
                              <Select
                                value={currentTool.method}
                                onValueChange={(value) => setCurrentTool({ ...currentTool, method: value })}
                              >
                                <SelectTrigger
                                  id="method"
                                  className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                >
                                  <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="GET">GET</SelectItem>
                                  <SelectItem value="POST">POST</SelectItem>
                                  <SelectItem value="PUT">PUT</SelectItem>
                                  <SelectItem value="DELETE">DELETE</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="col-span-7 space-y-2">
                              <Label htmlFor="url" className="text-sm font-medium">
                                URL
                              </Label>
                              <Input
                                id="url"
                                placeholder="https://api.example.com/endpoint"
                                value={currentTool.url}
                                onChange={(e) => setCurrentTool({ ...currentTool, url: e.target.value })}
                                className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </div>
                          </div>

                          {/* Authentication Section */}
                          <div className="space-y-4 border-t pt-6">
                            <h3 className="text-lg font-medium">Authentication</h3>

                            <div className="space-y-4">
                              <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="auth-type" className="text-sm font-medium">
                                  Authentication Type
                                </Label>
                                <Select
                                  value={currentTool.authentication?.type || "none"}
                                  onValueChange={(value) =>
                                    setCurrentTool({
                                      ...currentTool,
                                      authentication: { ...currentTool.authentication, type: value },
                                    })
                                  }
                                >
                                  <SelectTrigger
                                    id="auth-type"
                                    className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                  >
                                    <SelectValue placeholder="Select authentication type">
                                      {currentTool.authentication?.type && (
                                        <div className="flex items-center gap-2">
                                          {currentTool.authentication.type === "none" && <Globe className="h-4 w-4" />}
                                          {currentTool.authentication.type === "basic" && <Lock className="h-4 w-4" />}
                                          {currentTool.authentication.type === "apiKey" && <Key className="h-4 w-4" />}
                                          {currentTool.authentication.type === "bearer" && (
                                            <FileKey className="h-4 w-4" />
                                          )}
                                          <span>
                                            {currentTool.authentication.type === "none"
                                              ? "None"
                                              : currentTool.authentication.type === "basic"
                                                ? "Basic Auth"
                                                : currentTool.authentication.type === "apiKey"
                                                  ? "API Key"
                                                  : "Bearer Token"}
                                          </span>
                                        </div>
                                      )}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        <span>None</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="basic">
                                      <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        <span>Basic Auth</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="apiKey">
                                      <div className="flex items-center gap-2">
                                        <Key className="h-4 w-4" />
                                        <span>API Key</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="bearer">
                                      <div className="flex items-center gap-2">
                                        <FileKey className="h-4 w-4" />
                                        <span>Bearer Token</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {currentTool.authentication?.type === "basic" && (
                                <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                                  <div className="grid grid-cols-1 gap-2">
                                    <Label htmlFor="auth-secret" className="text-sm font-medium">
                                      Select Basic Auth Secret
                                    </Label>
                                    <Select
                                      value={currentTool.authentication?.secretId || ""}
                                      onValueChange={(value) => {
                                        const selectedSecret = availableSecrets.find((s) => s.id === value)
                                        setCurrentTool({
                                          ...currentTool,
                                          authentication: {
                                            ...currentTool.authentication,
                                            secretId: value,
                                            username: selectedSecret?.username || "",
                                            password: selectedSecret?.password || "",
                                          },
                                          ...currentTool,
                                          authentication: {
                                            ...currentTool.authentication,
                                            secretId: value,
                                            username: selectedSecret?.username || "",
                                            password: selectedSecret?.password || "",
                                          },
                                        })
                                      }}
                                    >
                                      <SelectTrigger
                                        id="auth-secret"
                                        className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                      >
                                        {/* Update the Basic Auth secret SelectValue to show the last 5 characters of the password: */}
                                        <SelectValue placeholder="Select a saved secret">
                                          {currentTool.authentication?.secretId && (
                                            <span>
                                              {currentTool.authentication.secretId === "manual"
                                                ? "Manual Entry"
                                                : availableSecrets.find(
                                                    (s) => s.id === currentTool.authentication?.secretId,
                                                  )?.name +
                                                  (availableSecrets.find(
                                                    (s) => s.id === currentTool.authentication?.secretId,
                                                  )?.username &&
                                                  availableSecrets.find(
                                                    (s) => s.id === currentTool.authentication?.secretId,
                                                  )?.password
                                                    ? ` - ${availableSecrets.find((s) => s.id === currentTool.authentication?.secretId)?.username}/****${availableSecrets.find((s) => s.id === currentTool.authentication?.secretId)?.password.slice(-5)}`
                                                    : "")}
                                            </span>
                                          )}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableSecrets
                                          .filter((secret) => secret.type === "basicAuth")
                                          .map((secret) => (
                                            <SelectItem key={secret.id} value={secret.id}>
                                              <div className="flex items-center gap-2">
                                                <Lock className="h-4 w-4" />
                                                <span>{secret.name}</span>
                                              </div>
                                            </SelectItem>
                                          ))}
                                        <SelectItem value="manual">
                                          <div className="flex items-center gap-2">
                                            <Edit className="h-4 w-4" />
                                            <span>Enter Manually</span>
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {currentTool.authentication?.secretId === "manual" && (
                                    <>
                                      <div className="grid grid-cols-1 gap-2">
                                        <Label htmlFor="auth-username" className="text-sm font-medium">
                                          Username
                                        </Label>
                                        <Input
                                          id="auth-username"
                                          value={currentTool.authentication?.username || ""}
                                          onChange={(e) =>
                                            setCurrentTool({
                                              ...currentTool,
                                              authentication: {
                                                ...currentTool.authentication,
                                                username: e.target.value,
                                              },
                                            })
                                          }
                                          className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                      </div>
                                      <div className="grid grid-cols-1 gap-2">
                                        <Label htmlFor="auth-password" className="text-sm font-medium">
                                          Password
                                        </Label>
                                        <Input
                                          id="auth-password"
                                          type="password"
                                          value={currentTool.authentication?.password || ""}
                                          onChange={(e) =>
                                            setCurrentTool({
                                              ...currentTool,
                                              authentication: {
                                                ...currentTool.authentication,
                                                password: e.target.value,
                                              },
                                            })
                                          }
                                          className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}

                              {currentTool.authentication?.type === "apiKey" && (
                                <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                                  <div className="grid grid-cols-1 gap-2">
                                    <Label htmlFor="auth-api-secret" className="text-sm font-medium">
                                      Select API Key Secret
                                    </Label>
                                    <Select
                                      value={currentTool.authentication?.secretId || ""}
                                      onValueChange={(value) => {
                                        const selectedSecret = availableSecrets.find((s) => s.id === value)
                                        setCurrentTool({
                                          ...currentTool,
                                          authentication: {
                                            ...currentTool.authentication,
                                            secretId: value,
                                            apiKeyName:
                                              value === "manual"
                                                ? ""
                                                : currentTool.authentication?.apiKeyName || "X-API-Key",
                                            apiKeyValue: selectedSecret?.key || "",
                                          },
                                        })
                                      }}
                                    >
                                      <SelectTrigger
                                        id="auth-api-secret"
                                        className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                      >
                                        {/* Update the API Key secret SelectValue to show the last 5 characters of the key: */}
                                        <SelectValue placeholder="Select a saved secret">
                                          {currentTool.authentication?.secretId && (
                                            <span className="text-sm">
                                              {currentTool.authentication.secretId === "manual" ? (
                                                "Manual Entry"
                                              ) : (
                                                <>
                                                  {
                                                    availableSecrets.find(
                                                      (s) => s.id === currentTool.authentication?.secretId,
                                                    )?.name
                                                  }
                                                  {currentTool.authentication.secretId !== "manual" &&
                                                    availableSecrets.find(
                                                      (s) => s.id === currentTool.authentication?.secretId,
                                                    )?.key && (
                                                      <span className="text-xs text-muted-foreground ml-1">
                                                        : Key: {currentTool.authentication.apiKeyName || "X-API-Key"},
                                                        Value: ****
                                                        {availableSecrets
                                                          .find((s) => s.id === currentTool.authentication?.secretId)
                                                          ?.key.slice(-5)}
                                                      </span>
                                                    )}
                                                </>
                                              )}
                                            </span>
                                          )}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableSecrets
                                          .filter((secret) => secret.type === "apiKey")
                                          .map((secret) => (
                                            <SelectItem key={secret.id} value={secret.id}>
                                              <div className="flex items-center gap-2">
                                                <Key className="h-4 w-4" />
                                                <span>{secret.name}</span>
                                              </div>
                                            </SelectItem>
                                          ))}
                                        <SelectItem value="manual">
                                          <div className="flex items-center gap-2">
                                            <Edit className="h-4 w-4" />
                                            <span>Enter Manually</span>
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {currentTool.authentication?.secretId === "manual" && (
                                    <>
                                      <div className="grid grid-cols-1 gap-2">
                                        <Label htmlFor="auth-apikey-name" className="text-sm font-medium">
                                          Key Name
                                        </Label>
                                        <Input
                                          id="auth-apikey-name"
                                          placeholder="X-API-Key"
                                          value={currentTool.authentication?.apiKeyName || ""}
                                          onChange={(e) =>
                                            setCurrentTool({
                                              ...currentTool,
                                              authentication: {
                                                ...currentTool.authentication,
                                                apiKeyName: e.target.value,
                                              },
                                            })
                                          }
                                          className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                      </div>
                                      <div className="grid grid-cols-1 gap-2">
                                        <Label htmlFor="auth-apikey-value" className="text-sm font-medium">
                                          Key Value
                                        </Label>
                                        <Input
                                          id="auth-apikey-value"
                                          value={currentTool.authentication?.apiKeyValue || ""}
                                          onChange={(e) =>
                                            setCurrentTool({
                                              ...currentTool,
                                              authentication: {
                                                ...currentTool.authentication,
                                                apiKeyValue: e.target.value,
                                              },
                                            })
                                          }
                                          className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}

                              {currentTool.authentication?.type === "bearer" && (
                                <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                                  <div className="grid grid-cols-1 gap-2">
                                    <Label htmlFor="auth-bearer-secret" className="text-sm font-medium">
                                      Select Bearer Token Secret
                                    </Label>
                                    <Select
                                      value={currentTool.authentication?.secretId || ""}
                                      onValueChange={(value) => {
                                        const selectedSecret = availableSecrets.find((s) => s.id === value)
                                        setCurrentTool({
                                          ...currentTool,
                                          authentication: {
                                            ...currentTool.authentication,
                                            secretId: value,
                                            bearerToken: selectedSecret?.token || "",
                                          },
                                        })
                                      }}
                                    >
                                      <SelectTrigger
                                        id="auth-bearer-secret"
                                        className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                      >
                                        {/* Update the Bearer Token secret SelectValue to show the last 5 characters of the token: */}
                                        <SelectValue placeholder="Select a saved secret">
                                          {currentTool.authentication?.secretId && (
                                            <div className="flex items-center gap-2">
                                              <FileKey className="h-4 w-4" />
                                              <span>
                                                {currentTool.authentication.secretId === "manual"
                                                  ? "Manual Entry"
                                                  : availableSecrets.find(
                                                      (s) => s.id === currentTool.authentication?.secretId,
                                                    )?.name || ""}
                                              </span>
                                              {currentTool.authentication.secretId !== "manual" &&
                                                availableSecrets.find(
                                                  (s) => s.id === currentTool.authentication?.secretId,
                                                )?.token && (
                                                  <span className="text-xs text-muted-foreground ml-1">
                                                    •••••
                                                    {availableSecrets
                                                      .find((s) => s.id === currentTool.authentication?.secretId)
                                                      ?.token.slice(-5)}
                                                  </span>
                                                )}
                                            </div>
                                          )}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableSecrets
                                          .filter((secret) => secret.type === "bearerToken")
                                          .map((secret) => (
                                            <SelectItem key={secret.id} value={secret.id}>
                                              <div className="flex items-center gap-2">
                                                <FileKey className="h-4 w-4" />
                                                <span>{secret.name}</span>
                                              </div>
                                            </SelectItem>
                                          ))}
                                        <SelectItem value="manual">
                                          <div className="flex items-center gap-2">
                                            <Edit className="h-4 w-4" />
                                            <span>Enter Manually</span>
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {currentTool.authentication?.secretId === "manual" && (
                                    <div className="grid grid-cols-1 gap-2">
                                      <Label htmlFor="auth-bearer" className="text-sm font-medium">
                                        Token
                                      </Label>
                                      <Input
                                        id="auth-bearer"
                                        value={currentTool.authentication?.bearerToken || ""}
                                        onChange={(e) =>
                                          setCurrentTool({
                                            ...currentTool,
                                            authentication: {
                                              ...currentTool.authentication,
                                              bearerToken: e.target.value,
                                            },
                                          })
                                        }
                                        className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Headers Section */}
                          <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium">Headers</h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addHeader}
                                className="h-8 gap-1 text-xs"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add Header
                              </Button>
                            </div>

                            <div className="space-y-3">
                              {currentTool.headers?.length > 0 ? (
                                <div className="border rounded-md overflow-hidden bg-white">
                                  <div className="grid grid-cols-[1fr,1fr,auto] bg-muted/20 border-b">
                                    <div className="px-3 py-2 text-sm font-medium">Header</div>
                                    <div className="px-3 py-2 text-sm font-medium">Value</div>
                                    <div className="px-3 py-2 w-9"></div>
                                  </div>
                                  {currentTool.headers.map((header, index) => (
                                    <div key={index} className="grid grid-cols-[1fr,1fr,auto] border-b last:border-b-0">
                                      <div className="px-3 py-2">
                                        <Input
                                          value={header.key}
                                          onChange={(e) => {
                                            const updatedHeaders = [...currentTool.headers]
                                            updatedHeaders[index].key = e.target.value
                                            setCurrentTool({ ...currentTool, headers: updatedHeaders })
                                          }}
                                          placeholder="Header name"
                                          className="h-8 text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                                        />
                                      </div>
                                      <div className="px-3 py-2">
                                        <Input
                                          value={header.value}
                                          onChange={(e) => {
                                            const updatedHeaders = [...currentTool.headers]
                                            updatedHeaders[index].value = e.target.value
                                            setCurrentTool({ ...currentTool, headers: updatedHeaders })
                                          }}
                                          placeholder="Header value"
                                          className="h-8 text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                                        />
                                      </div>
                                      <div className="px-3 py-2 flex items-center justify-center">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeHeader(index)}
                                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Remove header</span>
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No headers defined.</p>
                              )}
                            </div>
                          </div>

                          {/* Parameters Section */}
                          <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium">Parameters</h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addParameter}
                                className="h-8 gap-1 text-xs"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add Parameter
                              </Button>
                            </div>

                            <div className="space-y-3">
                              {currentTool.parameters?.length > 0 ? (
                                <div className="border rounded-md overflow-hidden bg-white">
                                  <div className="grid grid-cols-[1fr,1fr,auto] bg-muted/20 border-b">
                                    <div className="px-3 py-2 text-sm font-medium">Parameter</div>
                                    <div className="px-3 py-2 text-sm font-medium">Value</div>
                                    <div className="px-3 py-2 w-9"></div>
                                  </div>
                                  {currentTool.parameters.map((parameter, index) => (
                                    <div key={index} className="grid grid-cols-[1fr,1fr,auto] border-b last:border-b-0">
                                      <div className="px-3 py-2">
                                        <Input
                                          value={parameter.name}
                                          onChange={(e) => {
                                            const updatedParameters = [...currentTool.parameters]
                                            updatedParameters[index].name = e.target.value
                                            setCurrentTool({ ...currentTool, parameters: updatedParameters })
                                          }}
                                          placeholder="Parameter name"
                                          className="h-8 text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                                        />
                                      </div>
                                      <div className="px-3 py-2">
                                        <Input
                                          value={parameter.default || ""}
                                          onChange={(e) => {
                                            const updatedParameters = [...currentTool.parameters]
                                            updatedParameters[index].default = e.target.value
                                            setCurrentTool({ ...currentTool, parameters: updatedParameters })
                                          }}
                                          placeholder="Parameter value"
                                          className="h-8 text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                                        />
                                      </div>
                                      <div className="px-3 py-2 flex items-center justify-center">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeParameter(index)}
                                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Remove parameter</span>
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No parameters defined.</p>
                              )}
                            </div>
                          </div>

                          {/* Request Body Section */}
                          {(currentTool.method === "POST" ||
                            currentTool.method === "PUT" ||
                            currentTool.method === "DELETE") && (
                            <div className="space-y-4 border-t pt-6">
                              <h3 className="text-lg font-medium">Request Body</h3>

                              <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-2">
                                  <Label htmlFor="body-type" className="text-sm font-medium">
                                    Body Type
                                  </Label>
                                  <Select
                                    value={currentTool.bodyType || "json"}
                                    onValueChange={(value) => setCurrentTool({ ...currentTool, bodyType: value })}
                                  >
                                    <SelectTrigger
                                      id="body-type"
                                      className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                    >
                                      <SelectValue placeholder="Select body type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="json">JSON</SelectItem>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="file">File</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {currentTool.bodyType === "json" || !currentTool.bodyType ? (
                                  <div className="space-y-2">
                                    <Label htmlFor="body-json" className="text-sm font-medium flex items-center gap-2">
                                      JSON Body
                                      {isJsonValid && currentTool.body && (
                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                      )}
                                    </Label>
                                    <Textarea
                                      id="body-json"
                                      placeholder='{"key": "value"}'
                                      value={currentTool.body || ""}
                                      onChange={(e) => {
                                        setCurrentTool({ ...currentTool, body: e.target.value })
                                        validateJson(e.target.value)
                                      }}
                                      className="font-mono text-sm min-h-[150px] border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                  </div>
                                ) : currentTool.bodyType === "text" ? (
                                  <div className="space-y-2">
                                    <Label htmlFor="body-text" className="text-sm font-medium">
                                      Text Body
                                    </Label>
                                    <Textarea
                                      id="body-text"
                                      placeholder="Enter plain text content"
                                      value={currentTool.body || ""}
                                      onChange={(e) => setCurrentTool({ ...currentTool, body: e.target.value })}
                                      className="text-sm min-h-[150px] border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <Label htmlFor="body-file" className="text-sm font-medium">
                                      File Upload
                                    </Label>
                                    <div className="border-[0.5px] border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                      <input
                                        type="file"
                                        id="body-file"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0]
                                          if (file) {
                                            setCurrentTool({
                                              ...currentTool,
                                              bodyFileName: file.name,
                                              // In a real app, you'd handle the file upload here
                                            })
                                          }
                                        }}
                                      />
                                      <label htmlFor="body-file" className="cursor-pointer">
                                        <div className="flex flex-col items-center">
                                          <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                                          <p className="text-sm font-medium">
                                            {currentTool.bodyFileName || "Click to upload a file"}
                                          </p>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            Supports various file formats (max 10MB)
                                          </p>
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* cURL Import Dialog */}
      <Dialog open={curlImportOpen} onOpenChange={setCurlImportOpen}>
        <DialogContent className="sm:max-w-md border-[0.5px]">
          <DialogHeader>
            <DialogTitle>Import from cURL</DialogTitle>
            <DialogDescription>Paste a cURL command to import its configuration.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="curl -X POST https://api.example.com/endpoint -H 'Content-Type: application/json'"
              value={curlCommand}
              onChange={(e) => setCurlCommand(e.target.value)}
              className="font-mono text-sm min-h-[150px]"
            />
            <div className="text-xs text-muted-foreground">
              Supports common cURL options including -X, -H, -d, and -u for authentication.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCurlImportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCurlImport} className="gap-2">
              <Terminal className="h-4 w-4" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Button-based filters similar to the RAG Data page
function ToolFilters({ filter, setFilter }: { filter: string; setFilter: (filter: string) => void }) {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("all")}
        className={filter === "all" ? "bg-black text-white" : ""}
      >
        All
      </Button>
      <Button
        variant={filter === "data" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("data")}
        className={filter === "data" ? "bg-black text-white" : ""}
      >
        Data
      </Button>
      <Button
        variant={filter === "action" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("action")}
        className={filter === "action" ? "bg-black text-white" : ""}
      >
        Action
      </Button>
      <Button
        variant={filter === "utility" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("utility")}
        className={filter === "utility" ? "bg-black text-white" : ""}
      >
        Utility
      </Button>
      <Button
        variant={filter === "integration" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("integration")}
        className={filter === "integration" ? "bg-black text-white" : ""}
      >
        Integration
      </Button>
      <Button
        variant={filter === "GET" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("GET")}
        className={filter === "GET" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
      >
        GET
      </Button>
      <Button
        variant={filter === "POST" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("POST")}
        className={filter === "POST" ? "bg-green-600 text-white hover:bg-green-700" : ""}
      >
        POST
      </Button>
      <Button
        variant={filter === "PUT" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("PUT")}
        className={filter === "PUT" ? "bg-amber-600 text-white hover:bg-amber-700" : ""}
      >
        PUT
      </Button>
      <Button
        variant={filter === "DELETE" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("DELETE")}
        className={filter === "DELETE" ? "bg-red-600 text-white hover:bg-red-700" : ""}
      >
        DELETE
      </Button>
    </div>
  )
}
