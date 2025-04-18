"use client"

import { UserProfile } from "@clerk/nextjs"
import ProtectedRoute from "@/components/auth/protected-route"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="mt-8">
          <UserProfile />
        </div>
      </div>
    </ProtectedRoute>
  )
}
