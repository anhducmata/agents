/**
 * Check if localStorage is available
 * @returns true if localStorage is available, false otherwise
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false

    const testKey = "__storage_test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Safe localStorage getItem that works in both browser and SSR
 * @param key - The key to get
 * @returns The value or null if not found or localStorage is not available
 */
export function safeLocalStorageGet(key: string): string | null {
  if (!isLocalStorageAvailable()) return null
  return localStorage.getItem(key)
}

/**
 * Safe localStorage setItem that works in both browser and SSR
 * @param key - The key to set
 * @param value - The value to set
 * @returns true if successful, false otherwise
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) return false
  try {
    localStorage.setItem(key, value)
    return true
  } catch (e) {
    return false
  }
}
