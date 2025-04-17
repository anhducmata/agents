"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SessionInfoPanel() {
  return (
    <div className="w-80 p-6 border-l animate-in slide-in-from-right duration-300">
      <Card className="sticky top-6 rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Session Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agent">Agent selected</Label>
            <Select defaultValue="customer-support">
              <SelectTrigger id="agent">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer-support">Customer Support</SelectItem>
                <SelectItem value="sales">Sales Assistant</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="general">General Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="memory" className="cursor-pointer">
              Memory enabled
            </Label>
            <Switch id="memory" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="transcription" className="cursor-pointer">
              Show real-time transcription
            </Label>
            <Switch id="transcription" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language selected</Label>
            <Select defaultValue="en-US">
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
