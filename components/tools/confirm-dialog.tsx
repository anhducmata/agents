"use client"

import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedAgent: string | null
  onConfirm: () => void
}

export function ConfirmDialog({ open, onOpenChange, selectedAgent, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-[0.5px]">
        <DialogHeader>
          <DialogTitle>Navigate to Agent</DialogTitle>
          <DialogDescription>
            Do you want to navigate to the Agents tab and open the "{selectedAgent}" agent?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} className="gap-2">
            <Bot className="h-4 w-4" />
            Go to Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
