"use client"

import { useRef, useEffect } from "react"
import { Trash2 } from "lucide-react"

interface ContextMenuProps {
  x: number
  y: number
  onDelete: () => void
  onClose: () => void
  itemType: "node" | "edge"
  itemLabel?: string
}

export function ContextMenu({ x, y, onDelete, onClose, itemType, itemLabel }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="absolute z-50 min-w-[160px] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 text-sm"
      style={{ left: x, top: y }}
    >
      <div className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        {itemType === "node" ? "Agent/Tool" : "Connection"}
        {itemLabel ? `: ${itemLabel}` : ""}
      </div>
      <button
        className="flex w-full items-center px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={onDelete}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete {itemType === "node" ? "item" : "connection"}
      </button>
    </div>
  )
}
