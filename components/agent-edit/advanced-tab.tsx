"use client"

import type React from "react"
import { Plus, Trash2, Sparkles, Database } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AiInput } from "@/components/ui/ai-input"

interface AdvancedTabProps {
  editedAgent: any
  handleChange: (field: string, value: any) => void
  appVariables: { key: string; value: string }[]
  setAppVariables: React.Dispatch<React.SetStateAction<{ key: string; value: string }[]>>
  models: any[]
  availableTools: any[]
  ragDatasources: any[]
}

export function AdvancedTab({
  editedAgent,
  handleChange,
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
        <Label htmlFor="model" className="text-sm font-medium">
          AI Model
        </Label>
        <Select value={editedAgent.model} onValueChange={(value) => handleChange("model", value)}>
          <SelectTrigger
            id="model"
            className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id} className="text-sm">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground ml-2">- {model.description}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <Label htmlFor="memory" className="cursor-pointer text-sm">
          Enable Memory
        </Label>
        <Switch
          id="memory"
          checked={editedAgent.memory}
          onCheckedChange={(checked) => handleChange("memory", checked)}
        />
      </div>

      <div className="space-y-1.5 mt-4">
        <Label className="text-sm font-medium">Tools</Label>
        <AiInput
          value={editedAgent.tools || []}
          onChange={(tools) => handleChange("tools", tools)}
          options={availableTools.map((tool) => tool.id)}
          optionsData={availableTools}
          placeholder="Choose tools or create new ones"
          className="border-2 transition-colors focus-within:border-[hsl(240deg_1.85%_48.51%)]"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">RAG Datasources</Label>
        </div>

        <div className="mt-2 max-h-[200px] overflow-y-auto rounded-md bg-white border border-solid border-[#f1f1f1] p-4">
          <div className="grid gap-2">
            {ragDatasources.map((datasource) => (
              <div
                key={datasource.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  editedAgent.ragDatasources?.includes(datasource.id)
                    ? "bg-primary/5 border-[hsl(240deg_1.85%_48.51%)]"
                    : "bg-background hover:bg-muted/50 border-input hover:border-[hsl(240deg_1.85%_48.51%)/50]"
                }`}
                onClick={() => toggleRagDatasource(datasource.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{datasource.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{datasource.description}</p>
                  </div>
                  <div
                    className={`flex items-center justify-center h-4 w-4 rounded-sm border-2 transition-colors ${
                      editedAgent.ragDatasources?.includes(datasource.id)
                        ? "border-[hsl(240deg_1.85%_48.51%)] bg-[hsl(240deg_1.85%_48.51%)] text-white"
                        : "border-input"
                    }`}
                  >
                    {editedAgent.ragDatasources?.includes(datasource.id) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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

