import { type NextRequest, NextResponse } from "next/server"
import { generateWithGPT4o } from "@/lib/openai-service"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const generatedInstruction = await generateWithGPT4o(prompt)

    return NextResponse.json({ instruction: generatedInstruction })
  } catch (error) {
    console.error("Error generating instruction:", error)
    return NextResponse.json({ error: "Failed to generate instruction" }, { status: 500 })
  }
}
