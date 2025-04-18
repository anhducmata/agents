"use client"

import React from "react"
import { useState } from "react"
import {
  BarChart3,
  Database,
  Bot,
  Wrench,
  Key,
  MessageSquare,
  Settings,
  Beaker,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  SettingsIcon,
  LogIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import AgentsPage from "@/components/agents-page"
import ToolsPage from "@/components/tools-page"
import RagDataPage from "@/components/rag-data-page"
import AnalyticsPage from "@/components/analytics-page"
import WidgetSettingsPage from "@/components/widget-settings-page"
import TranscriptionHistoryPage from "@/components/transcription-history-page"
import SecretsManagementPage from "@/components/secrets-management-page"
import TestModePage from "@/components/test-mode-page"
import ScenariosPage from "@/components/scenarios-page"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("agents")
  const [agentToEdit, setAgentToEdit] = React.useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [userProfile, setUserProfile] = useState({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/avatars/avatar-female-02.svg",
  })

  const isActive = (view: string) => activeView === view

  const handleSignIn = () => {
    setIsAuthenticated(true)
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setActiveModal(null)
  }

  const openModal = (modalName: string) => {
    setActiveModal(modalName)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-all duration-300 ease-in-out relative",
          isSidebarExpanded ? "w-64" : "w-16",
        )}
      >
        {/* Toggle button positioned in the middle of the right border */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-50 dark:bg-gray-900 rounded-full p-1 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out shadow-sm z-10"
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <div className="transition-transform duration-300 ease-in-out">
            {isSidebarExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </button>
        <div className={cn("transition-all duration-300 ease-in-out", isSidebarExpanded ? "p-6" : "p-4 text-center")}>
          <div
            className={cn(
              "transition-opacity duration-300 ease-in-out",
              isSidebarExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden",
            )}
          >
            <h1 className="text-2xl font-bold">Voice Assistant</h1>
          </div>
          <div
            className={cn(
              "transition-opacity duration-300 ease-in-out",
              isSidebarExpanded ? "opacity-0 h-0 overflow-hidden" : "opacity-100",
            )}
          >
            <Bot className="h-6 w-6 mx-auto" />
          </div>
        </div>
        <nav
          className={cn(
            "flex-grow transition-all duration-300 ease-in-out",
            isSidebarExpanded ? "p-6 space-y-2" : "p-3 space-y-2",
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("agents") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("agents")}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Agents
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Agents</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("scenarios") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("scenarios")}
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Scenarios
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Scenarios</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("tools") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("tools")}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Tools
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Tools</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("rag-data") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("rag-data")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    RAG Data
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">RAG Data</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("analytics") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("analytics")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Analytics
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Analytics</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("transcriptions") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("transcriptions")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Conversations
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Conversations</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("secrets") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("secrets")}
                >
                  <Key className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Secrets
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Secrets</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("widget-settings") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("widget-settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Widget
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Widget</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-300 ease-in-out",
                    isActive("test-mode") && "bg-gray-100 dark:bg-gray-800",
                    !isSidebarExpanded && "justify-center p-2",
                  )}
                  onClick={() => setActiveView("test-mode")}
                >
                  <Beaker className="h-4 w-4 mr-2" />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-in-out",
                      isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                    )}
                  >
                    Test Mode
                  </span>
                </Button>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Test Mode</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </nav>
        <div
          className={cn(
            "border-t border-gray-200 dark:border-gray-800 mt-auto transition-all duration-300 ease-in-out",
            isSidebarExpanded ? "p-6 pt-4" : "p-3 pt-3",
          )}
        >
          {isAuthenticated ? (
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full text-sm transition-all duration-300 ease-in-out",
                          isSidebarExpanded ? "justify-start" : "justify-center p-2",
                        )}
                      >
                        <div className={cn("flex items-center", isSidebarExpanded ? "w-full" : "justify-center")}>
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span
                            className={cn(
                              "transition-opacity duration-300 ease-in-out",
                              isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                            )}
                          >
                            {userProfile.name}
                          </span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  {!isSidebarExpanded && <TooltipContent side="right">{userProfile.name}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userProfile.name}</p>
                    <p className="text-xs text-muted-foreground">{userProfile.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openModal("settings")}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal("payment")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Payment</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal("terms")}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Terms & Privacy</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal("help")}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className={cn("space-y-2", !isSidebarExpanded && "space-y-3")}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full text-sm transition-all duration-300 ease-in-out",
                        isSidebarExpanded ? "justify-start" : "justify-center p-2",
                      )}
                      onClick={handleSignIn}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      <span
                        className={cn(
                          "transition-opacity duration-300 ease-in-out",
                          isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                        )}
                      >
                        Sign In
                      </span>
                    </Button>
                  </TooltipTrigger>
                  {!isSidebarExpanded && <TooltipContent side="right">Sign In</TooltipContent>}
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      className={cn(
                        "w-full text-sm transition-all duration-300 ease-in-out",
                        isSidebarExpanded ? "justify-start" : "justify-center p-2",
                      )}
                      onClick={handleSignIn}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      <span
                        className={cn(
                          "transition-opacity duration-300 ease-in-out",
                          isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                        )}
                      >
                        Sign Up
                      </span>
                    </Button>
                  </TooltipTrigger>
                  {!isSidebarExpanded && <TooltipContent side="right">Sign Up</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeView === "agents" && <AgentsPage agentToEdit={agentToEdit} setAgentToEdit={setAgentToEdit} />}
        {activeView === "scenarios" && <ScenariosPage />}
        {activeView === "tools" && <ToolsPage onNavigateToAgent={setAgentToEdit} />}
        {activeView === "rag-data" && <RagDataPage />}
        {activeView === "analytics" && <AnalyticsPage />}
        {activeView === "transcriptions" && <TranscriptionHistoryPage />}
        {activeView === "secrets" && <SecretsManagementPage />}
        {activeView === "widget-settings" && <WidgetSettingsPage />}
        {activeView === "test-mode" && <TestModePage />}
      </div>
      {/* Modals */}
      <Dialog open={activeModal === "settings"} onOpenChange={() => activeModal === "settings" && closeModal()}>
        <DialogContent className="w-[60vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Manage your account settings and preferences.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Profile Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={userProfile.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={userProfile.email} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Avatar</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "payment"} onOpenChange={() => activeModal === "payment" && closeModal()}>
        <DialogContent className="w-[60vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Methods</DialogTitle>
            <DialogDescription>Manage your payment methods and billing information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Plan</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Pro Plan</p>
                    <p className="text-sm text-muted-foreground">$29/month</p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
              </div>

              <h3 className="text-lg font-medium">Payment Methods</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <Button className="w-full">Add Payment Method</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "terms"} onOpenChange={() => activeModal === "terms" && closeModal()}>
        <DialogContent className="w-[60vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms & Privacy</DialogTitle>
            <DialogDescription>Our terms of service and privacy policy.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Terms of Service</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg h-64 overflow-y-auto">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt,
                  nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies
                  tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                </p>
                {/* More terms content would go here */}
              </div>

              <h3 className="text-lg font-medium">Privacy Policy</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg h-64 overflow-y-auto">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt,
                  nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies
                  tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                </p>
                {/* More privacy content would go here */}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "help"} onOpenChange={() => activeModal === "help" && closeModal()}>
        <DialogContent className="w-[60vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
            <DialogDescription>Get help with using our voice assistant platform.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium">How do I create a new agent?</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Navigate to the Agents tab and click the "Create Agent" button. Follow the steps in the wizard to
                    configure your new agent.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium">How do I connect a tool to my agent?</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    In the agent editor, go to the Tools tab and select the tools you want to connect from the available
                    list.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium">How do I test my voice assistant?</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use the Test Mode tab to interact with your voice assistant and test its responses in a sandbox
                    environment.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-medium">Contact Support</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm">
                    Need more help? Contact our support team at{" "}
                    <a href="mailto:support@example.com" className="text-blue-600 dark:text-blue-400">
                      support@example.com
                    </a>
                  </p>
                </div>
                <Button className="w-full">Open Support Ticket</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
