"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  prefix?: string
  suffix?: string
}

export function InputWithLabel({ className, label, prefix, suffix, type, ...props }: InputWithLabelProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div className="flex h-12 w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {prefix && <div className="flex items-center justify-center px-3 text-muted-foreground">{prefix}</div>}
        <input
          type={type}
          className={cn(
            "h-full w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            !prefix && "rounded-l-md",
            !suffix && "rounded-r-md",
            className,
          )}
          {...props}
        />
        {suffix && <div className="flex items-center justify-center px-3 text-muted-foreground">{suffix}</div>}
      </div>
    </div>
  )
}
