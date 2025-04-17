"use client"

import { useState } from "react"
import {
  Save,
  Copy,
  Check,
  Smartphone,
  Monitor,
  MessageSquare,
  Bot,
  Sparkles,
  Headphones,
  Mic,
  HelpCircle,
  Volume2,
  PlayCircle,
  MessageSquareMore,
  AudioWaveform,
  Phone,
  PhoneCall,
  BellRing,
  BotMessageSquare,
  LifeBuoy,
  MessageCircleQuestion,
  BadgeInfo,
  ShoppingBasket,
  ShoppingCart,
  TicketPercent,
  BookImage,
  Contact,
  Star,
  Ticket,
  Shell,
  Zap,
  Flame,
  Rocket,
  ScrollText,
  Crown,
  Receipt,
  Speech,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

export default function WidgetSettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance")
  const [widgetSettings, setWidgetSettings] = useState({
    appearance: {
      theme: "light",
      primaryColor: "#3b82f6",
      textColor: "#ffffff", // Add this new property
      borderRadius: 12,
      position: "right",
      iconStyle: "chat",
      customIcon: "",
      showBranding: true,
      widgetShape: "icon",
      buttonText: "Chat with us",
    },
    behavior: {
      welcomeMessage: "Hi there! How can I help you today?",
      agentId: "agent-1",
      autoOpen: false,
      collectUserInfo: true,
      requireEmail: true,
      collectFeedback: true,
      showAttachments: true,
      showTranscript: true,
    },
    advanced: {
      customCSS: "",
      customJS: "",
      allowedDomains: ["example.com"],
      customDomain: "",
      enableAnalytics: true,
      debugMode: false,
    },
  })

  const [copySuccess, setCopySuccess] = useState(false)

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setWidgetSettings({
      ...widgetSettings,
      [category]: {
        ...widgetSettings[category as keyof typeof widgetSettings],
        [setting]: value,
      },
    })
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    console.log("Saving settings:", widgetSettings)
    // Show a success message
    alert("Widget settings saved successfully!")
  }

  const copyEmbedCode = () => {
    const embedCode = `<script src="https://voice-assistant.example.com/widget.js" data-agent-id="${widgetSettings.behavior.agentId}" data-primary-color="${widgetSettings.appearance.primaryColor}"></script>`
    navigator.clipboard.writeText(embedCode)
    setCopySuccess(true)

    // Reset after 2 seconds
    setTimeout(() => {
      setCopySuccess(false)
    }, 2000)
  }

  // Define all available icons
  const allIcons = [
    { value: "chat", label: "Chat", icon: MessageSquare },
    { value: "messageSquareMore", label: "Chat+", icon: MessageSquareMore },
    { value: "messageCircleQuestion", label: "Question", icon: MessageCircleQuestion },
    { value: "bot", label: "Bot", icon: Bot },
    { value: "botMessageSquare", label: "Bot Chat", icon: BotMessageSquare },
    { value: "headphones", label: "Support", icon: Headphones },
    { value: "phone", label: "Phone", icon: Phone },
    { value: "phoneCall", label: "Call", icon: PhoneCall },
    { value: "mic", label: "Voice", icon: Mic },
    { value: "audioWaveform", label: "Audio", icon: AudioWaveform },
    { value: "volume", label: "Sound", icon: Volume2 },
    { value: "speech", label: "Speech", icon: Speech },
    { value: "helpCircle", label: "Help", icon: HelpCircle },
    { value: "lifeBuoy", label: "Support", icon: LifeBuoy },
    { value: "badgeInfo", label: "Info", icon: BadgeInfo },
    { value: "bellRing", label: "Alert", icon: BellRing },
    { value: "play", label: "Play", icon: PlayCircle },
    { value: "shoppingBasket", label: "Basket", icon: ShoppingBasket },
    { value: "shoppingCart", label: "Cart", icon: ShoppingCart },
    { value: "ticketPercent", label: "Discount", icon: TicketPercent },
    { value: "ticket", label: "Ticket", icon: Ticket },
    { value: "bookImage", label: "Catalog", icon: BookImage },
    { value: "contact", label: "Contact", icon: Contact },
    { value: "star", label: "Star", icon: Star },
    { value: "shell", label: "Shell", icon: Shell },
    { value: "zap", label: "Zap", icon: Zap },
    { value: "flame", label: "Flame", icon: Flame },
    { value: "rocket", label: "Rocket", icon: Rocket },
    { value: "scrollText", label: "Scroll", icon: ScrollText },
    { value: "crown", label: "Crown", icon: Crown },
    { value: "receipt", label: "Receipt", icon: Receipt },
    { value: "sparkles", label: "Custom", icon: Sparkles },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Widget Settings</h1>
          <p className="text-muted-foreground mt-1 text-xs">Customize your voice assistant widget for your website</p>
        </div>
        <Button onClick={handleSaveSettings} size="sm" className="gap-2 bg-black hover:bg-black/90 text-white">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>

      <div className="text-xs grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="relative border-[0.5px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
            <div className="relative z-10">
              <CardHeader>
                <CardTitle>Widget Configuration</CardTitle>
                <CardDescription>Customize how your widget looks and behaves on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="appearance">Design</TabsTrigger>
                    <TabsTrigger value="behavior">Behavior</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="appearance" className="space-y-8">
                    {/* Core Design Section */}
                    <div className="space-y-6">
                      <h3 className="text-sm font-medium">Core Design</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Theme */}
                        <div className="space-y-2">
                          <Label htmlFor="theme">Theme</Label>
                          <Select
                            value={widgetSettings.appearance.theme}
                            onValueChange={(value) => handleSettingChange("appearance", "theme", value)}
                          >
                            <SelectTrigger id="theme">
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System (Auto)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Position */}
                        <div className="space-y-2">
                          <Label>Widget Position</Label>
                          <RadioGroup
                            value={widgetSettings.appearance.position}
                            onValueChange={(value) => handleSettingChange("appearance", "position", value)}
                            className="grid grid-cols-3 gap-2"
                          >
                            {[
                              { value: "left", label: "Left" },
                              { value: "center", label: "Center" },
                              { value: "right", label: "Right" },
                            ].map((item) => (
                              <div key={item.value} className="relative">
                                <RadioGroupItem
                                  value={item.value}
                                  id={`position-${item.value}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={`position-${item.value}`}
                                  className="flex items-center justify-center p-2 border-[0.5px] rounded-md cursor-pointer transition-all
          hover:bg-muted/50 hover:border-primary/50
          peer-data-[state=checked]:bg-muted/70 peer-data-[state=checked]:border-primary
          peer-focus-visible:ring-2 peer-focus-visible:ring-primary"
                                >
                                  {item.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>

                      {/* Widget Shape */}
                      <div className="space-y-2">
                        <Label>Widget Shape</Label>
                        <RadioGroup
                          value={widgetSettings.appearance.widgetShape}
                          onValueChange={(value) => handleSettingChange("appearance", "widgetShape", value)}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="relative">
                            <RadioGroupItem value="icon" id="shape-icon" className="peer sr-only" />
                            <Label
                              htmlFor="shape-icon"
                              className="flex flex-col items-center gap-2 p-4 border-[0.5px] rounded-lg cursor-pointer transition-all
        hover:bg-muted/50 hover:border-primary/50
        peer-data-[state=checked]:bg-muted/70 peer-data-[state=checked]:border-primary
        peer-focus-visible:ring-2 peer-focus-visible:ring-primary"
                            >
                              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <MessageSquare className="h-6 w-6 text-gray-600" />
                              </div>
                            </Label>
                          </div>

                          <div className="relative">
                            <RadioGroupItem value="rectangle" id="shape-rectangle" className="peer sr-only" />
                            <Label
                              htmlFor="shape-rectangle"
                              className="flex flex-col items-center gap-2 p-4 border-[0.5px] rounded-lg cursor-pointer transition-all
        hover:bg-muted/50 hover:border-primary/50
        peer-data-[state=checked]:bg-muted/70 peer-data-[state=checked]:border-primary
        peer-focus-visible:ring-2 peer-focus-visible:ring-primary"
                            >
                              <div className="w-32 h-12 rounded-lg bg-gray-200 flex items-center justify-center gap-2">
                                <MessageSquare className="h-5 w-5 text-gray-600" />
                                <span className="text-xs text-gray-600">Chat with us</span>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Button Text - Only show if rectangle shape is selected */}
                      {widgetSettings.appearance.widgetShape === "rectangle" && (
                        <div className="space-y-2">
                          <Label htmlFor="buttonText">Button Text</Label>
                          <Input
                            id="buttonText"
                            placeholder="Chat with us"
                            value={widgetSettings.appearance.buttonText}
                            onChange={(e) => handleSettingChange("appearance", "buttonText", e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Colors Section */}
                    <div className="space-y-6 pt-2 border-t">
                      <h3 className="text-sm font-medium pt-4">Colors</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Background Color */}
                        <div className="space-y-2">
                          <Label htmlFor="primaryColor">Background Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                              id="primaryColor"
                              value={widgetSettings.appearance.primaryColor}
                              onChange={(e) => handleSettingChange("appearance", "primaryColor", e.target.value)}
                              title="Choose background color"
                            />
                            <Input
                              type="text"
                              value={widgetSettings.appearance.primaryColor}
                              onChange={(e) => handleSettingChange("appearance", "primaryColor", e.target.value)}
                              className="flex-1 font-mono text-xs"
                              placeholder="#000000"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {[
                              "#000000", // Black
                              "#3b82f6", // Blue
                              "#8b5cf6", // Purple
                              "#ec4899", // Pink
                              "#ef4444", // Red
                              "#f59e0b", // Orange
                              "#10b981", // Green
                              "#6b7280", // Gray
                            ].map((color) => (
                              <button
                                key={color}
                                type="button"
                                className="w-6 h-6 rounded-full transition-all hover:scale-110 border border-gray-200"
                                style={{ backgroundColor: color }}
                                onClick={() => handleSettingChange("appearance", "primaryColor", color)}
                                aria-label={`Select color ${color}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Text Color */}
                        <div className="space-y-2">
                          <Label htmlFor="textColor">Text Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                              id="textColor"
                              value={widgetSettings.appearance.textColor}
                              onChange={(e) => handleSettingChange("appearance", "textColor", e.target.value)}
                              title="Choose text color"
                            />
                            <Input
                              type="text"
                              value={widgetSettings.appearance.textColor}
                              onChange={(e) => handleSettingChange("appearance", "textColor", e.target.value)}
                              className="flex-1 font-mono text-xs"
                              placeholder="#ffffff"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {[
                              "#ffffff", // White
                              "#f8fafc", // Light gray
                              "#f1f5f9", // Lighter gray
                              "#e2e8f0", // Light slate
                              "#000000", // Black
                              "#1e293b", // Slate
                              "#334155", // Dark slate
                              "#475569", // Slate gray
                            ].map((color) => (
                              <button
                                key={color}
                                type="button"
                                className="w-6 h-6 rounded-full transition-all hover:scale-110 border border-gray-200"
                                style={{ backgroundColor: color }}
                                onClick={() => handleSettingChange("appearance", "textColor", color)}
                                aria-label={`Select text color ${color}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Border Radius */}
                      <div className="space-y-2">
                        <Label htmlFor="borderRadius">Border Radius ({widgetSettings.appearance.borderRadius}px)</Label>
                        <Slider
                          id="borderRadius"
                          min={0}
                          max={50}
                          step={1}
                          value={[widgetSettings.appearance.borderRadius]}
                          onValueChange={(value) => handleSettingChange("appearance", "borderRadius", value[0])}
                        />
                      </div>
                    </div>

                    {/* Icon Section */}
                    <div className="space-y-4 pt-2 border-t">
                      <h3 className="text-sm font-medium pt-3">Icon</h3>

                      <div className="space-y-2">
                        <RadioGroup
                          value={widgetSettings.appearance.iconStyle}
                          onValueChange={(value) => handleSettingChange("appearance", "iconStyle", value)}
                          className="grid grid-cols-6 md:grid-cols-10 gap-1.5"
                        >
                          {allIcons.map((item) => {
                            const Icon = item.icon
                            return (
                              <div key={item.value} className="relative">
                                <RadioGroupItem value={item.value} id={`icon-${item.value}`} className="peer sr-only" />
                                <Label
                                  htmlFor={`icon-${item.value}`}
                                  className="flex flex-col items-center gap-0.5 p-1.5 border-[0.5px] rounded-md cursor-pointer transition-all
  hover:bg-muted/50 hover:border-primary/50
  peer-data-[state=checked]:bg-muted/70 peer-data-[state=checked]:border-primary
  peer-focus-visible:ring-1 peer-focus-visible:ring-primary"
                                >
                                  <Icon className="h-4 w-4" />
                                  <span className="text-[8px] truncate w-full text-center">{item.label}</span>
                                </Label>
                              </div>
                            )
                          })}
                        </RadioGroup>
                      </div>

                      {/* Custom Icon - Only show if custom icon style is selected */}
                      {widgetSettings.appearance.iconStyle === "sparkles" && (
                        <div className="space-y-3 mt-2 p-3 bg-muted/20 rounded-lg border border-dashed">
                          <div className="space-y-1">
                            <Label htmlFor="customIcon">Custom Icon URL</Label>
                            <Input
                              id="customIcon"
                              placeholder="https://example.com/icon.svg"
                              value={widgetSettings.appearance.customIcon}
                              onChange={(e) => handleSettingChange("appearance", "customIcon", e.target.value)}
                            />
                            <p className="text-[10px] text-muted-foreground">Enter a URL to your custom icon</p>
                          </div>

                          {widgetSettings.appearance.customIcon && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-8 h-8 bg-white rounded-md border flex items-center justify-center overflow-hidden">
                                <img
                                  src={widgetSettings.appearance.customIcon || "/placeholder.svg"}
                                  alt="Custom icon preview"
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <span className="text-[10px]">Icon preview</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Branding Section */}
                    <div className="space-y-6 pt-2 border-t">
                      <h3 className="text-sm font-medium pt-4">Branding</h3>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="showBranding" className="cursor-pointer">
                          Show "Powered by" branding
                        </Label>
                        <Switch
                          id="showBranding"
                          checked={widgetSettings.appearance.showBranding}
                          onCheckedChange={(checked) => handleSettingChange("appearance", "showBranding", checked)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="behavior" className="space-y-8">
                    {/* Conversation Settings */}
                    <div className="space-y-6">
                      <h3 className="text-sm font-medium">Conversation Settings</h3>

                      <div className="space-y-2">
                        <Label htmlFor="welcomeMessage">Welcome Message</Label>
                        <Textarea
                          id="welcomeMessage"
                          placeholder="Enter a welcome message"
                          value={widgetSettings.behavior.welcomeMessage}
                          onChange={(e) => handleSettingChange("behavior", "welcomeMessage", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="agentId">Default Agent</Label>
                        <Select
                          value={widgetSettings.behavior.agentId}
                          onValueChange={(value) => handleSettingChange("behavior", "agentId", value)}
                        >
                          <SelectTrigger id="agentId">
                            <SelectValue placeholder="Select agent" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agent-1">Customer Support</SelectItem>
                            <SelectItem value="agent-2">Sales Assistant</SelectItem>
                            <SelectItem value="agent-3">Technical Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* User Experience */}
                    <div className="space-y-6 pt-2 border-t">
                      <h3 className="text-sm font-medium pt-4">User Experience</h3>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoOpen" className="cursor-pointer">
                          Auto-open widget after delay
                        </Label>
                        <Switch
                          id="autoOpen"
                          checked={widgetSettings.behavior.autoOpen}
                          onCheckedChange={(checked) => handleSettingChange("behavior", "autoOpen", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectFeedback" className="cursor-pointer">
                          Collect conversation feedback
                        </Label>
                        <Switch
                          id="collectFeedback"
                          checked={widgetSettings.behavior.collectFeedback}
                          onCheckedChange={(checked) => handleSettingChange("behavior", "collectFeedback", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="showAttachments" className="cursor-pointer">
                          Allow file attachments
                        </Label>
                        <Switch
                          id="showAttachments"
                          checked={widgetSettings.behavior.showAttachments}
                          onCheckedChange={(checked) => handleSettingChange("behavior", "showAttachments", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="showTranscript" className="cursor-pointer">
                          Allow transcript download
                        </Label>
                        <Switch
                          id="showTranscript"
                          checked={widgetSettings.behavior.showTranscript}
                          onCheckedChange={(checked) => handleSettingChange("behavior", "showTranscript", checked)}
                        />
                      </div>
                    </div>

                    {/* User Information */}
                    <div className="space-y-6 pt-2 border-t">
                      <h3 className="text-sm font-medium pt-4">User Information</h3>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectUserInfo" className="cursor-pointer">
                          Collect user information
                        </Label>
                        <Switch
                          id="collectUserInfo"
                          checked={widgetSettings.behavior.collectUserInfo}
                          onCheckedChange={(checked) => handleSettingChange("behavior", "collectUserInfo", checked)}
                        />
                      </div>

                      {widgetSettings.behavior.collectUserInfo && (
                        <div className="flex items-center justify-between ml-6">
                          <Label htmlFor="requireEmail" className="cursor-pointer">
                            Require email address
                          </Label>
                          <Switch
                            id="requireEmail"
                            checked={widgetSettings.behavior.requireEmail}
                            onCheckedChange={(checked) => handleSettingChange("behavior", "requireEmail", checked)}
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-8">
                    {/* Custom Code */}
                    <div className="space-y-6">
                      <h3 className="text-sm font-medium">Custom Code</h3>

                      <div className="space-y-2">
                        <Label htmlFor="customCSS">Custom CSS</Label>
                        <Textarea
                          id="customCSS"
                          placeholder=".voice-assistant-widget { /* custom styles */ }"
                          value={widgetSettings.advanced.customCSS}
                          onChange={(e) => handleSettingChange("advanced", "customCSS", e.target.value)}
                          rows={4}
                          className="font-mono text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customJS">Custom JavaScript</Label>
                        <Textarea
                          id="customJS"
                          placeholder="// Custom JavaScript code"
                          value={widgetSettings.advanced.customJS}
                          onChange={(e) => handleSettingChange("advanced", "customJS", e.target.value)}
                          rows={4}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    {/* Domain Settings */}
                    <div className="space-y-6 pt-2 border-t">
                      <h3 className="text-sm font-medium pt-4">Domain Settings</h3>

                      <div className="space-y-2">
                        <Label htmlFor="allowedDomains">Allowed Domains (one per line)</Label>
                        <Textarea
                          id="allowedDomains"
                          placeholder="example.com"
                          value={widgetSettings.advanced.allowedDomains.join("\n")}
                          onChange={(e) =>
                            handleSettingChange(
                              "advanced",
                              "allowedDomains",
                              e.target.value.split("\n").filter(Boolean),
                            )
                          }
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          Leave empty to allow all domains. Add domains without http:// or https://
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customDomain">Custom Domain</Label>
                        <Input
                          id="customDomain"
                          placeholder="widget.yourdomain.com"
                          value={widgetSettings.advanced.customDomain}
                          onChange={(e) => handleSettingChange("advanced", "customDomain", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Optional: Set up a custom domain for your widget (requires DNS configuration)
                        </p>
                      </div>
                    </div>

                    {/* Additional Settings */}
                    <div className="space-y-6 pt-2 border-t">
                      <h3 className="text-sm font-medium pt-4">Additional Settings</h3>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="enableAnalytics" className="cursor-pointer">
                          Enable analytics
                        </Label>
                        <Switch
                          id="enableAnalytics"
                          checked={widgetSettings.advanced.enableAnalytics}
                          onCheckedChange={(checked) => handleSettingChange("advanced", "enableAnalytics", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="debugMode" className="cursor-pointer">
                          Debug mode
                        </Label>
                        <Switch
                          id="debugMode"
                          checked={widgetSettings.advanced.debugMode}
                          onCheckedChange={(checked) => handleSettingChange("advanced", "debugMode", checked)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="relative border-[0.5px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
            <div className="relative z-10">
              <CardHeader>
                <CardTitle>Widget Preview</CardTitle>
                <CardDescription>See how your widget will appear on your website</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div
                  className={`relative w-full h-[400px] border-[0.5px] rounded-lg overflow-hidden ${widgetSettings.appearance.theme === "light" ? "bg-gray-50" : widgetSettings.appearance.theme === "dark" ? "bg-gray-900" : "bg-gray-50 dark:bg-gray-900"}`}
                >
                  <div
                    className={`absolute ${widgetSettings.appearance.position === "left" ? "left-4" : widgetSettings.appearance.position === "center" ? "left-1/2 transform -translate-x-1/2" : "right-4"} bottom-4`}
                  >
                    <div className="flex flex-col items-center">
                      {widgetSettings.appearance.widgetShape === "icon" ? (
                        <div
                          className={cn(
                            "flex items-center justify-center w-14 h-14 shadow-lg cursor-pointer",
                            "transition-transform hover:scale-110",
                          )}
                          style={{
                            backgroundColor: widgetSettings.appearance.primaryColor,
                            borderRadius: `${widgetSettings.appearance.borderRadius}px`,
                          }}
                        >
                          {/* Render the selected icon */}
                          {allIcons.map((item) => {
                            const Icon = item.icon
                            return (
                              widgetSettings.appearance.iconStyle === item.value && (
                                <Icon
                                  key={item.value}
                                  className="h-6 w-6"
                                  style={{ color: widgetSettings.appearance.textColor }}
                                />
                              )
                            )
                          })}
                          {widgetSettings.appearance.iconStyle === "sparkles" &&
                            widgetSettings.appearance.customIcon && (
                              <img
                                src={widgetSettings.appearance.customIcon || "/placeholder.svg"}
                                alt="Custom icon"
                                className="h-6 w-6 object-contain"
                              />
                            )}
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "flex items-center justify-center gap-2 px-4 h-12 shadow-lg cursor-pointer",
                            "transition-transform hover:scale-105",
                          )}
                          style={{
                            backgroundColor: widgetSettings.appearance.primaryColor,
                            borderRadius: `${widgetSettings.appearance.borderRadius}px`,
                          }}
                        >
                          {/* Render the selected icon */}
                          {allIcons.map((item) => {
                            const Icon = item.icon
                            return (
                              widgetSettings.appearance.iconStyle === item.value && (
                                <Icon
                                  key={item.value}
                                  className="h-5 w-5"
                                  style={{ color: widgetSettings.appearance.textColor }}
                                />
                              )
                            )
                          })}
                          {widgetSettings.appearance.iconStyle === "sparkles" &&
                            widgetSettings.appearance.customIcon && (
                              <img
                                src={widgetSettings.appearance.customIcon || "/placeholder.svg"}
                                alt="Custom icon"
                                className="h-5 w-5 object-contain"
                              />
                            )}
                          <span style={{ color: widgetSettings.appearance.textColor }} className="text-sm">
                            {widgetSettings.appearance.buttonText}
                          </span>
                        </div>
                      )}

                      {/* Add the "Powered by Mata Agent" text that only shows when branding is enabled */}
                      {widgetSettings.appearance.showBranding && (
                        <span className="text-[8px] mt-1 opacity-70">
                          <a
                            href="https://agent.ducmata.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            Powered by Mata Agent
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center items-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Monitor className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>Widget preview - {widgetSettings.appearance.theme} theme</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Monitor className="h-4 w-4" />
                    Desktop
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="relative border-[0.5px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
            <div className="relative z-10">
              <CardHeader>
                <CardTitle>Installation</CardTitle>
                <CardDescription>Add the widget to your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-md font-mono text-xs overflow-x-auto">
                  <code>{`<script src="https://voice-assistant.example.com/widget.js" data-agent-id="${widgetSettings.behavior.agentId}" data-primary-color="${widgetSettings.appearance.primaryColor}"></script>`}</code>
                </div>
                <Button onClick={copyEmbedCode} variant="outline" size="sm" className="w-full gap-2">
                  {copySuccess ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copySuccess ? "Copied!" : "Copy Embed Code"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Add this code to your website's HTML, just before the closing &lt;/body&gt; tag.
                </p>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
