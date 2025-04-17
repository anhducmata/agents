"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardCopy, FileKey, Globe, Key, Lock, Plus, Sparkles, Terminal, Wrench } from "lucide-react"
import { useState } from "react"
import { generateCurlCommand } from "./tool-utils"

interface ToolEditorProps {
  currentTool: any
  setCurrentTool: (tool: any) => void
  handleSaveTool: () => void
  handleCancelEdit: () => void
  availableSecrets: any[]
  curlImportOpen: boolean
  setCurlImportOpen: (open: boolean) => void
  curlCommand: string
  setCurlCommand: (command: string) => void
  handleCurlImport: () => void
  isJsonValid: boolean
  setIsJsonValid: (valid: boolean) => void
}

export function ToolEditor({
  currentTool,
  setCurrentTool,
  handleSaveTool,
  handleCancelEdit,
  availableSecrets,
  curlImportOpen,
  setCurlImportOpen,
  curlCommand,
  setCurlCommand,
  handleCurlImport,
  isJsonValid,
  setIsJsonValid,
}: ToolEditorProps) {
  const [newHeader, setNewHeader] = useState({ key: "", value: "" })
  const [newParameter, setNewParameter] = useState({
    name: "",
    type: "string",
    required: false,
    description: "",
    location: "query",
    default: "",
  })

  const addHeader = () => {
    if (newHeader.key.trim() && newHeader.value.trim()) {
      setCurrentTool({
        ...currentTool,
        headers: [...(currentTool.headers || []), { ...newHeader }],
      })
      setNewHeader({ key: "", value: "" })
    }
  }

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

  const removeParameter = (index: number) => {
    const updatedParameters = [...currentTool.parameters]
    updatedParameters.splice(index, 1)
    setCurrentTool({ ...currentTool, parameters: updatedParameters })
  }

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
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-in fade-in duration-300">
      <div className="relative bg-background w-full max-w-2xl h-full overflow-y-auto shadow-lg animate-in slide-in-from-right duration-300 border-[0.5px]">
        {/* Add the background pattern div */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

        {/* Make the content relative to appear above the background */}
        <div className="relative z-10">
          <div className="sticky top-0 bg-background z-50 flex justify-between items-center p-6 border-b">
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">{currentTool.id ? `Edit ${currentTool.name}` : "Create New Tool"}</h2>
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

          {/* Then, replace the content inside the edit panel (the div with className="p-6 relative") with this tabbed interface: */}
          <div className="p-6 relative">
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
                                    {currentTool.authentication.type === "bearer" && <FileKey className="h-4 w-4" />}
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

                        {/* Authentication type-specific fields */}
                        {currentTool.authentication?.type === "basic" && (
                          <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                            {/* Basic auth fields */}
                            {/* ... (rest of the basic auth fields) */}
                          </div>
                        )}

                        {currentTool.authentication?.type === "apiKey" && (
                          <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                            {/* API key fields */}
                            {/* ... (rest of the API key fields) */}
                          </div>
                        )}

                        {currentTool.authentication?.type === "bearer" && (
                          <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                            {/* Bearer token fields */}
                            {/* ... (rest of the bearer token fields) */}
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
                          onClick={() => {
                            setCurrentTool({
                              ...currentTool,
                              headers: [...(currentTool.headers || []), { key: "", value: "" }],
                            })
                          }}
                          className="h-8 gap-1 text-xs"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Header
                        </Button>
                      </div>

                      {/* Headers list */}
                      {/* ... (rest of the headers section) */}
                    </div>

                    {/* Parameters Section */}
                    <div className="space-y-4 border-t pt-6">{/* ... (parameters section) */}</div>

                    {/* Request Body Section */}
                    {(currentTool.method === "POST" ||
                      currentTool.method === "PUT" ||
                      currentTool.method === "DELETE") && (
                      <div className="space-y-4 border-t pt-6">{/* ... (request body section) */}</div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

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
