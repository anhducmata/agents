"use client"

import type React from "react"
import { Plus, Trash2, Sparkles, Tag, MessageSquare } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InputTags } from "@/components/ui/input-tags"
import { Textarea } from "@/components/ui/textarea"

interface AdvancedTabProps {
  editedAgent: any
  handleChange: (field: string, value: any) => void
  handleTagsChange: (tags: string[]) => void
  appVariables: { key: string; value: string }[]
  setAppVariables: React.Dispatch<React.SetStateAction<{ key: string; value: string }[]>>
  models: any[]
  availableTools: any[]
  ragDatasources: any[]
}

export function AdvancedTab({
  editedAgent,
  handleChange,
  handleTagsChange,
  appVariables,
  setAppVariables,
  models,
  availableTools,
  ragDatasources,
}: AdvancedTabProps) {
  // Add a function to handle adding a new app variable
  const handleAddAppVariable = () => {
    setAppVariables([...appVariables, { key: "", value: "" }])
  }

  // Add a function to handle updating an app variable
  const handleUpdateAppVariable = (index: number, field: "key" | "value", value: string) => {
    const updatedVariables = [...appVariables]
    updatedVariables[index][field] = value
    setAppVariables(updatedVariables)
  }

  // Add a function to handle removing an app variable
  const handleRemoveAppVariable = (index: number) => {
    const updatedVariables = [...appVariables]
    updatedVariables.splice(index, 1)
    setAppVariables(updatedVariables)
  }

  const toggleRagDatasource = (datasourceId: string) => {
    const currentDatasources = editedAgent.ragDatasources || []
    if (currentDatasources.includes(datasourceId)) {
      handleChange(
        "ragDatasources",
        currentDatasources.filter((id: string) => id !== datasourceId),
      )
    } else {
      handleChange("ragDatasources", [...currentDatasources, datasourceId])
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="role" className="text-sm font-medium">
          Role Instructions
        </Label>
        <div className="text-xs text-muted-foreground mb-1">
          Use <code className="bg-muted px-1 py-0.5 rounded">{"{{client:variable_name}}"}</code> for user inputs and{" "}
          <code className="bg-muted px-1 py-0.5 rounded">{"{{app:variable_name}}"}</code> for app variables.
        </div>
        <Textarea
          id="role"
          rows={4}
          value={editedAgent.role}
          onChange={(e) => handleChange("role", e.target.value)}
          className="resize-y text-sm min-h-[100px] border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Describe what this agent does and how it should behave... You can use {{client:name}} or {{app:company_name}} variables."
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <Label htmlFor="firstMessage" className="text-sm font-medium">
            First Message
          </Label>
        </div>
        <div className="text-xs text-muted-foreground mb-1">
          The first message the agent will say. If empty, the agent will wait for the user to start the conversation.
          You can use <code className="bg-muted px-1 py-0.5 rounded">{"{{client:variable_name}}"}</code> and{" "}
          <code className="bg-muted px-1 py-0.5 rounded">{"{{app:variable_name}}"}</code> variables.
        </div>
        <Textarea
          id="firstMessage"
          rows={3}
          value={editedAgent.firstMessage}
          onChange={(e) => handleChange("firstMessage", e.target.value)}
          className="resize-y text-sm min-h-[80px] border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Hello {{client:user_name}}, how can I help you today?"
        />
      </div>

      <div className="space-y-1.5 mt-4">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Tags</Label>
        </div>
        <InputTags
          value={editedAgent.tags || []}
          onChange={handleTagsChange}
          placeholder="Add tags..."
          className=" transition-colors focus-within:border-[hsl(240deg_1.85%_48.51%)]"
        />
        <div className="text-xs text-muted-foreground mt-1">
          Add tags to categorize your agent (e.g., customer-service, sales, technical)
        </div>
      </div>

      <div className="space-y-3 mt-6 border-t pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">App Variables</Label>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={handleAddAppVariable}>
            <Plus className="h-3.5 w-3.5" />
            Add Variable
          </Button>
        </div>

        <div className="text-xs text-muted-foreground mb-2">
          Configure variables that can be used in role instructions as{" "}
          <code className="bg-muted px-1 py-0.5 rounded">{"{{app:variable_name}}"}</code>
        </div>

        <div className="space-y-2">
          {appVariables.map((variable, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Variable name"
                  value={variable.key}
                  onChange={(e) => handleUpdateAppVariable(index, "key", e.target.value)}
                  className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Value"
                  value={variable.value}
                  onChange={(e) => handleUpdateAppVariable(index, "value", e.target.value)}
                  className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveAppVariable(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove variable</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
