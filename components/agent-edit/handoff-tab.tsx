"use client"

import { useState } from "react"
import { Trash2, Edit } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HandoffTabProps {
  editedAgent: any
  handleChange: (field: string, value: any) => void
  availableAgents: string[]
  onNavigateToAgent?: (agentName: string) => void
}

export function HandoffTab({ editedAgent, handleChange, availableAgents, onNavigateToAgent }: HandoffTabProps) {
  const [newRule, setNewRule] = useState({ condition: "", handoffTo: "" })
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null)
  const [editingRule, setEditingRule] = useState({ condition: "", handoffTo: "" })

  const handleAddRule = () => {
    if (newRule.condition && newRule.handoffTo) {
      handleChange("handoffRules", [...(editedAgent.handoffRules || []), { ...newRule }])
      setNewRule({ condition: "", handoffTo: "" })
    }
  }

  const handleDeleteRule = (index: number) => {
    const updatedRules = [...editedAgent.handoffRules]
    updatedRules.splice(index, 1)
    handleChange("handoffRules", updatedRules)
  }

  const handleEditRule = (index: number) => {
    setEditingRuleIndex(index)
    setEditingRule({ ...editedAgent.handoffRules[index] })
  }

  const handleSaveEditedRule = () => {
    if (editingRuleIndex !== null && editingRule.condition && editingRule.handoffTo) {
      const updatedRules = [...editedAgent.handoffRules]
      updatedRules[editingRuleIndex] = { ...editingRule }
      handleChange("handoffRules", updatedRules)
      setEditingRuleIndex(null)
      setEditingRule({ condition: "", handoffTo: "" })
    }
  }

  const handleCancelEditRule = () => {
    setEditingRuleIndex(null)
    setEditingRule({ condition: "", handoffTo: "" })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {editedAgent.handoffRules && editedAgent.handoffRules.length > 0 ? (
          <div className="space-y-3">
            {editedAgent.handoffRules.map((rule: any, index: number) => (
              <div key={index} className="flex flex-col p-4 rounded-md border bg-white group">
                {editingRuleIndex === index ? (
                  <div className="flex flex-col space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <div className="space-y-2">
                        <Label htmlFor={`condition-${index}`} className="text-sm font-medium">
                          Condition
                        </Label>
                        <Input
                          id={`condition-${index}`}
                          placeholder="Condition"
                          value={editingRule.condition}
                          onChange={(e) => setEditingRule({ ...editingRule, condition: e.target.value })}
                          className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`agent-${index}`} className="text-sm font-medium">
                          Handoff To
                        </Label>
                        <Select
                          value={editingRule.handoffTo}
                          onValueChange={(value) => setEditingRule({ ...editingRule, handoffTo: value })}
                        >
                          <SelectTrigger
                            id={`agent-${index}`}
                            className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <SelectValue placeholder="Select Agent">
                              {editingRule.handoffTo && (
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    <img
                                      src={`/avatars/avatar-${
                                        editingRule.handoffTo.toLowerCase().includes("customer")
                                          ? "female-13"
                                          : editingRule.handoffTo.toLowerCase().includes("technical")
                                            ? "male-13"
                                            : editingRule.handoffTo.toLowerCase().includes("sales")
                                              ? "male-01"
                                              : "male-17"
                                      }.svg`}
                                      alt={editingRule.handoffTo}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span>{editingRule.handoffTo}</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {availableAgents.map((agent) => (
                              <SelectItem key={agent} value={agent} className="text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    <img
                                      src={`/avatars/avatar-${
                                        agent.toLowerCase().includes("customer")
                                          ? "female-13"
                                          : agent.toLowerCase().includes("technical")
                                            ? "male-13"
                                            : agent.toLowerCase().includes("sales")
                                              ? "male-01"
                                              : "male-17"
                                      }.svg`}
                                      alt={agent}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span>{agent}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={handleSaveEditedRule}
                        className="h-9 text-xs bg-black hover:bg-black/90 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEditRule}
                        className="h-9 text-xs text-black border-black"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">If</span> <span className="italic">{rule.condition}</span>{" "}
                          <span className="font-medium">then handoff to:</span>
                        </p>
                        <div
                          className="flex items-center gap-1 mt-2 ml-4 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1 transition-colors w-fit"
                          onClick={() => onNavigateToAgent && onNavigateToAgent(rule.handoffTo)}
                          title={`Go to ${rule.handoffTo}`}
                        >
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            <img
                              src={`/avatars/avatar-${
                                rule.handoffTo.toLowerCase().includes("customer")
                                  ? "female-13"
                                  : rule.handoffTo.toLowerCase().includes("technical")
                                    ? "male-13"
                                    : rule.handoffTo.toLowerCase().includes("sales")
                                      ? "male-01"
                                      : "male-17"
                              }.svg`}
                              alt={rule.handoffTo}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium">{rule.handoffTo}</span>
                        </div>

                        {/* Check if the target agent has handoff rules */}
                        {editedAgent.handoffRules.some(
                          (r) =>
                            r !== rule && // Not the current rule
                            r.handoffTo.toLowerCase() === rule.handoffTo.toLowerCase(), // Same agent name (case insensitive)
                        ) && (
                          <div className="mt-2 ml-8 border-l-2 border-gray-200 pl-3 py-1">
                            <p className="text-xs text-muted-foreground">This agent may further handoff to:</p>
                            <ul className="mt-1 space-y-1">
                              {editedAgent.handoffRules
                                .filter(
                                  (r) =>
                                    r !== rule && // Not the current rule
                                    r.handoffTo.toLowerCase() === rule.handoffTo.toLowerCase(), // Same agent name
                                )
                                .map((nestedRule, nestedIndex) => (
                                  <li key={nestedIndex} className="text-xs flex items-center gap-1">
                                    <span>If</span> <span className="italic">{nestedRule.condition}</span>{" "}
                                    <span>then to</span>{" "}
                                    <div className="flex items-center gap-1">
                                      <div className="w-3 h-3 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                        <img
                                          src={`/avatars/avatar-${
                                            nestedRule.handoffTo.toLowerCase().includes("customer")
                                              ? "female-13"
                                              : nestedRule.handoffTo.toLowerCase().includes("technical")
                                                ? "male-13"
                                                : nestedRule.handoffTo.toLowerCase().includes("sales")
                                                  ? "male-01"
                                                  : "male-17"
                                          }.svg`}
                                          alt={nestedRule.handoffTo}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <span className="font-medium">{nestedRule.handoffTo}</span>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 group">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRule(index)}
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit rule</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteRule(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete rule</span>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No handoff rules defined.</p>
        )}

        <div className="border rounded-md p-4 bg-white">
          <h4 className="text-sm font-medium mb-2">Add New Rule</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="condition" className="text-sm font-medium">
                Condition
              </Label>
              <Input
                id="condition"
                placeholder="Enter condition"
                value={newRule.condition}
                onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div>
              <Label htmlFor="handoffTo" className="text-sm font-medium">
                Handoff To
              </Label>
              <Select value={newRule.handoffTo} onValueChange={(value) => setNewRule({ ...newRule, handoffTo: value })}>
                <SelectTrigger className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select Agent">
                    {newRule.handoffTo && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          <img
                            src={`/avatars/avatar-${
                              newRule.handoffTo.toLowerCase().includes("customer")
                                ? "female-13"
                                : newRule.handoffTo.toLowerCase().includes("technical")
                                  ? "male-13"
                                  : newRule.handoffTo.toLowerCase().includes("sales")
                                    ? "male-01"
                                    : "male-17"
                            }.svg`}
                            alt={newRule.handoffTo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>{newRule.handoffTo}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableAgents.map((agent) => (
                    <SelectItem key={agent} value={agent} className="text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          <img
                            src={`/avatars/avatar-${
                              agent.toLowerCase().includes("customer")
                                ? "female-13"
                                : agent.toLowerCase().includes("technical")
                                  ? "male-13"
                                  : agent.toLowerCase().includes("sales")
                                    ? "male-01"
                                    : "male-17"
                            }.svg`}
                            alt={agent}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>{agent}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddRule} className="mt-4 h-9 text-xs bg-black hover:bg-black/90 text-white">
            Add Rule
          </Button>
        </div>
      </div>
    </div>
  )
}

