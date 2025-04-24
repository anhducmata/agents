"use client"

import { useState, useEffect } from "react"
import { Copy, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { getCurrentAgentId, setCurrentAgentId, generateAgentId, isValidAgentId } from "@/lib/agent-id-utils"

interface AgentIdDisplayProps {
  showControls?: boolean
  className?: string
}

export function AgentIdDisplay({ showControls = true, className = "" }: AgentIdDisplayProps) {
  const { toast } = useToast()
  const [agentId, setAgentId] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Get the current agent ID
    setAgentId(getCurrentAgentId())
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(agentId)
    setCopied(true)

    toast({
      title: "Agent ID copied",
      description: "The agent ID has been copied to your clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerate = () => {
    const newId = generateAgentId()
    setAgentId(newId)
    setCurrentAgentId(newId)

    toast({
      title: "New agent ID generated",
      description: "A new agent ID has been generated and saved.",
    })
  }

  const handleEdit = () => {
    setEditValue(agentId)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (isValidAgentId(editValue)) {
      setAgentId(editValue)
      setCurrentAgentId(editValue)
      setIsEditing(false)

      toast({
        title: "Agent ID updated",
        description: "The agent ID has been updated and saved.",
      })
    } else {
      toast({
        title: "Invalid agent ID",
        description: "Please enter a valid agent ID in the format 'prefix_string'.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Agent ID</CardTitle>
        <CardDescription>Your unique agent identifier</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="flex flex-col space-y-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="agent_identifier"
              className="font-mono text-sm"
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{agentId}</code>
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            {showControls && (
              <>
                <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8">
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={handleGenerate} className="h-8">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Generate New
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
