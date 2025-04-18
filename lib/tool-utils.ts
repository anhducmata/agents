import type { Tool } from "@/components/tools/types"

// Method badge color mapping
export const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "POST":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "PUT":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "DELETE":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  }
}

// Category icon mapping
export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "data":
      return "Database"
    case "action":
      return "Zap"
    case "utility":
      return "Wrench"
    case "integration":
      return "Globe"
    default:
      return "Code"
  }
}

export const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays}d ago`

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths}mo ago`
}

export const parseCurlCommand = (curlString: string) => {
  try {
    // Handle line continuation characters and normalize the command to a single line
    const normalizedCurl = curlString
      .replace(/\\\s*\n/g, " ") // Replace line continuation with space
      .replace(/\r\n|\n|\r/g, " ") // Replace any remaining newlines with spaces
      .trim()
      .replace(/^curl\s+/, "") // Remove the initial "curl" if present

    // Initialize the result object
    const result: any = {
      method: "GET", // Default method
      url: "",
      headers: [],
      parameters: [],
      body: "",
      authentication: {
        type: "none",
      },
    }

    // Extract URL - look for the URL that's not part of a header or data
    const urlMatch = normalizedCurl.match(/(?:(?:-X|--request)\s+[A-Z]+\s+)?['"]?(https?:\/\/[^'"]+)['"]?/)
    if (urlMatch) {
      result.url = urlMatch[1]

      // Add this new code to extract query parameters from the URL
      try {
        const url = new URL(result.url)

        // Extract query parameters
        if (url.search) {
          url.searchParams.forEach((value, key) => {
            result.parameters.push({
              name: key,
              type: "string",
              required: false,
              description: "",
              location: "query",
              default: value,
            })
          })

          // Remove query parameters from the URL
          result.url = `${url.origin}${url.pathname}`
        }
      } catch (e) {
        console.error("Error parsing URL:", e)
        // Keep the URL as is if there's an error
      }
    }

    // Extract method
    const methodMatch = normalizedCurl.match(/(?:-X|--request)\s+['"]?([A-Z]+)['"]?/)
    if (methodMatch) {
      result.method = methodMatch[1]
    } else if (normalizedCurl.includes("--data") || normalizedCurl.includes("-d ")) {
      // If there's data but no explicit method, it's likely a POST
      result.method = "POST"
    }

    // Extract headers
    const headerMatches = [...normalizedCurl.matchAll(/(?:--header|-H)\s+['"]([^:]+):\s*([^'"]+)['"]?/g)]
    for (const match of headerMatches) {
      const key = match[1].trim()
      const value = match[2].trim()

      // Check for auth headers
      if (key.toLowerCase() === "authorization") {
        if (value.startsWith("Bearer ")) {
          result.authentication = {
            type: "bearer",
            bearerToken: value.substring(7),
            secretId: "manual",
          }
        } else if (value.startsWith("Basic ")) {
          result.authentication = {
            type: "basic",
            secretId: "manual",
            // We'd need to decode base64 for username/password
          }
        }
      } else if (key.toLowerCase() === "x-api-key" || key.toLowerCase().includes("api-key")) {
        result.authentication = {
          type: "apiKey",
          apiKeyName: key,
          apiKeyValue: value,
          secretId: "manual",
        }
      } else {
        result.headers.push({ key, value })
      }
    }

    // Extract basic auth
    const userMatch = normalizedCurl.match(/(?:-u|--user)\s+['"]?([^:]+):([^'"]+)['"]?/)
    if (userMatch) {
      result.authentication = {
        type: "basic",
        username: userMatch[1],
        password: userMatch[2],
        secretId: "manual",
      }
    }

    // Extract data/body - this is more complex due to potential multi-line JSON
    const dataFlagIndex = normalizedCurl.search(/(?:--data|-d)\s+/)
    if (dataFlagIndex !== -1) {
      // Find the quote character used (single or double)
      const quoteMatch = normalizedCurl.substring(dataFlagIndex).match(/(?:--data|-d)\s+(['"])/)
      if (quoteMatch) {
        const quoteChar = quoteMatch[1]
        const startIndex = normalizedCurl.indexOf(quoteChar, dataFlagIndex) + 1

        // Find the matching end quote, accounting for escaped quotes
        let endIndex = startIndex
        let escaped = false

        while (endIndex < normalizedCurl.length) {
          const char = normalizedCurl[endIndex]

          if (char === "\\") {
            escaped = !escaped
          } else if (char === quoteChar && !escaped) {
            break
          } else {
            escaped = false
          }

          endIndex++
        }

        if (endIndex > startIndex) {
          const rawData = normalizedCurl.substring(startIndex, endIndex)

          // Try to parse as JSON
          try {
            // Handle special shell escape sequences for single quotes: '\''
            const cleanedData = rawData
              .replace(/\\'/g, "'") // Replace \' with '
              .replace(/'\\'''/g, "'") // Replace '\'' with '
              .replace(/'\\''/g, "'") // Replace \' with '
              .replace(/\\"/g, '"') // Replace \" with "
              .replace(/\\n/g, "\n") // Replace \n with newline
              .replace(/\\t/g, "\t") // Replace \t with tab

            // Try to parse the JSON
            let jsonData
            try {
              jsonData = JSON.parse(cleanedData)
            } catch (e) {
              // If direct parsing fails, try to fix common issues with JSON in curl commands
              // Sometimes the JSON might be malformed or have unescaped quotes
              console.log("First JSON parse attempt failed:", e)

              // Try to detect if this is a JSON object or array by checking first character
              if (cleanedData.trim().startsWith("{") || cleanedData.trim().startsWith("[")) {
                // Try a more aggressive approach for fixing JSON
                const fixedJson = cleanedData
                  .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Add quotes around unquoted keys
                  .replace(/'/g, '"') // Replace all single quotes with double quotes
                  .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas

                try {
                  jsonData = JSON.parse(fixedJson)
                } catch (e2) {
                  console.log("Second JSON parse attempt failed:", e2)
                  // If still can't parse, just use the raw data
                  result.body = rawData
                  result.bodyType = "text"

                  // But still mark it as JSON if it looks like JSON
                  if (rawData.trim().startsWith("{") || rawData.trim().startsWith("[")) {
                    result.bodyType = "json"
                  }
                  return result
                }
              } else {
                // Not JSON, treat as text
                result.body = rawData
                result.bodyType = "text"
                return result
              }
            }

            // If we got here, we successfully parsed the JSON
            result.body = JSON.stringify(jsonData, null, 2)
            result.bodyType = "json"
          } catch (e) {
            console.error("Error processing JSON:", e)
            // If all parsing attempts fail, just use the raw data
            result.body = rawData
            result.bodyType = "text"

            // But still mark it as JSON if it looks like JSON
            if (rawData.trim().startsWith("{") || rawData.trim().startsWith("[")) {
              result.bodyType = "json"
            }
          }
        }
      } else {
        // Handle case where data might not be quoted
        const dataMatch = normalizedCurl.match(/(?:--data|-d)\s+([^-][^\s]*)/)
        if (dataMatch) {
          result.body = dataMatch[1]
          result.bodyType = "text"

          // Check if it looks like JSON
          if (result.body.startsWith("{") || result.body.startsWith("[")) {
            result.bodyType = "json"
            try {
              const jsonData = JSON.parse(result.body)
              result.body = JSON.stringify(jsonData, null, 2)
            } catch (e) {
              // Keep as is if can't parse
            }
          }
        }
      }
    }

    return result
  } catch (error) {
    console.error("Error parsing cURL command:", error)
    return null
  }
}

export const generateCurlCommand = (tool: Tool) => {
  if (!tool) return ""

  let curl = `curl -X ${tool.method} "${tool.url}"`

  // Add headers
  if (tool.headers && tool.headers.length > 0) {
    tool.headers.forEach((header) => {
      curl += ` \\\n  -H "${header.key}: ${header.value}"`
    })
  }

  // Add authentication
  if (tool.authentication && tool.authentication.type !== "none") {
    if (tool.authentication.type === "basic" && tool.authentication.username && tool.authentication.password) {
      curl += ` \\\n  -u "${tool.authentication.username}:${tool.authentication.password}"`
    } else if (
      tool.authentication.type === "apiKey" &&
      tool.authentication.apiKeyName &&
      tool.authentication.apiKeyValue
    ) {
      curl += ` \\\n  -H "${tool.authentication.apiKeyName}: ${tool.authentication.apiKeyValue}"`
    } else if (tool.authentication.type === "bearer" && tool.authentication.bearerToken) {
      curl += ` \\\n  -H "Authorization: Bearer ${tool.authentication.bearerToken}"`
    }
  }

  // Add query parameters
  if (tool.parameters && tool.parameters.length > 0) {
    const queryParams = tool.parameters
      .filter((param) => param.location === "query")
      .map((param) => `${param.name}=${param.default || "{value}"}`)
      .join("&")

    if (queryParams) {
      // Check if URL already has query parameters
      if (tool.url.includes("?")) {
        curl = curl.replace(tool.url, `${tool.url}&${queryParams}`)
      } else {
        curl = curl.replace(tool.url, `${tool.url}?${queryParams}`)
      }
    }
  }

  // Add request body for POST, PUT, DELETE methods
  if ((tool.method === "POST" || tool.method === "PUT" || tool.method === "DELETE") && tool.body) {
    // Check if Content-Type header exists
    const contentTypeHeader = tool.headers?.find((h) => h.key.toLowerCase() === "content-type")
    const contentType = contentTypeHeader?.value || "application/json"

    if (contentType.includes("json") && tool.bodyType === "json") {
      // For JSON body, ensure it's properly escaped for the shell
      curl += ` \\\n  -d '${tool.body.replace(/'/g, "'\\''")}'`
    } else {
      // For other body types
      curl += ` \\\n  -d "${tool.body.replace(/"/g, '\\"')}"`
    }
  }

  return curl
}
