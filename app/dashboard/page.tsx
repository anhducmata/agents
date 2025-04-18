import ScenariosDashboard from "@/components/scenarios-dashboard"
import ProtectedRoute from "@/components/auth/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Scenarios Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your voice assistant scenarios</p>
        </div>

        <ScenariosDashboard />
      </div>
    </ProtectedRoute>
  )
}
