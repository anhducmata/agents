"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AvatarPicker } from "@/components/ui/avatar-picker"
import { InputTags } from "@/components/ui/input-tags"
import { Tag } from "lucide-react"

interface BasicTabProps {
  editedAgent: any
  handleChange: (field: string, value: any) => void
  handleTagsChange: (tags: string[]) => void
  handleAvatarChange: (avatarId: string) => void
  avatarOptions: any[]
  languages: any[]
  tagSuggestions: string[]
}

export function BasicTab({
  editedAgent,
  handleChange,
  handleTagsChange,
  handleAvatarChange,
  avatarOptions,
  languages,
  tagSuggestions,
}: BasicTabProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-4 mb-6">
        <AvatarPicker options={avatarOptions} value={editedAgent.avatarId} onChange={handleAvatarChange} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium">
              Agent Name
            </Label>
            <Input
              id="name"
              placeholder="Enter agent name"
              value={editedAgent.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-1.5 w-40">
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <div className="flex items-center h-9 px-3 rounded-md border-2 border-input">
              <span className="text-sm mr-2">Dev</span>
              <Switch
                id="status-switch"
                checked={editedAgent.status === "Prod"}
                onCheckedChange={(checked) => handleChange("status", checked ? "Prod" : "Dev")}
                className="data-[state=checked]:bg-green-500 data-[state=checked]:text-green-foreground"
              />
              <span className="text-sm ml-2">Prod</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Input
            id="description"
            placeholder="Brief description of what this agent does"
            value={editedAgent.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="text-xs text-muted-foreground mt-1">
            A short description that will be displayed on the agent card
          </div>
        </div>
      </div>

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
        <Label htmlFor="firstMessage" className="text-sm font-medium">
          First Message
        </Label>
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

      <div className="space-y-1.5">
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

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-1.5">
          <Label htmlFor="primaryLanguage" className="text-sm font-medium">
            Primary Language
          </Label>
          <Select value={editedAgent.language} onValueChange={(value) => handleChange("language", value)}>
            <SelectTrigger
              id="primaryLanguage"
              className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectValue placeholder="Select primary language">
                {languages.find((l) => l.code === editedAgent.language)?.flag}{" "}
                {languages.find((l) => l.code === editedAgent.language)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.code} value={language.code} className="text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-base">{language.flag}</span> {language.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="alternativeLanguage" className="text-sm font-medium">
            Alternative Language
          </Label>
          <Select
            value={editedAgent.alternativeLanguage || "none"}
            onValueChange={(value) => handleChange("alternativeLanguage", value === "none" ? null : value)}
          >
            <SelectTrigger
              id="alternativeLanguage"
              className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectValue placeholder="Select alternative language">
                {editedAgent.alternativeLanguage && editedAgent.alternativeLanguage !== "none" ? (
                  <>
                    {languages.find((l) => l.code === editedAgent.alternativeLanguage)?.flag}{" "}
                    {languages.find((l) => l.code === editedAgent.alternativeLanguage)?.name}
                  </>
                ) : (
                  "None"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-sm">
                None
              </SelectItem>
              {languages
                .filter((lang) => lang.code !== editedAgent.language)
                .map((language) => (
                  <SelectItem key={language.code} value={language.code} className="text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-base">{language.flag}</span> {language.name}
                    </span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

