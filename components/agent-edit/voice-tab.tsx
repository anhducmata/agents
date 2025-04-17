"use client"

import type React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

  // Get the display name and description for the selected voice
  const getSelectedVoice = () => {
    const selectedVoice = voices.find((v) => v.id === editedAgent.voice)
    return selectedVoice ? selectedVoice : { name: editedAgent.voice, description: "" }
  }

  // Add this function to get default value for new voice settings
  const getVoiceSettingValue = (field: string, defaultValue = "b") => {
    return editedAgent[field] || defaultValue
  }

  return (
    <div>
      <div className="space-y-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="voice" className="text-sm font-medium">
                Voice
              </Label>
              <Select value={editedAgent.voice} onValueChange={(value) => handleChange("voice", value)}>
                <SelectTrigger
                  id="voice"
                  className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <SelectValue placeholder="Select voice">
                    {editedAgent.voice && (
                      <div className="flex items-center truncate">
                        <span className="font-medium">{getSelectedVoice().name}</span>
                        {getSelectedVoice().description && (
                          <span className="text-xs text-muted-foreground ml-2">- {getSelectedVoice().description}</span>
                        )}
                      </div>
                    )}
                  </SelectValue>
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
              <Select value={editedAgent.personality} onValueChange={(value) => handleChange("personality", value)}>
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

          {/* Advanced Voice Adjustments Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold">Advanced Voice Adjustments</h3>
            <p className="text-xs text-muted-foreground">
              Fine-tune how your agent sounds with these advanced settings.
            </p>
          </div>

          {/* Identity */}
          <div className="space-y-1.5">
            <Label htmlFor="voiceIdentity" className="text-sm font-medium">
              Identity
            </Label>
            <p className="text-xs text-muted-foreground">Who should the voice agent sound like?</p>
            <Select
              value={getVoiceSettingValue("voiceIdentity")}
              onValueChange={(value) => handleChange("voiceIdentity", value)}
            >
              <SelectTrigger
                id="voiceIdentity"
                className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select identity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a" className="text-sm">
                  A confident job coach guiding the user
                </SelectItem>
                <SelectItem value="b" className="text-sm">
                  A professional assistant introducing a candidate
                </SelectItem>
                <SelectItem value="c" className="text-sm">
                  A friendly AI companion helping a user
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Demeanor */}
          <div className="space-y-1.5">
            <Label htmlFor="voiceDemeanor" className="text-sm font-medium">
              Demeanor
            </Label>
            <p className="text-xs text-muted-foreground">What kind of attitude should it have?</p>
            <Select
              value={getVoiceSettingValue("voiceDemeanor")}
              onValueChange={(value) => handleChange("voiceDemeanor", value)}
            >
              <SelectTrigger
                id="voiceDemeanor"
                className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select demeanor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a" className="text-sm">
                  Polished and confident
                </SelectItem>
                <SelectItem value="b" className="text-sm">
                  Warm and encouraging
                </SelectItem>
                <SelectItem value="c" className="text-sm">
                  Calm and professional
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tone */}
          <div className="space-y-1.5">
            <Label htmlFor="voiceTone" className="text-sm font-medium">
              Tone
            </Label>
            <p className="text-xs text-muted-foreground">How should the agent speak?</p>
            <Select
              value={getVoiceSettingValue("voiceTone")}
              onValueChange={(value) => handleChange("voiceTone", value)}
            >
              <SelectTrigger
                id="voiceTone"
                className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a" className="text-sm">
                  Formal and articulate
                </SelectItem>
                <SelectItem value="b" className="text-sm">
                  Friendly and conversational
                </SelectItem>
                <SelectItem value="c" className="text-sm">
                  Crisp and businesslike
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Level of Enthusiasm */}
          <div className="space-y-1.5">
            <Label htmlFor="voiceEnthusiasm" className="text-sm font-medium">
              Level of Enthusiasm
            </Label>
            <p className="text-xs text-muted-foreground">How energetic should the agent sound?</p>
            <Select
              value={getVoiceSettingValue("voiceEnthusiasm")}
              onValueChange={(value) => handleChange("voiceEnthusiasm", value)}
            >
              <SelectTrigger
                id="voiceEnthusiasm"
                className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select enthusiasm level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a" className="text-sm">
                  High energy, motivational
                </SelectItem>
                <SelectItem value="b" className="text-sm">
                  Neutral, focused
                </SelectItem>
                <SelectItem value="c" className="text-sm">
                  Slightly upbeat but professional
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Level of Formality */}
          <div className="space-y-1.5">
            <Label htmlFor="voiceFormality" className="text-sm font-medium">
              Level of Formality
            </Label>
            <p className="text-xs text-muted-foreground">Should it be casual or more professional?</p>
            <Select
              value={getVoiceSettingValue("voiceFormality")}
              onValueChange={(value) => handleChange("voiceFormality", value)}
            >
              <SelectTrigger
                id="voiceFormality"
                className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select formality level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a" className="text-sm">
                  Business casual
                </SelectItem>
                <SelectItem value="b" className="text-sm">
                  Fully professional
                </SelectItem>
                <SelectItem value="c" className="text-sm">
                  Somewhere in between
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Level of Emotion */}
          <div className="space-y-1.5">
            <Label htmlFor="voiceEmotion" className="text-sm font-medium">
              Level of Emotion
            </Label>
            <p className="text-xs text-muted-foreground">Should the voice convey feeling or be more neutral?</p>
            <Select
              value={getVoiceSettingValue("voiceEmotion")}
              onValueChange={(value) => handleChange("voiceEmotion", value)}
            >
              <SelectTrigger
                id="voiceEmotion"
                className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select emotion level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a" className="text-sm">
                  Expressive (excitement about achievements)
                </SelectItem>
                <SelectItem value="b" className="text-sm">
                  Mildly expressive (subtle warmth)
                </SelectItem>
                <SelectItem value="c" className="text-sm">
                  Neutral and informative
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filler Words */}
          <div className="space-y-1.5">
            <Label htmlFor="voiceFillerWords" className="text-sm font-medium">
              Filler Words
            </Label>
            <p className="text-xs text-muted-foreground">Should it use any to sound more natural?</p>
            <Select
              value={getVoiceSettingValue("voiceFillerWords")}
              onValueChange={(value) => handleChange("voiceFillerWords", value)}
            >
              <SelectTrigger
                id="voiceFillerWords"
                className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select filler words usage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a" className="text-sm">
                  None
                </SelectItem>
                <SelectItem value="b" className="text-sm">
                  Occasionally (e.g., "hm," "let's see")
                </SelectItem>
                <SelectItem value="c" className="text-sm">
                  Often, to sound very natural and casual
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pacing */}
          <div className="space-y-1.5">
            <Label htmlFor="voicePacing" className="text-sm font-medium">
              Pacing
            </Label>
            <p className="text-xs text-muted-foreground">Should the speech be fast, slow, or moderate?</p>
            <Select
              value={getVoiceSettingValue("voicePacing")}
              onValueChange={(value) => handleChange("voicePacing", value)}
            >
              <SelectTrigger
                id="voicePacing"
                className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select pacing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a" className="text-sm">
                  Slow and clear, great for clarity
                </SelectItem>
                <SelectItem value="b" className="text-sm">
                  Moderate and natural
                </SelectItem>
                <SelectItem value="c" className="text-sm">
                  Slightly faster for confident delivery
                </SelectItem>
              </SelectContent>
            </Select>
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
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Pronunciation"
                        value={dictionary.pronunciation}
                        onChange={(e) => handleUpdatePronunciationDictionary(index, "pronunciation", e.target.value)}
                        className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemovePronunciationDictionary(index)}
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
      </div>
    </div>
  )
}
