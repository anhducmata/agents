"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { type EdgeProps, getBezierPath, EdgeLabelRenderer } from "reactflow"

export function EdgeText({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editableLabel, setEditableLabel] = useState(label as string)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false)
    }
  }

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: "#f0f0f0",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: 12,
            fontWeight: 500,
            pointerEvents: "all",
            minWidth: "100px",
            maxWidth: "200px",
            textAlign: "center",
            border: "1px solid #ccc",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            wordWrap: "break-word",
            whiteSpace: "normal",
            lineHeight: "1.4",
          }}
          className="nodrag nopan"
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={editableLabel}
              onChange={(e) => setEditableLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full text-center bg-transparent outline-none border-b border-gray-400"
              autoFocus
            />
          ) : (
            <div>{editableLabel}</div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
