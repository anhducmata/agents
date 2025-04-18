"use client"

import ScenarioFlowEditor from "@/components/scenario-flow-editor"

export default function EditScenarioPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-[calc(100vh-64px)]">
      <ScenarioFlowEditor scenarioId={params.id} />
    </div>
  )
}
