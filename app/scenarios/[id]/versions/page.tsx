import ScenarioVersionHistory from "@/components/scenario-version-history"

export default function ScenarioVersionsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <ScenarioVersionHistory scenarioId={params.id} />
    </div>
  )
}
