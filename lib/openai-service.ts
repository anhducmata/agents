// OpenAI service for making API calls to GPT-4o

interface OpenAICompletionRequest {
  model: string
  messages: Array<{
    role: string
    content: string
  }>
  temperature?: number
  max_tokens?: number
}

interface OpenAICompletionResponse {
  choices: Array<{
    message: {
      content: string
    }
    finish_reason: string
  }>
  usage: {
    total_tokens: number
  }
}

export async function generateWithGPT4o(prompt: string): Promise<string> {
  try {
    // Check if API key is available
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("OpenAI API key is not configured")
      throw new Error("OpenAI API key is not configured")
    }

    const requestBody: OpenAICompletionRequest = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that helps create voice agent instructions based on configuration settings.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API error:", errorData)
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as OpenAICompletionResponse
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    throw error
  }
}
