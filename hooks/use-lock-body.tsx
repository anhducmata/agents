"use client"

import { useEffect } from "react"

/**
 * Custom hook to lock the body scroll when a modal is open
 */
export function useLockBody() {
  useEffect(() => {
    // Save the original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow

    // Lock the scroll by setting overflow to hidden
    document.body.style.overflow = "hidden"

    // Cleanup function to restore the original style when component unmounts
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])
}
