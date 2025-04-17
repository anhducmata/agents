"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Database } from "lucide-react"

interface DataSourcesProps {
  tools: any[]
  onEditTool: (tool: any) => void
}

export function DataSources({ tools, onEditTool }: DataSourcesProps) {
  // Category icon mapping
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "data":
        return <Database className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const dataSources = tools.filter((tool) => tool.category === "data")

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">RAG Datasources</Label>
      </div>

      <div className="mt-2 max-h-[200px] overflow-y-auto rounded-md bg-white border border-solid border-[#f1f1f1] p-4">
        <div className="grid gap-2">
          {dataSources.map((datasource) => (
            <div
              key={datasource.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                false
                  ? "bg-primary/5 border-[hsl(240deg_1.85%_48.51%)]"
                  : "bg-background hover:bg-muted/50 border-input hover:border-[hsl(240deg_1.85%_48.51%)/50]"
              }`}
              onClick={() => onEditTool(datasource)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{datasource.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{datasource.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getCategoryIcon(datasource.category)}
                    <span className="capitalize">{datasource.category}</span>
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
