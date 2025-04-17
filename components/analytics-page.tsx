"use client"

import { useState } from "react"
import {
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  MessageSquare,
  Clock,
  Download,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Sample analytics data
const analyticsData = {
  conversations: {
    total: 2547,
    change: 12.5,
    increasing: true,
    data: [35, 42, 49, 38, 45, 55, 60, 58, 52, 48, 55, 62],
  },
  users: {
    total: 1283,
    change: 8.2,
    increasing: true,
    data: [20, 25, 30, 22, 28, 32, 38, 35, 30, 28, 32, 40],
  },
  avgDuration: {
    total: "3m 24s",
    change: -5.3,
    increasing: false,
    data: [240, 220, 210, 200, 220, 230, 210, 200, 190, 195, 205, 204],
  },
  satisfaction: {
    total: "87%",
    change: 2.1,
    increasing: true,
    data: [82, 83, 85, 84, 86, 85, 87, 86, 85, 86, 87, 87],
  },
  topIntents: [
    { name: "Product Information", value: 32 },
    { name: "Technical Support", value: 24 },
    { name: "Order Status", value: 18 },
    { name: "Pricing", value: 14 },
    { name: "Returns", value: 12 },
  ],
  topAgents: [
    { name: "Customer Support", value: 45 },
    { name: "Sales Assistant", value: 30 },
    { name: "Technical Support", value: 25 },
  ],
  responseTime: {
    avg: "1.8s",
    data: [2.1, 2.0, 1.9, 1.8, 1.7, 1.8, 1.7, 1.6, 1.7, 1.8, 1.8, 1.8],
  },
  hourlyActivity: [
    { hour: "00:00", value: 12 },
    { hour: "02:00", value: 8 },
    { hour: "04:00", value: 5 },
    { hour: "06:00", value: 10 },
    { hour: "08:00", value: 25 },
    { hour: "10:00", value: 48 },
    { hour: "12:00", value: 52 },
    { hour: "14:00", value: 60 },
    { hour: "16:00", value: 55 },
    { hour: "18:00", value: 40 },
    { hour: "20:00", value: 35 },
    { hour: "22:00", value: 20 },
  ],
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track and analyze your voice assistant performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="default"
            size="sm"
            className="gap-2 bg-black hover:bg-black/80 text-white dark:bg-black dark:hover:bg-black/80"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gap-2 bg-black hover:bg-black/80 text-white dark:bg-black dark:hover:bg-black/80"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="intents">Intents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Conversations"
              value={analyticsData.conversations.total.toLocaleString()}
              change={analyticsData.conversations.change}
              increasing={analyticsData.conversations.increasing}
              icon={<MessageSquare className="h-5 w-5" />}
            />
            <StatCard
              title="Unique Users"
              value={analyticsData.users.total.toLocaleString()}
              change={analyticsData.users.change}
              increasing={analyticsData.users.increasing}
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              title="Avg. Conversation Duration"
              value={analyticsData.avgDuration.total}
              change={analyticsData.avgDuration.change}
              increasing={analyticsData.avgDuration.increasing}
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              title="User Satisfaction"
              value={analyticsData.satisfaction.total}
              change={analyticsData.satisfaction.change}
              increasing={analyticsData.satisfaction.increasing}
              icon={<BarChart3 className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="relative border-[0.5px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              <div className="relative z-10">
                <CardHeader>
                  <CardTitle>Conversations Over Time</CardTitle>
                  <CardDescription>Number of conversations per day</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md border-[0.5px]">
                    <BarChart3 className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                </CardContent>
              </div>
            </Card>

            <Card className="relative border-[0.5px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              <div className="relative z-10">
                <CardHeader>
                  <CardTitle>Hourly Activity</CardTitle>
                  <CardDescription>Conversations by hour of day</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md border-[0.5px]">
                    <BarChart3 className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="relative border-[0.5px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              <div className="relative z-10">
                <CardHeader>
                  <CardTitle>Top Intents</CardTitle>
                  <CardDescription>Most common user intents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topIntents.map((intent, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{intent.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${intent.value}%` }} />
                          </div>
                          <span className="text-sm font-medium">{intent.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>

            <Card className="relative border-[0.5px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              <div className="relative z-10">
                <CardHeader>
                  <CardTitle>Agent Usage</CardTitle>
                  <CardDescription>Conversations by agent</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md border-[0.5px]">
                    <PieChart className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                </CardContent>
              </div>
            </Card>

            <Card className="relative border-[0.5px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              <div className="relative z-10">
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                  <CardDescription>Average agent response time</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md border-[0.5px]">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{analyticsData.responseTime.avg}</div>
                      <div className="text-sm text-muted-foreground mt-2">Average response time</div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations">
          <Card className="relative border-[0.5px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
            <div className="relative z-10">
              <CardHeader>
                <CardTitle>Conversation Analytics</CardTitle>
                <CardDescription>Detailed conversation metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md border-[0.5px]">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/30" />
                    <p className="mt-4 text-muted-foreground">Conversation analytics visualization</p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <Card className="relative border-[0.5px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
            <div className="relative z-10">
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Compare performance across different agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md border-[0.5px]">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/30" />
                    <p className="mt-4 text-muted-foreground">Agent performance visualization</p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="intents">
          <Card className="relative border-[0.5px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
            <div className="relative z-10">
              <CardHeader>
                <CardTitle>Intent Analysis</CardTitle>
                <CardDescription>Analyze user intents and conversation topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md border-[0.5px]">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/30" />
                    <p className="mt-4 text-muted-foreground">Intent analysis visualization</p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ title, value, change, increasing, icon }) {
  return (
    <Card className="relative border-[0.5px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div
            className={cn(
              "p-2 rounded-full",
              increasing
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {icon}
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          <div
            className={cn(
              "flex items-center",
              increasing ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
            )}
          >
            {increasing ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
            {Math.abs(change)}%
          </div>
          <span className="text-muted-foreground ml-2">vs. previous period</span>
        </div>
      </CardContent>
    </Card>
  )
}
