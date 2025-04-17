"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  labels?: { min: string; mid: string; max: string }
  disabled?: boolean
  className?: string
}

export function RangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  labels,
  disabled = false,
  className,
  ...props
}: RangeSliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [displayValue, setDisplayValue] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(e.target.value)
    onChange(newValue)
    setDisplayValue(newValue)
  }

  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("relative py-4", className)}>
      <div className="relative">
        <div
          className="absolute h-2 bg-black rounded-full pointer-events-none"
          style={{
            width: `${percentage}%`,
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onMouseUp={() => {
            setIsDragging(false)
            setDisplayValue(null)
          }}
          onTouchEnd={() => {
            setIsDragging(false)
            setDisplayValue(null)
          }}
          onMouseLeave={() => isDragging && setIsDragging(false)}
          disabled={disabled}
          className={cn(
            "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-black/20",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer",
            "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4",
            "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:cursor-pointer",
            "[&::-ms-thumb]:appearance-none [&::-ms-thumb]:w-4 [&::-ms-thumb]:h-4",
            "[&::-ms-thumb]:rounded-full [&::-ms-thumb]:bg-black [&::-ms-thumb]:cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          {...props}
        />
      </div>

      {isDragging && labels && (
        <div className="absolute w-full flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1 mt-1">
          <span>{labels.min}</span>
          <span>{labels.mid}</span>
          <span>{labels.max}</span>
        </div>
      )}

      {isDragging && displayValue !== null && (
        <div
          className="absolute bg-black text-white text-xs px-2 py-1 rounded-md transform -translate-x-1/2"
          style={{
            left: `${percentage}%`,
            top: "-20px",
          }}
        >
          {displayValue.toFixed(step && step < 1 ? 1 : 0)}
        </div>
      )}
    </div>
  )
}
