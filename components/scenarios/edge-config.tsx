"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EdgeConfigProps {
  edge: any
  onUpdate: (edge: any) => void
  onDelete: () => void
}

export function EdgeConfig({ edge, onUpdate, onDelete }: EdgeConfigProps) {
  const [label, setLabel] = React.useState(edge.label || "Transfer")
  const [type, setType] = React.useState("default")

  const handleUpdate = () => {
    onUpdate({
      ...edge,
      label,
      type,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edge Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edge-label">Edge Label</Label>
            <Input id="edge-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Edge Label" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edge-type">Edge Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="edge-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="step">Step</SelectItem>
                <SelectItem value="smoothstep">Smooth Step</SelectItem>
                <SelectItem value="straight">Straight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleUpdate}>
              Update
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
