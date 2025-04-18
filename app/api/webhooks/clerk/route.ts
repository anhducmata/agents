import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { executeQuery } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error verifying webhook", {
      status: 400,
    })
  }

  // Handle the webhook event
  const { type, data } = evt

  try {
    switch (type) {
      case "user.created":
        // Handle user creation
        console.log(`User created: ${data.id}`)
        break
      case "user.updated":
        // Handle user update
        console.log(`User updated: ${data.id}`)
        break
      case "user.deleted":
        // Handle user deletion - you might want to delete or anonymize their data
        console.log(`User deleted: ${data.id}`)

        // Delete user's scenarios
        await executeQuery(`DELETE FROM scenarios WHERE user_id = $1`, [data.id])
        break
      default:
        console.log(`Unhandled webhook event: ${type}`)
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ error: "Error handling webhook" }, { status: 500 })
  }
}
