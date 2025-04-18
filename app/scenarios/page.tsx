import ScenarioList from "@/components/scenario-list"
import ProtectedRoute from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ScenariosPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Scenarios</h1>
            <p className="text-muted-foreground mt-1">Create and manage your agent flow scenarios</p>
          </div>
          <Link href="/scenarios/new">
            <Button className="gap-2 bg-black hover:bg-black/90 text-white">
              <Plus className="h-4 w-4" />
              New Scenario
            </Button>
          </Link>
        </div>

        <ScenarioList />
      </div>
    </ProtectedRoute>
  )
}
