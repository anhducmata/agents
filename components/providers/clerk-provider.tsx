"use client"

import type React from "react"

import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        elements: {
          formButtonPrimary: "bg-black hover:bg-black/80",
          footerActionLink: "text-black hover:text-black/80",
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
