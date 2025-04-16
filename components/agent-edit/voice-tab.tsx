"use client"

import type React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RangeSlider } from "@/components/ui/range-slider" // Removed RangeSlider

interface VoiceTabProps {
  editedAgent: any
  handleChange: (field: string, value: any) => void
  voiceEnabled: boolean
  setVoiceEnabled: React.Dispatch<React.SetStateAction<boolean>>
  pronunciationDictionaries: { word: string; pronunciation: string }[]
  setPronunciationDictionaries: React.Dispatch<React.SetStateAction<{ word: string; pronunciation: string }[]>>
  voices: any[]
  personalities: string[]
}

export function VoiceTab({
  editedAgent,
  handleChange,
  voiceEnabled,
  setVoiceEnabled,
  pronunciationDictionaries,
  setPronunciationDictionaries,
  voices,
  personalities,
}: VoiceTabProps) {
  // Add a function to handle adding a new pronunciation dictionary
  const handleAddPronunciationDictionary = () => {
    setPronunciationDictionaries([...pronunciationDictionaries, { word: "", pronunciation: "" }])
  }

  // Add a function to handle updating a pronunciation dictionary
  const handleUpdatePronunciationDictionary = (index: number, field: "word" | "pronunciation", value: string) => {
    const updatedDictionaries = [...pronunciationDictionaries]
    updatedDictionaries[index][field] = value
    setPronunciationDictionaries(updatedDictionaries)
  }

  // Add a function to handle removing a pronunciation dictionary
  const handleRemovePronunciationDictionary = (index: number) => {
    const updatedDictionaries = [...pronunciationDictionaries]
    updatedDictionaries.splice(index, 1)
    setPronunciationDictionaries(updatedDictionaries)
  }

  // Get the display name for the selected voice
  const getSelectedVoiceName = () => {
    const selectedVoice = voices.find((v) => v.id === editedAgent.voice)
    return selectedVoice ? selectedVoice.name : editedAgent.voice
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <Label htmlFor="voice-enabled" className="cursor-pointer text-sm">
          Enable Voice
        </Label>
        <Switch
          id="voice-enabled"
          checked={voiceEnabled}
          onCheckedChange={(checked) => {
            setVoiceEnabled(checked)
            handleChange("voiceEnabled", checked)
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="voice" className="text-sm font-medium">
            Voice
          </Label>
          <Select
            value={editedAgent.voice}
            onValueChange={(value) => handleChange("voice", value)}
            disabled={!voiceEnabled}
          >
            <SelectTrigger
              id="voice"
              className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectValue placeholder="Select voice">{getSelectedVoiceName()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id} className="text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">{voice.name}</span>
                    <span className="text-xs text-muted-foreground">{voice.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="personality" className="text-sm font-medium">
            Personality
          </Label>
          <Select
            value={editedAgent.personality}
            onValueChange={(value) => handleChange("personality", value)}
            disabled={!voiceEnabled}
          >
            <SelectTrigger
              id="personality"
              className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectValue placeholder="Select personality" />
            </SelectTrigger>
            <SelectContent>
              {personalities.map((personality) => (
                <SelectItem key={personality} value={personality} className="text-sm">
                  {personality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="space-y-1.5">
          <Label htmlFor="speed" className="text-sm font-medium">
            Speed
          </Label>
          <p className="text-xs text-muted-foreground">Controls the speed of the generated speech.</p>
          <Select
            value={String(editedAgent.speedValue || "normal")}
            onValueChange={(value) => handleChange("speedValue", value)}
            disabled={!voiceEnabled}
          >
            <SelectTrigger
              id="speed"
              className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectValue placeholder="Select speed">{editedAgent.speedValue || "normal"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow" className="text-sm">
                Slow
              </SelectItem>
              <SelectItem value="normal" className="text-sm">
                Normal
              </SelectItem>
              <SelectItem value="fast" className="text-sm">
                Fast
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confidence" className="text-sm font-medium">
            Confidence
          </Label>
          <p className="text-xs text-muted-foreground">Controls how confident the agent sounds when speaking.</p>
          <Select
            value={String(editedAgent.confidenceValue || 50)}
            onValueChange={(value) => handleChange("confidenceValue", Number.parseInt(value))}
            disabled={!voiceEnabled}
          >
            <SelectTrigger
              id="confidence"
              className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectValue placeholder="Select confidence level">
                {editedAgent.confidenceValue === 0
                  ? "Not Confident"
                  : editedAgent.confidenceValue === 25
                    ? "Slightly Confident"
                    : editedAgent.confidenceValue === 75
                      ? "Very Confident"
                      : editedAgent.confidenceValue === 100
                        ? "Extremely Confident"
                        : "Normal"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" className="text-sm">
                Not Confident
              </SelectItem>
              <SelectItem value="25" className="text-sm">
                Slightly Confident
              </SelectItem>
              <SelectItem value="50" className="text-sm">
                Normal
              </SelectItem>
              <SelectItem value="75" className="text-sm">
                Very Confident
              </SelectItem>
              <SelectItem value="100" className="text-sm">
                Extremely Confident
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="motivation" className="text-sm font-medium">
            Motivation
          </Label>
          <p className="text-xs text-muted-foreground">Controls how motivated and energetic the agent sounds.</p>
          <Select
            value={String(editedAgent.motivationValue || 50)}
            onValueChange={(value) => handleChange("motivationValue", Number.parseInt(value))}
            disabled={!voiceEnabled}
          >
            <SelectTrigger
              id="motivation"
              className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectValue placeholder="Select motivation level">
                {editedAgent.motivationValue === 0
                  ? "Low Energy"
                  : editedAgent.motivationValue === 100
                    ? "Enthusiastic"
                    : "Neutral"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" className="text-sm">
                Low Energy
              </SelectItem>
              <SelectItem value="50" className="text-sm">
                Neutral
              </SelectItem>
              <SelectItem value="100" className="text-sm">
                Enthusiastic
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 mt-6 border-t pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Pronunciation Dictionaries</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            disabled={!voiceEnabled}
            onClick={handleAddPronunciationDictionary}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Dictionary
          </Button>
        </div>

        <div className="text-xs text-muted-foreground mb-2">
          Lexicon dictionary files apply pronunciation replacements to agent responses. Add words that need special
          pronunciation.
        </div>

        {pronunciationDictionaries.length > 0 ? (
          <div className="space-y-2">
            {pronunciationDictionaries.map((dictionary, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Word or phrase"
                    value={dictionary.word}
                    onChange={(e) => handleUpdatePronunciationDictionary(index, "word", e.target.value)}
                    className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={!voiceEnabled}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Pronunciation"
                    value={dictionary.pronunciation}
                    onChange={(e) => handleUpdatePronunciationDictionary(index, "pronunciation", e.target.value)}
                    className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={!voiceEnabled}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemovePronunciationDictionary(index)}
                  disabled={!voiceEnabled}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove dictionary</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-muted-foreground border rounded-md bg-white">
            No pronunciation dictionaries added
          </div>
        )}
      </div>
    </div>
  )
}

