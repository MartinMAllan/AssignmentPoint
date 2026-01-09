"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Platform Settings</h1>
          <p className="text-slate-400 mt-1">Configure platform-wide settings</p>
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="revenue">Revenue Rules</TabsTrigger>
            <TabsTrigger value="platform">Platform</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Revenue Distribution</CardTitle>
                <CardDescription className="text-slate-400">Configure revenue sharing percentages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-100">New Customers</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="writer-new" className="text-slate-300">
                        Writer %
                      </Label>
                      <Input
                        id="writer-new"
                        type="number"
                        defaultValue="40"
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agent-new" className="text-slate-300">
                        Sales Agent %
                      </Label>
                      <Input id="agent-new" type="number" defaultValue="10" className="bg-slate-800 border-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editor-new" className="text-slate-300">
                        Editor %
                      </Label>
                      <Input id="editor-new" type="number" defaultValue="5" className="bg-slate-800 border-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manager-new" className="text-slate-300">
                        Manager %
                      </Label>
                      <Input
                        id="manager-new"
                        type="number"
                        defaultValue="5"
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-100">Returning Customers</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="writer-returning" className="text-slate-300">
                        Writer %
                      </Label>
                      <Input
                        id="writer-returning"
                        type="number"
                        defaultValue="45"
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agent-returning" className="text-slate-300">
                        Sales Agent %
                      </Label>
                      <Input
                        id="agent-returning"
                        type="number"
                        defaultValue="5"
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platform" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Platform Configuration</CardTitle>
                <CardDescription className="text-slate-400">General platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name" className="text-slate-300">
                    Platform Name
                  </Label>
                  <Input id="platform-name" defaultValue="Assignment Point" className="bg-slate-800 border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email" className="text-slate-300">
                    Support Email
                  </Label>
                  <Input
                    id="support-email"
                    type="email"
                    defaultValue="support@assignmentpoint.com"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Notification Settings</CardTitle>
                <CardDescription className="text-slate-400">Configure system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Notification settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
