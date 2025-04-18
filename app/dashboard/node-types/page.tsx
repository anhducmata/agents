import ScenarioNodeTypes from "@/components/scenario-node-types"

export default function NodeTypesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Node Types Analysis</h1>
        <p className="text-muted-foreground mt-1">Detailed breakdown of node types across scenarios</p>
      </div>

      <ScenarioNodeTypes />
    </div>
  )
}
