"use client"

import { Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useLockBody } from "@/hooks/use-lock-body"

interface CurlImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  curlCommand: string
  setCurlCommand: (command: string) => void
  onImport: () => void
}

export function CurlImportDialog({ open, onOpenChange, curlCommand, setCurlCommand, onImport }: CurlImportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-[0.5px]">
        <LockBodyScroll />
        <DialogHeader>
          <DialogTitle>Import from cURL</DialogTitle>
          <DialogDescription>Paste a cURL command to import its configuration.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="curl -X POST https://api.example.com/endpoint -H 'Content-Type: application/json'"
            value={curlCommand}
            onChange={(e) => setCurlCommand(e.target.value)}
            className="font-mono text-sm min-h-[150px]"
          />
          <div className="text-xs text-muted-foreground">
            Supports common cURL options including -X, -H, -d, and -u for authentication.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onImport} className="gap-2">
            <Terminal className="h-4 w-4" />
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function LockBodyScroll() {
  useLockBody()
  return null
}
