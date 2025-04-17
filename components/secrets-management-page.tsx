"use client"

import { SheetTitle } from "@/components/ui/sheet"

import { useState } from "react"
import {
  PlusCircle,
  Key,
  Lock,
  FileKey,
  Variable,
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  Check,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Mock data for initial secrets
const initialSecrets = [
  { id: "ba1", type: "basicAuth", name: "CRM System", username: "admin", password: "password123" },
  { id: "ak1", type: "apiKey", name: "OpenAI API", key: "sk_test_51HZIrULkdIwIHZIrULkdIwIH" },
  {
    id: "bt1",
    type: "bearerToken",
    name: "Auth0 Management",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w",
  },
  { id: "sv1", type: "secretVar", name: "DATABASE_URL", value: "postgres://user:password@localhost:5432/mydb" },
  { id: "ba2", type: "basicAuth", name: "Analytics API", username: "service_account", password: "api_secret_2023" },
  { id: "ak2", type: "apiKey", name: "Maps API", key: "AIzaSyBFw0Qbyg9T5rXlL4Ssomething" },
  { id: "sv2", type: "secretVar", name: "SMTP_PASSWORD", value: "mail_password_2023" },
]

export default function SecretsManagementPage() {
  const [secrets, setSecrets] = useState(initialSecrets)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [newSecretType, setNewSecretType] = useState("basicAuth")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Visibility states for secrets
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({})

  // Form states
  const [newBasicAuth, setNewBasicAuth] = useState({ name: "", username: "", password: "" })
  const [newApiKey, setNewApiKey] = useState({ name: "", key: "" })
  const [newBearerToken, setNewBearerToken] = useState({ name: "", token: "" })
  const [newSecretVar, setNewSecretVar] = useState({ name: "", value: "" })

  // Add state for tracking which secret is being edited
  const [currentEditingSecret, setCurrentEditingSecret] = useState(null)

  // Add state to track which secrets have been copied
  const [copiedSecrets, setCopiedSecrets] = useState<Record<string, boolean>>({})

  // Toggle visibility of a secret
  const toggleVisibility = (id: string) => {
    setVisibleSecrets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Handle form submissions
  const handleAddSecret = (e) => {
    e.preventDefault()

    let newSecret

    if (newSecretType === "basicAuth") {
      newSecret = {
        id: `ba${Date.now()}`,
        type: "basicAuth",
        ...newBasicAuth,
      }
      setNewBasicAuth({ name: "", username: "", password: "" })
    } else if (newSecretType === "apiKey") {
      newSecret = {
        id: `ak${Date.now()}`,
        type: "apiKey",
        ...newApiKey,
      }
      setNewApiKey({ name: "", key: "" })
    } else if (newSecretType === "bearerToken") {
      newSecret = {
        id: `bt${Date.now()}`,
        type: "bearerToken",
        ...newBearerToken,
      }
      setNewBearerToken({ name: "", token: "" })
    } else if (newSecretType === "secretVar") {
      newSecret = {
        id: `sv${Date.now()}`,
        type: "secretVar",
        ...newSecretVar,
      }
      setNewSecretVar({ name: "", value: "" })
    }

    setSecrets([...secrets, newSecret])
    setIsSheetOpen(false)
  }

  // Handle delete
  const handleDelete = (id) => {
    setSecrets(secrets.filter((secret) => secret.id !== id))
  }

  // Update the handleEditSecret function to open the edit sheet with the selected secret
  const handleEditSecret = (secret) => {
    // Set the current secret based on its type
    if (secret.type === "basicAuth") {
      setNewBasicAuth({
        name: secret.name,
        username: secret.username,
        password: secret.password,
      })
    } else if (secret.type === "apiKey") {
      setNewApiKey({
        name: secret.name,
        key: secret.key,
      })
    } else if (secret.type === "bearerToken") {
      setNewBearerToken({
        name: secret.name,
        token: secret.token,
      })
    } else if (secret.type === "secretVar") {
      setNewSecretVar({
        name: secret.name,
        value: secret.value,
      })
    }

    // Set the secret type and open the sheet
    setNewSecretType(secret.type)
    setCurrentEditingSecret(secret.id)
    setIsSheetOpen(true)
  }

  // Update the handleSaveSecret function to handle edits
  const handleSaveSecret = (e) => {
    e.preventDefault()

    let updatedSecret

    if (newSecretType === "basicAuth") {
      updatedSecret = {
        id: currentEditingSecret || `ba${Date.now()}`,
        type: "basicAuth",
        ...newBasicAuth,
      }
      setNewBasicAuth({ name: "", username: "", password: "" })
    } else if (newSecretType === "apiKey") {
      updatedSecret = {
        id: currentEditingSecret || `ak${Date.now()}`,
        type: "apiKey",
        ...newApiKey,
      }
      setNewApiKey({ name: "", key: "" })
    } else if (newSecretType === "bearerToken") {
      updatedSecret = {
        id: currentEditingSecret || `bt${Date.now()}`,
        type: "bearerToken",
        ...newBearerToken,
      }
      setNewBearerToken({ name: "", token: "" })
    } else if (newSecretType === "secretVar") {
      updatedSecret = {
        id: currentEditingSecret || `sv${Date.now()}`,
        type: "secretVar",
        ...newSecretVar,
      }
      setNewSecretVar({ name: "", value: "" })
    }

    if (currentEditingSecret) {
      // Update existing secret
      setSecrets(secrets.map((secret) => (secret.id === currentEditingSecret ? updatedSecret : secret)))
    } else {
      // Add new secret
      setSecrets([...secrets, updatedSecret])
    }

    setIsSheetOpen(false)
    setCurrentEditingSecret(null)
  }

  // Add a function to copy secret values to clipboard with visual feedback
  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text)

    // Set the copied state for this secret
    setCopiedSecrets((prev) => ({ ...prev, [id]: true }))

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedSecrets((prev) => ({ ...prev, [id]: false }))
    }, 2000)
  }

  // Get the icon for each secret type
  const getSecretTypeIcon = (type) => {
    switch (type) {
      case "basicAuth":
        return <Lock className="h-4 w-4" />
      case "apiKey":
        return <Key className="h-4 w-4" />
      case "bearerToken":
        return <FileKey className="h-4 w-4" />
      case "secretVar":
        return <Variable className="h-4 w-4" />
      default:
        return <Key className="h-4 w-4" />
    }
  }

  // Get badge color for each secret type
  const getSecretTypeBadgeClass = (type) => {
    switch (type) {
      case "basicAuth":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "apiKey":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "bearerToken":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "secretVar":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Get human-readable name for each secret type
  const getSecretTypeName = (type) => {
    switch (type) {
      case "basicAuth":
        return "Basic Auth"
      case "apiKey":
        return "API Key"
      case "bearerToken":
        return "Bearer Token"
      case "secretVar":
        return "Secret Variable"
      default:
        return type
    }
  }

  // Filter and search secrets
  const filteredSecrets = secrets.filter((secret) => {
    const matchesSearch = secret.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || secret.type === filterType
    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredSecrets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSecrets = filteredSecrets.slice(startIndex, endIndex)

  // Handle page navigation
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Secrets Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage authentication and secret variables for your voice assistant
          </p>
        </div>
        <Button
          onClick={() => {
            setIsSheetOpen(true)
            setNewSecretType("basicAuth")
            setCurrentEditingSecret(null)
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Secret</span>
        </Button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search secrets..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="basicAuth">Basic Auth</SelectItem>
            <SelectItem value="apiKey">API Key</SelectItem>
            <SelectItem value="bearerToken">Bearer Token</SelectItem>
            <SelectItem value="secretVar">Secret Variable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Background pattern for table styling */}
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px] rounded-lg" />

        <div className="relative text-xs bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-xl border-[0.5px] border-gray-100 dark:border-gray-800 p-4 shadow-md">
          {filteredSecrets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery || filterType !== "all"
                ? "No secrets match your search or filter criteria."
                : "No secrets yet. Click 'Add Secret' to create one."}
            </div>
          ) : (
            <>
              <div className="min-h-[400px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-b-[0.5px] border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">TYPE</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">NAME</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                        VALUE
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSecrets.map((secret) => (
                      <tr
                        key={secret.id}
                        className="border-b border-b-[0.5px] border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex items-center justify-center h-7 w-7 rounded-full",
                                getSecretTypeBadgeClass(secret.type).split(" ")[0],
                              )}
                            >
                              {getSecretTypeIcon(secret.type)}
                            </div>
                            <Badge variant="outline" className={cn("text-xs", getSecretTypeBadgeClass(secret.type))}>
                              {getSecretTypeName(secret.type)}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-2 px-4 font-medium">{secret.name}</td>
                        <td className="py-2 px-4">
                          {secret.type === "basicAuth" && (
                            <div className="text-sm text-muted-foreground flex items-center">
                              <span className="font-mono">{secret.username} | ••••••••</span>
                              <div className="flex items-center ml-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(secret.id, secret.password)
                                  }}
                                  title="Copy credentials"
                                >
                                  {copiedSecrets[secret.id] ? (
                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}

                          {secret.type === "apiKey" && (
                            <div className="text-sm text-muted-foreground flex items-center">
                              <span className="font-mono">••••••••••••••••••••••</span>
                              <div className="flex items-center ml-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(secret.id, secret.key)
                                  }}
                                  title="Copy API key"
                                >
                                  {copiedSecrets[secret.id] ? (
                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}

                          {secret.type === "bearerToken" && (
                            <div className="text-sm text-muted-foreground flex items-center">
                              <span className="font-mono">••••••••••••••••••••••</span>
                              <div className="flex items-center ml-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(secret.id, secret.token)
                                  }}
                                  title="Copy token"
                                >
                                  {copiedSecrets[secret.id] ? (
                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}

                          {secret.type === "secretVar" && (
                            <div className="text-sm text-muted-foreground flex items-center">
                              <span className="font-mono">••••••••••••••••••••••</span>
                              <div className="flex items-center ml-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(secret.id, secret.value)
                                  }}
                                  title="Copy value"
                                >
                                  {copiedSecrets[secret.id] ? (
                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditSecret(secret)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(secret.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between border-t border-t-[0.5px] border-gray-200 dark:border-gray-800 pt-4 mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(endIndex, filteredSecrets.length)}</span> of{" "}
                  <span className="font-medium">{filteredSecrets.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className={cn("h-8 w-8 p-0 mx-1", page === currentPage ? "bg-black text-white" : "")}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right panel for adding new secrets */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md border-[0.5px]">
          <SheetHeader>
            <SheetTitle>{currentEditingSecret ? "Edit Secret" : "Add New Secret"}</SheetTitle>
            <SheetDescription>Create a new secret for your voice assistant.</SheetDescription>
          </SheetHeader>

          <div className="py-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="secret-type">Secret Type</Label>
                <Select value={newSecretType} onValueChange={setNewSecretType}>
                  <SelectTrigger id="secret-type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basicAuth" className="flex items-center">
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
                    <SelectItem value="bearerToken">
                      <div className="flex items-center gap-2">
                        <FileKey className="h-4 w-4" />
                        <span>Bearer Token</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="secretVar">
                      <div className="flex items-center gap-2">
                        <Variable className="h-4 w-4" />
                        <span>Secret Variable</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <form onSubmit={handleSaveSecret} className="space-y-4">
                {/* Basic Auth Form */}
                {newSecretType === "basicAuth" && (
                  <>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., CRM System"
                        value={newBasicAuth.name}
                        onChange={(e) => setNewBasicAuth({ ...newBasicAuth, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Username"
                        value={newBasicAuth.username}
                        onChange={(e) => setNewBasicAuth({ ...newBasicAuth, username: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={newBasicAuth.password}
                        onChange={(e) => setNewBasicAuth({ ...newBasicAuth, password: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                {/* API Key Form */}
                {newSecretType === "apiKey" && (
                  <>
                    <div>
                      <Label htmlFor="api-name">Name</Label>
                      <Input
                        id="api-name"
                        placeholder="e.g., OpenAI API"
                        value={newApiKey.name}
                        onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        placeholder="API Key"
                        value={newApiKey.key}
                        onChange={(e) => setNewApiKey({ ...newApiKey, key: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Bearer Token Form */}
                {newSecretType === "bearerToken" && (
                  <>
                    <div>
                      <Label htmlFor="token-name">Name</Label>
                      <Input
                        id="token-name"
                        placeholder="e.g., Auth0 Management"
                        value={newBearerToken.name}
                        onChange={(e) => setNewBearerToken({ ...newBearerToken, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="token">Bearer Token</Label>
                      <Input
                        id="token"
                        placeholder="Bearer Token"
                        value={newBearerToken.token}
                        onChange={(e) => setNewBearerToken({ ...newBearerToken, token: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Secret Variable Form */}
                {newSecretType === "secretVar" && (
                  <>
                    <div>
                      <Label htmlFor="var-name">Name</Label>
                      <Input
                        id="var-name"
                        placeholder="e.g., DATABASE_URL"
                        value={newSecretVar.name}
                        onChange={(e) => setNewSecretVar({ ...newSecretVar, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="var-value">Value</Label>
                      <Input
                        id="var-value"
                        placeholder="Secret Value"
                        value={newSecretVar.value}
                        onChange={(e) => setNewSecretVar({ ...newSecretVar, value: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full">
                  Save Secret
                </Button>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
