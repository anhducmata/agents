"use client"

import { useState } from "react"
import { Trash2, Edit, Plus, X } from "lucide-react"
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
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddRule = () => {
    if (newRule.condition && newRule.handoffTo) {
      handleChange("handoffRules", [...(editedAgent.handoffRules || []), { ...newRule }])
      setNewRule({ condition: "", handoffTo: "" })
      setShowAddForm(false)
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
    <div className="space-y-5 relative pb-16">
      <div className="space-y-4">
        {editedAgent.handoffRules && editedAgent.handoffRules.length > 0 ? (
          <div className="space-y-3">
            {editedAgent.handoffRules.map((rule: any, index: number) => (
              <div key={index} className="relative flex flex-col p-4 rounded-md border bg-white group">
                {editingRuleIndex === index ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1 space-y-3 w-full">
                      <div>
                        <p className="text-sm font-medium mb-1">When</p>
                        <div className="relative ml-4">
                          <textarea
                            id={`condition-${index}`}
                            placeholder="Enter condition"
                            value={editingRule.condition}
                            onChange={(e) => {
                              const words = e.target.value.trim().split(/\s+/)
                              if (
                                words.length <= 256 ||
                                words.length < editingRule.condition.trim().split(/\s+/).length
                              ) {
                                setEditingRule({ ...editingRule, condition: e.target.value })
                              }
                            }}
                            className="w-full min-h-[80px] p-2 text-sm border-2 rounded-md transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                            {editingRule.condition.trim().split(/\s+/).filter(Boolean).length}/256 words
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Handoff to:</p>
                        <div className="ml-4">
                          <Select
                            value={editingRule.handoffTo}
                            onValueChange={(value) => setEditingRule({ ...editingRule, handoffTo: value })}
                          >
                            <SelectTrigger className="h-9 text-sm border-2 transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0">
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
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">When</p>
                          <p className="text-sm italic ml-4 bg-gray-50 p-2 rounded-md">{rule.condition}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Handoff to:</p>
                          <div
                            className="flex items-center gap-1 ml-4 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1 transition-colors w-fit"
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
                        </div>

                        {/* Check if the target agent has handoff rules */}
                        {editedAgent.handoffRules.some(
                          (r) =>
                            r !== rule && // Not the current rule
                            r.handoffTo.toLowerCase() === rule.handoffTo.toLowerCase(), // Same agent name (case insensitive)
                        ) && (
                          <div className="ml-4 border-l-2 border-gray-200 pl-3 py-1">
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
                    </div>
                    {/* Action buttons positioned absolutely outside the card */}
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRule(index)}
                        className="h-8 w-8 p-0 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                      >
                        <Edit className="h-3.5 w-3.5 text-gray-600" />
                        <span className="sr-only">Edit rule</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRule(index)}
                        className="h-8 w-8 p-0 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete rule</span>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No handoff rules defined.</p>
        )}

        {showAddForm && (
          <div className="border rounded-md p-4 bg-white relative">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Add New Rule</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddForm(false)
                  setNewRule({ condition: "", handoffTo: "" })
                }}
                className="h-7 w-7 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">When</p>
                <div className="relative ml-4">
                  <textarea
                    id="condition"
                    placeholder="Enter condition"
                    value={newRule.condition}
                    onChange={(e) => {
                      const words = e.target.value.trim().split(/\s+/)
                      if (words.length <= 256 || words.length < newRule.condition.trim().split(/\s+/).length) {
                        setNewRule({ ...newRule, condition: e.target.value })
                      }
                    }}
                    className="w-full min-h-[80px] p-2 text-sm border-2 rounded-md transition-colors focus:border-[hsl(240deg_1.85%_48.51%)] focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                    {newRule.condition.trim().split(/\s+/).filter(Boolean).length}/256 words
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Handoff to:</p>
                <div className="ml-4">
                  <Select
                    value={newRule.handoffTo}
                    onValueChange={(value) => setNewRule({ ...newRule, handoffTo: value })}
                  >
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
            </div>
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setNewRule({ condition: "", handoffTo: "" })
                }}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button onClick={handleAddRule} className="h-9 text-xs bg-black hover:bg-black/90 text-white">
                Add Rule
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Rule button at the bottom middle */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
          className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-black hover:bg-black/90 text-white shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Add Rule</span>
        </Button>
      </div>
    </div>
  )
}
