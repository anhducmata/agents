"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AvatarPicker } from "@/components/ui/avatar-picker"

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
        <div>
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
