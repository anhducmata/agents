"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Wrench, Code, Database, Globe, Zap, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ToolCard } from "./tools/tool-card"
import { ToolEditor } from "./tools/tool-editor"
import { DataSources } from "./tools/data-sources"

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

  const filteredTools =
    filter === "all" ? tools : tools.filter((tool) => tool.category === filter || tool.method === filter)

  // Method badge color mapping
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

  // Category icon mapping
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "data":
        return <Database className="h-4 w-4" />
      case "action":
        return <Zap className="h-4 w-4" />
      case "utility":
        return <Wrench className="h-4 w-4" />
      case "integration":
        return <Globe className="h-4 w-4" />
      default:
        return <Code className="h-4 w-4" />
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

  // Add this function to parse cURL commands
  const parseCurlCommand = (curlString: string) => {
    try {
      // Handle line continuation characters and normalize the command to a single line
      const normalizedCurl = curlString
        .replace(/\\\s*\n/g, " ") // Replace line continuation with space
        .replace(/\r\n|\n|\r/g, " ") // Replace any remaining newlines with spaces
        .trim()
        .replace(/^curl\s+/, "") // Remove the initial "curl" if present

      // Initialize the result object
      const result: any = {
        method: "GET", // Default method
        url: "",
        headers: [],
        parameters: [],
        body: "",
        authentication: {
          type: "none",
        },
      }

      // Extract URL - look for the URL that's not part of a header or data
      const urlMatch = normalizedCurl.match(/(?:(?:-X|--request)\s+[A-Z]+\s+)?['"]?(https?:\/\/[^'"]+)['"]?/)
      if (urlMatch) {
        result.url = urlMatch[1]

        // Add this new code to extract query parameters from the URL
        try {
          const url = new URL(result.url)

          // Extract query parameters
          if (url.search) {
            url.searchParams.forEach((value, key) => {
              result.parameters.push({
                name: key,
                type: "string",
                required: false,
                description: "",
                location: "query",
                default: value,
              })
            })

            // Remove query parameters from the URL
            result.url = `${url.origin}${url.pathname}`
          }
        } catch (e) {
          console.error("Error parsing URL:", e)
          // Keep the URL as is if there's an error
        }
      }

      // Extract method
      const methodMatch = normalizedCurl.match(/(?:-X|--request)\s+['"]?([A-Z]+)['"]?/)
      if (methodMatch) {
        result.method = methodMatch[1]
      } else if (normalizedCurl.includes("--data") || normalizedCurl.includes("-d ")) {
        // If there's data but no explicit method, it's likely a POST
        result.method = "POST"
      }

      // Extract headers
      const headerMatches = [...normalizedCurl.matchAll(/(?:--header|-H)\s+['"]([^:]+):\s*([^'"]+)['"]?/g)]
      for (const match of headerMatches) {
        const key = match[1].trim()
        const value = match[2].trim()

        // Check for auth headers
        if (key.toLowerCase() === "authorization") {
          if (value.startsWith("Bearer ")) {
            result.authentication = {
              type: "bearer",
              bearerToken: value.substring(7),
              secretId: "manual",
            }
          } else if (value.startsWith("Basic ")) {
            result.authentication = {
              type: "basic",
              secretId: "manual",
              // We'd need to decode base64 for username/password
            }
          }
        } else if (key.toLowerCase() === "x-api-key" || key.toLowerCase().includes("api-key")) {
          result.authentication = {
            type: "apiKey",
            apiKeyName: key,
            apiKeyValue: value,
            secretId: "manual",
          }
        } else {
          result.headers.push({ key, value })
        }
      }

      // Extract basic auth
      const userMatch = normalizedCurl.match(/(?:-u|--user)\s+['"]?([^:]+):([^'"]+)['"]?/)
      if (userMatch) {
        result.authentication = {
          type: "basic",
          username: userMatch[1],
          password: userMatch[2],
          secretId: "manual",
        }
      }

      // Extract data/body - this is more complex due to potential multi-line JSON
      const dataFlagIndex = normalizedCurl.search(/(?:--data|-d)\s+/)
      if (dataFlagIndex !== -1) {
        // Find the quote character used (single or double)
        const quoteMatch = normalizedCurl.substring(dataFlagIndex).match(/(?:--data|-d)\s+(['"])/)
        if (quoteMatch) {
          const quoteChar = quoteMatch[1]
          const startIndex = normalizedCurl.indexOf(quoteChar, dataFlagIndex) + 1

          // Find the matching end quote, accounting for escaped quotes
          let endIndex = startIndex
          let escaped = false

          while (endIndex < normalizedCurl.length) {
            const char = normalizedCurl[endIndex]

            if (char === "\\") {
              escaped = !escaped
            } else if (char === quoteChar && !escaped) {
              break
            } else {
              escaped = false
            }

            endIndex++
          }

          if (endIndex > startIndex) {
            const rawData = normalizedCurl.substring(startIndex, endIndex)

            // Try to parse as JSON
            try {
              // Handle special shell escape sequences for single quotes: '\''
              const cleanedData = rawData
                .replace(/\\'/g, "'") // Replace \' with '
                .replace(/'\\'''/g, "'") // Replace '\'' with '
                .replace(/'\\''/g, "'") // Replace \' with '
                .replace(/\\"/g, '"') // Replace \" with "
                .replace(/\\n/g, "\n") // Replace \n with newline
                .replace(/\\t/g, "\t") // Replace \t with tab

              // Try to parse the JSON
              let jsonData
              try {
                jsonData = JSON.parse(cleanedData)
              } catch (e) {
                // If direct parsing fails, try to fix common issues with JSON in curl commands
                // Sometimes the JSON might be malformed or have unescaped quotes
                console.log("First JSON parse attempt failed:", e)

                // Try to detect if this is a JSON object or array by checking first character
                if (cleanedData.trim().startsWith("{") || cleanedData.trim().startsWith("[")) {
                  // Try a more aggressive approach for fixing JSON
                  const fixedJson = cleanedData
                    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Add quotes around unquoted keys
                    .replace(/'/g, '"') // Replace all single quotes with double quotes
                    .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas

                  try {
                    jsonData = JSON.parse(fixedJson)
                  } catch (e2) {
                    console.log("Second JSON parse attempt failed:", e2)
                    // If still can't parse, just use the raw data
                    result.body = rawData
                    result.bodyType = "text"

                    // But still mark it as JSON if it looks like JSON
                    if (rawData.trim().startsWith("{") || rawData.trim().startsWith("[")) {
                      result.bodyType = "json"
                    }
                    return result
                  }
                } else {
                  // Not JSON, treat as text
                  result.body = rawData
                  result.bodyType = "text"
                  return result
                }
              }

              // If we got here, we successfully parsed the JSON
              result.body = JSON.stringify(jsonData, null, 2)
              result.bodyType = "json"
            } catch (e) {
              console.error("Error processing JSON:", e)
              // If all parsing attempts fail, just use the raw data
              result.body = rawData
              result.bodyType = "text"

              // But still mark it as JSON if it looks like JSON
              if (rawData.trim().startsWith("{") || rawData.trim().startsWith("[")) {
                result.bodyType = "json"
              }
            }
          }
        } else {
          // Handle case where data might not be quoted
          const dataMatch = normalizedCurl.match(/(?:--data|-d)\s+([^-][^\s]*)/)
          if (dataMatch) {
            result.body = dataMatch[1]
            result.bodyType = "text"

            // Check if it looks like JSON
            if (result.body.startsWith("{") || result.body.startsWith("[")) {
              result.bodyType = "json"
              try {
                const jsonData = JSON.parse(result.body)
                result.body = JSON.stringify(jsonData, null, 2)
              } catch (e) {
                // Keep as is if can't parse
              }
            }
          }
        }
      }

      return result
    } catch (error) {
      console.error("Error parsing cURL command:", error)
      return null
    }
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

  // Add this function to generate a cURL command from the current tool configuration
  const generateCurlCommand = () => {
    if (!currentTool) return ""

    let curl = `curl -X ${currentTool.method} "${currentTool.url}"`

    // Add headers
    if (currentTool.headers && currentTool.headers.length > 0) {
      currentTool.headers.forEach((header) => {
        curl += ` \\\n  -H "${header.key}: ${header.value}"`
      })
    }

    // Add authentication
    if (currentTool.authentication && currentTool.authentication.type !== "none") {
      if (
        currentTool.authentication.type === "basic" &&
        currentTool.authentication.username &&
        currentTool.authentication.password
      ) {
        curl += ` \\\n  -u "${currentTool.authentication.username}:${currentTool.authentication.password}"`
      } else if (
        currentTool.authentication.type === "apiKey" &&
        currentTool.authentication.apiKeyName &&
        currentTool.authentication.apiKeyValue
      ) {
        curl += ` \\\n  -H "${currentTool.authentication.apiKeyName}: ${currentTool.authentication.apiKeyValue}"`
      } else if (currentTool.authentication.type === "bearer" && currentTool.authentication.bearerToken) {
        curl += ` \\\n  -H "Authorization: Bearer ${currentTool.authentication.bearerToken}"`
      }
    }

    // Add query parameters
    if (currentTool.parameters && currentTool.parameters.length > 0) {
      const queryParams = currentTool.parameters
        .filter((param) => param.location === "query")
        .map((param) => `${param.name}=${param.default || "{value}"}`)
        .join("&")

      if (queryParams) {
        // Check if URL already has query parameters
        if (currentTool.url.includes("?")) {
          curl = curl.replace(currentTool.url, `${currentTool.url}&${queryParams}`)
        } else {
          curl = curl.replace(currentTool.url, `${currentTool.url}?${queryParams}`)
        }
      }
    }

    // Add request body for POST, PUT, DELETE methods
    if (
      (currentTool.method === "POST" || currentTool.method === "PUT" || currentTool.method === "DELETE") &&
      currentTool.body
    ) {
      // Check if Content-Type header exists
      const contentTypeHeader = currentTool.headers?.find((h) => h.key.toLowerCase() === "content-type")
      const contentType = contentTypeHeader?.value || "application/json"

      if (contentType.includes("json") && currentTool.bodyType === "json") {
        // For JSON body, ensure it's properly escaped for the shell
        curl += ` \\\n  -d '${currentTool.body.replace(/'/g, "'\\''")}'`
      } else {
        // For other body types
        curl += ` \\\n  -d "${currentTool.body.replace(/"/g, '\\"')}"`
      }
    }

    return curl
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
      </div>

      {/* Data Sources Section */}
      <DataSources tools={tools} onEditTool={handleEditTool} />

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onEdit={handleEditTool}
            onDuplicate={handleDuplicateTool}
            onDelete={handleDeleteTool}
            onAgentClick={handleAgentClick}
          />
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

      {/* Tool Editor */}
      {isEditing && currentTool && (
        <ToolEditor
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          handleSaveTool={handleSaveTool}
          handleCancelEdit={handleCancelEdit}
          availableSecrets={availableSecrets}
          curlImportOpen={curlImportOpen}
          setCurlImportOpen={setCurlImportOpen}
          curlCommand={curlCommand}
          setCurlCommand={setCurlCommand}
          handleCurlImport={handleCurlImport}
          isJsonValid={isJsonValid}
          setIsJsonValid={setIsJsonValid}
        />
      )}
    </div>
  )
}
