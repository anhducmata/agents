"use client"

import { useState } from "react"
import {
  Plus,
  Database,
  FileText,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  Clock,
  FileUp,
  Sparkles,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Sample RAG data sources
const initialDataSources = [
  {
    id: "kb-1",
    name: "Product Documentation",
    description: "Technical documentation for all products",
    type: "document",
    status: "active",
    documentCount: 156,
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    size: "12.4 MB",
    progress: 100,
    method: "GET",
    url: "https://api.example.com/docs",
    authType: "apiKey",
    apiKeyName: "x-api-key",
    apiKeyValue: "********",
    headers: [{ key: "Accept", value: "application/json" }],
    body: "",
  },
  {
    id: "kb-2",
    name: "FAQ Database",
    description: "Frequently asked questions and answers",
    type: "document",
    status: "active",
    documentCount: 87,
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    size: "3.2 MB",
    progress: 100,
    method: "GET",
    url: "https://api.example.com/faq",
    authType: "none",
    apiKeyName: "",
    apiKeyValue: "",
    headers: [],
    body: "",
  },
  {
    id: "kb-3",
    name: "Support Articles",
    description: "Troubleshooting guides and how-to articles",
    type: "document",
    status: "active",
    documentCount: 124,
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    size: "8.7 MB",
    progress: 100,
    method: "GET",
    url: "https://api.example.com/articles",
    authType: "none",
    apiKeyName: "",
    apiKeyValue: "",
    headers: [],
    body: "",
  },
  {
    id: "kb-4",
    name: "Company Policies",
    description: "Internal policies and procedures",
    type: "document",
    status: "processing",
    documentCount: 42,
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
    size: "5.1 MB",
    progress: 65,
    method: "GET",
    url: "https://api.example.com/policies",
    authType: "none",
    apiKeyName: "",
    apiKeyValue: "",
    headers: [],
    body: "",
  },
  {
    id: "kb-5",
    name: "Customer Feedback",
    description: "Historical customer feedback and reviews",
    type: "text",
    status: "active",
    documentCount: 532,
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    size: "7.8 MB",
    progress: 100,
    method: "GET",
    url: "https://api.example.com/feedback",
    authType: "none",
    apiKeyName: "",
    apiKeyValue: "",
    headers: [],
    body: "",
  },
  {
    id: "kb-6",
    name: "Product Specifications",
    description: "Detailed specifications for all products",
    type: "document",
    status: "error",
    documentCount: 0,
    lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000),
    size: "0 MB",
    progress: 0,
    error: "Failed to process documents. Format not supported.",
    method: "GET",
    url: "https://api.example.com/specs",
    authType: "none",
    apiKeyName: "",
    apiKeyValue: "",
    headers: [],
    body: "",
  },
]

