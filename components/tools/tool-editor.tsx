"use client"

import { useState, useEffect } from "react"
import { Wrench, Sparkles, Terminal, Check, Lock, Key, FileKey, ClipboardCopy, Plus, Trash2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Tool, Header, Parameter, Secret } from "./types"
import { generateCurlCommand } from "./tool-utils"
// Import the useLockBody hook at the top of the file
import { useLockBody } from "@/hooks/use-lock-body"

interface ToolEditorProps {
  currentTool: Tool | null
  onSave: (tool: Tool) => void
  onCancel: () => void
  availableSecrets: Secret[]
}

export function ToolEditor({ currentTool, onSave, onCancel, availableSecrets }: ToolEditorProps) {
  const [tool, setTool] = useState<Tool | null>(currentTool)
  const [newHeader, setNewHeader] = useState<Header>({ key: "", value: "" })
  const [newParameter, setNewParameter] = useState<Parameter>({
    name: "",
    type: "string",
    required: false,
    description: "",
    location: "query",
    default: "",
  })
  const [isJsonValid, setIsJsonValid] = useState(false)

  useEffect(() => {
    setTool(currentTool)
  }, [currentTool])

  if (!tool) return null

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

  const addHeader = () => {
    if (newHeader.key.trim() && newHeader.value.trim()) {
      setTool({
        ...tool,
        headers: [...(tool.headers || []), { ...newHeader }],
      })
      setNewHeader({ key: "", value: "" })
    }
  }

  const removeHeader = (index: number) => {
    const updatedHeaders = [...(tool.headers || [])]
    updatedHeaders.splice(index, 1)
    setTool({ ...tool, headers: updatedHeaders })
  }

  const addParameter = () => {
    if (newParameter.name.trim()) {
      setTool({
        ...tool,
        parameters: [...(tool.parameters || []), { ...newParameter }],
      })
      setNewParameter({
        name: "",
        type: "string",
        required: false,
        description: "",
        location: "query",
        default: "",
      })
    }
  }

  const removeParameter = (index: number) => {
    const updatedParameters = [...(tool.parameters || [])]
    updatedParameters.splice(index, 1)
    setTool({ ...tool, parameters: updatedParameters })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in duration-300">
      <div className="relative bg-background w-[95vw] h-[95vh] overflow-y-auto shadow-lg animate-in zoom-in-90 duration-300 rounded-lg border-[0.5px]">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="sticky top-0 bg-background z-50 flex justify-between items-center p-6 border-b">
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">{tool.id ? `Edit ${tool.name}` : "Create New Tool"}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onCancel} className="h-9 text-xs text-black border-black">
                Cancel
              </Button>
              <Button
                onClick={() => onSave(tool)}
                size="sm"
                className="gap-2 h-9 text-xs bg-black hover:bg-black/90 text-white"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Save Tool
              </Button>
            </div>
          </div>

          <div className="p-6 relative flex-1 overflow-auto">
            {/* Background pattern */}
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
                        value={tool.name}
                        onChange={(e) => setTool({ ...tool, name: e.target.value })}
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
                        value={tool.description}
                        onChange={(e) => setTool({ ...tool, description: e.target.value })}
                        className="min-h-[80px] text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category
                      </Label>
                      <Select
                        value={tool.category}
                        onValueChange={(value: any) => setTool({ ...tool, category: value })}
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
                        onClick={() => copyToClipboard(generateCurlCommand(tool))}
                        className="gap-2 text-xs"
                      >
                        <ClipboardCopy className="h-3.5 w-3.5" />
                        Copy as cURL
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          /* Open cURL import dialog */
                        }}
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
                        <Select value={tool.method} onValueChange={(value: any) => setTool({ ...tool, method: value })}>
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
                          value={tool.url}
                          onChange={(e) => setTool({ ...tool, url: e.target.value })}
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
                            value={tool.authentication?.type || "none"}
                            onValueChange={(value: any) =>
                              setTool({
                                ...tool,
                                authentication: { ...tool.authentication, type: value },
                              })
                            }
                          >
                            <SelectTrigger
                              id="auth-type"
                              className="h-9 text-sm border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            >
                              <SelectValue placeholder="Select authentication type">
                                {tool.authentication?.type && (
                                  <div className="flex items-center gap-2">
                                    {tool.authentication.type === "none" && <Globe className="h-4 w-4" />}
                                    {tool.authentication.type === "basic" && <Lock className="h-4 w-4" />}
                                    {tool.authentication.type === "apiKey" && <Key className="h-4 w-4" />}
                                    {tool.authentication.type === "bearer" && <FileKey className="h-4 w-4" />}
                                    <span>
                                      {tool.authentication.type === "none"
                                        ? "None"
                                        : tool.authentication.type === "basic"
                                          ? "Basic Auth"
                                          : tool.authentication.type === "apiKey"
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
                        {tool.authentication?.type === "basic" && (
                          <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                            {/* Basic auth fields */}
                            {/* ... */}
                          </div>
                        )}

                        {tool.authentication?.type === "apiKey" && (
                          <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                            {/* API key fields */}
                            {/* ... */}
                          </div>
                        )}

                        {tool.authentication?.type === "bearer" && (
                          <div className="space-y-4 pl-4 border-l-[0.5px] border-muted">
                            {/* Bearer token fields */}
                            {/* ... */}
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
                            setTool({
                              ...tool,
                              headers: [...(tool.headers || []), { key: "", value: "" }],
                            })
                          }}
                          className="h-8 gap-1 text-xs"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Header
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {tool.headers?.length ? (
                          <div className="border rounded-md overflow-hidden bg-white">
                            <div className="grid grid-cols-[1fr,1fr,auto] bg-muted/20 border-b">
                              <div className="px-3 py-2 text-sm font-medium">Header</div>
                              <div className="px-3 py-2 text-sm font-medium">Value</div>
                              <div className="px-3 py-2 w-9"></div>
                            </div>
                            {tool.headers.map((header, index) => (
                              <div key={index} className="grid grid-cols-[1fr,1fr,auto] border-b last:border-b-0">
                                <div className="px-3 py-2">
                                  <Input
                                    value={header.key}
                                    onChange={(e) => {
                                      const updatedHeaders = [...(tool.headers || [])]
                                      updatedHeaders[index].key = e.target.value
                                      setTool({ ...tool, headers: updatedHeaders })
                                    }}
                                    placeholder="Header name"
                                    className="h-8 text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                                  />
                                </div>
                                <div className="px-3 py-2">
                                  <Input
                                    value={header.value}
                                    onChange={(e) => {
                                      const updatedHeaders = [...(tool.headers || [])]
                                      updatedHeaders[index].value = e.target.value
                                      setTool({ ...tool, headers: updatedHeaders })
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
                        {tool.parameters?.length ? (
                          <div className="border rounded-md overflow-hidden bg-white">
                            <div className="grid grid-cols-[1fr,1fr,auto] bg-muted/20 border-b">
                              <div className="px-3 py-2 text-sm font-medium">Parameter</div>
                              <div className="px-3 py-2 text-sm font-medium">Value</div>
                              <div className="px-3 py-2 w-9"></div>
                            </div>
                            {tool.parameters.map((parameter, index) => (
                              <div key={index} className="grid grid-cols-[1fr,1fr,auto] border-b last:border-b-0">
                                <div className="px-3 py-2">
                                  <Input
                                    value={parameter.name}
                                    onChange={(e) => {
                                      const updatedParameters = [...(tool.parameters || [])]
                                      updatedParameters[index].name = e.target.value
                                      setTool({ ...tool, parameters: updatedParameters })
                                    }}
                                    placeholder="Parameter name"
                                    className="h-8 text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                                  />
                                </div>
                                <div className="px-3 py-2">
                                  <Input
                                    value={parameter.default || ""}
                                    onChange={(e) => {
                                      const updatedParameters = [...(tool.parameters || [])]
                                      updatedParameters[index].default = e.target.value
                                      setTool({ ...tool, parameters: updatedParameters })
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

                    {/* Request Body Section - Only for POST, PUT, DELETE methods */}
                    {(tool.method === "POST" || tool.method === "PUT" || tool.method === "DELETE") && (
                      <div className="space-y-4 border-t pt-6">
                        <h3 className="text-lg font-medium">Request Body</h3>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="body-type" className="text-sm font-medium">
                              Body Type
                            </Label>
                            <Select
                              value={tool.bodyType || "json"}
                              onValueChange={(value: any) => setTool({ ...tool, bodyType: value })}
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

                          {tool.bodyType === "json" || !tool.bodyType ? (
                            <div className="space-y-2">
                              <Label htmlFor="body-json" className="text-sm font-medium flex items-center gap-2">
                                JSON Body
                                {isJsonValid && tool.body && <Check className="h-3.5 w-3.5 text-green-500" />}
                              </Label>
                              <Textarea
                                id="body-json"
                                placeholder='{"key": "value"}'
                                value={tool.body || ""}
                                onChange={(e) => {
                                  setTool({ ...tool, body: e.target.value })
                                  validateJson(e.target.value)
                                }}
                                className="font-mono text-sm min-h-[150px] border-[0.5px] transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </div>
                          ) : tool.bodyType === "text" ? (
                            <div className="space-y-2">
                              <Label htmlFor="body-text" className="text-sm font-medium">
                                Text Body
                              </Label>
                              <Textarea
                                id="body-text"
                                placeholder="Enter plain text content"
                                value={tool.body || ""}
                                onChange={(e) => setTool({ ...tool, body: e.target.value })}
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
                                      setTool({
                                        ...tool,
                                        bodyFileName: file.name,
                                      })
                                    }
                                  }}
                                />
                                <label htmlFor="body-file" className="cursor-pointer">
                                  <div className="flex flex-col items-center">
                                    <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm font-medium">
                                      {tool.bodyFileName || "Click to upload a file"}
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
  )
}

// Add this component at the bottom of the file, before the final closing bracket
function LockBodyScroll() {
  useLockBody()
  return null
}