export default function RagDataPage() {
  const [dataSources, setDataSources] = useState(initialDataSources)
  const [isEditing, setIsEditing] = useState(false)
  const [currentSource, setCurrentSource] = useState<any>(null)
  const [filter, setFilter] = useState("all")
  const [newHeader, setNewHeader] = useState({ key: "", value: "" })
  const [searchQuery, setSearchQuery] = useState("")

  const handleNewSource = () => {
    setCurrentSource({
      id: "",
      name: "",
      description: "",
      type: "document",
      status: "inactive",
      documentCount: 0,
      lastUpdated: new Date(),
      size: "0 MB",
      progress: 0,
      method: "GET",
      url: "",
      authentication: {
        type: "none",
        username: "",
        password: "",
        apiKeyName: "",
        apiKeyValue: "",
        bearerToken: "",
      },
      headers: [],
      body: "",
    })
    setIsEditing(true)
  }

  const handleEditSource = (source: any) => {
    // Ensure source has all required properties
    const sourceToEdit = {
      ...source,
      headers: source.headers || [],
      body: source.body || "",
      authentication: source.authentication || {
        type: source.authType || "none",
        username: "",
        password: "",
        apiKeyName: source.apiKeyName || "",
        apiKeyValue: source.apiKeyValue || "",
        bearerToken: "",
      },
    }
    setCurrentSource(sourceToEdit)
    setIsEditing(true)
  }

  const handleDeleteSource = (sourceId: string) => {
    setDataSources(dataSources.filter((source) => source.id !== sourceId))
  }

  const addHeader = () => {
    if (newHeader.key.trim() && newHeader.value.trim()) {
      setCurrentSource({
        ...currentSource,
        headers: [...(currentSource.headers || []), { ...newHeader }],
      })
      setNewHeader({ key: "", value: "" })
    }
  }

  const removeHeader = (index: number) => {
    const updatedHeaders = [...currentSource.headers]
    updatedHeaders.splice(index, 1)
    setCurrentSource({ ...currentSource, headers: updatedHeaders })
  }

  const handleSaveSource = () => {
    // Generate an ID if it's a new source
    const sourceToSave = { ...currentSource }
    if (!sourceToSave.id) {
      sourceToSave.id = `kb-${Date.now()}`
    }

    // Update or add the source
    if (dataSources.some((source) => source.id === sourceToSave.id)) {
      setDataSources(
        dataSources.map((source) =>
          source.id === sourceToSave.id ? { ...sourceToSave, lastUpdated: new Date() } : source,
        ),
      )
    } else {
      setDataSources([
        ...dataSources,
        {
          ...sourceToSave,
          status: "processing",
          progress: 10,
          lastUpdated: new Date(),
        },
      ])

      // Simulate processing for new sources
      setTimeout(() => {
        setDataSources((prev) =>
          prev.map((source) =>
            source.id === sourceToSave.id
              ? { ...source, progress: 100, status: "active", documentCount: Math.floor(Math.random() * 50) + 10 }
              : source,
          ),
        )
      }, 3000)
    }

    setIsEditing(false)
    setCurrentSource(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setCurrentSource(null)
  }

  const handleRefreshSource = (sourceId: string) => {
    setDataSources(
      dataSources.map((source) =>
        source.id === sourceId ? { ...source, status: "processing", progress: 25, lastUpdated: new Date() } : source,
      ),
    )

    // Simulate processing
    setTimeout(() => {
      setDataSources((prev) =>
        prev.map((source) => (source.id === sourceId ? { ...source, progress: 100, status: "active" } : source)),
      )
    }, 2000)
  }

  const filteredSources =
    filter === "all"
      ? dataSources.filter(
          (source) =>
            searchQuery === "" ||
            source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            source.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            source.url.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : dataSources.filter(
          (source) =>
            (source.status === filter || source.type === filter) &&
            (searchQuery === "" ||
              source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              source.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              source.url.toLowerCase().includes(searchQuery.toLowerCase())),
        )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Processing</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Error</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">Inactive</Badge>
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays}d ago`

    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths}mo ago`
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">RAG Data</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your retrieval-augmented generation data sources</p>
        </div>
        <Button onClick={handleNewSource} size="sm" className="gap-2 bg-black hover:bg-black/90 text-white">
          <Plus className="h-4 w-4" />
          New Data Source
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search data sources..."
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-black text-white" : ""}
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
          className={filter === "active" ? "bg-green-600 text-white hover:bg-green-700" : ""}
        >
          Active
        </Button>
        <Button
          variant={filter === "processing" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("processing")}
          className={filter === "processing" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
        >
          Processing
        </Button>
        <Button
          variant={filter === "error" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("error")}
          className={filter === "error" ? "bg-red-600 text-white hover:bg-red-700" : ""}
        >
          Error
        </Button>
        <Button
          variant={filter === "document" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("document")}
          className={filter === "document" ? "bg-black text-white" : ""}
        >
          Documents
        </Button>
        <Button
          variant={filter === "text" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("text")}
          className={filter === "text" ? "bg-black text-white" : ""}
        >
          Text
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => (
          <Card
            key={source.id}
            className="relative overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border-[0.5px]"
            onClick={() => handleEditSource(source)}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
            <div className="relative z-10">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(source.status)}
                    <Badge variant="outline" className="flex items-center gap-1">
                      {source.type === "document" ? <FileText className="h-3 w-3" /> : <Database className="h-3 w-3" />}
                      <span className="capitalize">{source.type}</span>
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditSource(source)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRefreshSource(source.id)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        <span>Refresh</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteSource(source.id)}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl mt-2">{source.name}</CardTitle>
                <CardDescription>{source.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {source.status === "processing" && (
                  <div className="mb-3">
                    <Progress value={source.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1 animate-pulse blur-[0.3px] transition-all">
                      Processing: {source.progress}% complete
                    </p>
                  </div>
                )}
                {source.status === "error" && source.error && (
                  <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-600 dark:text-red-400">
                    {source.error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{source.documentCount} documents</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Database className="h-3.5 w-3.5" />
                    <span>{source.size}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-3 flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Updated {formatTimeAgo(source.lastUpdated)}</span>
                </div>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>

      {isEditing && currentSource && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="relative bg-background w-[60vw] h-[95vh] overflow-y-auto shadow-lg animate-in zoom-in-90 duration-300 rounded-lg border-[0.5px]">
            {/* Add the background pattern div */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

            {/* Make the content relative to appear above the background */}
            <div className="relative z-10">
              <div className="sticky top-0 bg-background z-50 flex justify-between items-center p-6 border-b border-b-[0.5px]">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">
                    {currentSource.id ? `Edit ${currentSource.name}` : "Create New Data Source"}
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
                    onClick={handleSaveSource}
                    size="sm"
                    className="gap-2 h-9 text-xs bg-black hover:bg-black/90 text-white"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Save Data Source
                  </Button>
                </div>
              </div>

              <div className="p-6 relative">
                {/* Add the background pattern div */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

                <div className="relative z-10 space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Data Source Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter data source name"
                          value={currentSource.name}
                          onChange={(e) => setCurrentSource({ ...currentSource, name: e.target.value })}
                          className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what this data source contains"
                          value={currentSource.description}
                          onChange={(e) => setCurrentSource({ ...currentSource, description: e.target.value })}
                          className="min-h-[80px] text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="type" className="text-sm font-medium">
                            Type
                          </Label>
                          <Select
                            value={currentSource.type}
                            onValueChange={(value) => setCurrentSource({ ...currentSource, type: value })}
                          >
                            <SelectTrigger
                              id="type"
                              className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            >
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="document">Document</SelectItem>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="api">API</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="method" className="text-sm font-medium">
                            Method
                          </Label>
                          <Select
                            value={currentSource.method}
                            onValueChange={(value) => setCurrentSource({ ...currentSource, method: value })}
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
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="url" className="text-sm font-medium">
                          URL
                        </Label>
                        <Input
                          id="url"
                          placeholder="https://api.example.com/endpoint"
                          value={currentSource.url}
                          onChange={(e) => setCurrentSource({ ...currentSource, url: e.target.value })}
                          className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
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
                          value={currentSource.authentication?.type || "none"}
                          onValueChange={(value) =>
                            setCurrentSource({
                              ...currentSource,
                              authentication: { ...currentSource.authentication, type: value },
                            })
                          }
                        >
                          <SelectTrigger
                            id="auth-type"
                            className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <SelectValue placeholder="Select authentication type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="basic">Basic Auth</SelectItem>
                            <SelectItem value="apiKey">API Key</SelectItem>
                            <SelectItem value="bearer">Bearer Token</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {currentSource.authentication?.type === "basic" && (
                        <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                          <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="auth-username" className="text-sm font-medium">
                              Username
                            </Label>
                            <Input
                              id="auth-username"
                              value={currentSource.authentication?.username || ""}
                              onChange={(e) =>
                                setCurrentSource({
                                  ...currentSource,
                                  authentication: { ...currentSource.authentication, username: e.target.value },
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
                              value={currentSource.authentication?.password || ""}
                              onChange={(e) =>
                                setCurrentSource({
                                  ...currentSource,
                                  authentication: { ...currentSource.authentication, password: e.target.value },
                                })
                              }
                              className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                        </div>
                      )}

                      {currentSource.authentication?.type === "apiKey" && (
                        <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                          <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="auth-apikey-name" className="text-sm font-medium">
                              Key Name
                            </Label>
                            <Input
                              id="auth-apikey-name"
                              placeholder="X-API-Key"
                              value={currentSource.authentication?.apiKeyName || ""}
                              onChange={(e) =>
                                setCurrentSource({
                                  ...currentSource,
                                  authentication: { ...currentSource.authentication, apiKeyName: e.target.value },
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
                              value={currentSource.authentication?.apiKeyValue || ""}
                              onChange={(e) =>
                                setCurrentSource({
                                  ...currentSource,
                                  authentication: { ...currentSource.authentication, apiKeyValue: e.target.value },
                                })
                              }
                              className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                        </div>
                      )}

                      {currentSource.authentication?.type === "bearer" && (
                        <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                          <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="auth-bearer" className="text-sm font-medium">
                              Token
                            </Label>
                            <Input
                              id="auth-bearer"
                              value={currentSource.authentication?.bearerToken || ""}
                              onChange={(e) =>
                                setCurrentSource({
                                  ...currentSource,
                                  authentication: { ...currentSource.authentication, bearerToken: e.target.value },
                                })
                              }
                              className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
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
                        disabled={!newHeader.key.trim() || !newHeader.value.trim()}
                        className="h-8 gap-1 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Header
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {currentSource.headers?.length > 0 ? (
                        currentSource.headers.map((header, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={header.key}
                              onChange={(e) => {
                                const updatedHeaders = [...currentSource.headers]
                                updatedHeaders[index].key = e.target.value
                                setCurrentSource({ ...currentSource, headers: updatedHeaders })
                              }}
                              className="flex-1 h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <Input
                              value={header.value}
                              onChange={(e) => {
                                const updatedHeaders = [...currentSource.headers]
                                updatedHeaders[index].value = e.target.value
                                setCurrentSource({ ...currentSource, headers: updatedHeaders })
                              }}
                              className="flex-1 h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHeader(index)}
                              className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove header</span>
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No headers defined.</p>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <Input
                          placeholder="Header name"
                          value={newHeader.key}
                          onChange={(e) => setNewHeader({ ...newHeader, key: e.target.value })}
                          className="flex-1 h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Input
                          placeholder="Header value"
                          value={newHeader.value}
                          onChange={(e) => setNewHeader({ ...newHeader, value: e.target.value })}
                          className="flex-1 h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Request Body Section - Only for POST, PUT methods */}
                  {(currentSource.method === "POST" || currentSource.method === "PUT") && (
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-medium">Request Body</h3>

                      <div className="space-y-2">
                        <Textarea
                          value={currentSource.body || ""}
                          onChange={(e) => setCurrentSource({ ...currentSource, body: e.target.value })}
                          className="font-mono text-sm min-h-[150px] border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder='{"key": "value"}'
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter the request body in JSON format for POST/PUT requests.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* File Upload Section - Only for document/text types */}
                  {(currentSource.type === "document" || currentSource.type === "text") && (
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-medium">File Upload</h3>

                      <div className="border-[0.5px] border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Drag and drop files here or click to browse</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports PDF, DOCX, TXT, CSV, and more (max 50MB)
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">
                          <Upload className="h-4 w-4 mr-2" />
                          Browse Files
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
