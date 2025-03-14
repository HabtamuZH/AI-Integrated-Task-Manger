import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Palette, Bell, User, Moon, Sun, Volume2, VolumeX } from "lucide-react";

interface SettingsPanelProps {
  onThemeChange?: (theme: string) => void;
  onPersonalityChange?: (personality: string) => void;
  onNotificationChange?: (enabled: boolean) => void;
  currentTheme?: string;
  currentPersonality?: string;
  notificationsEnabled?: boolean;
}

const SettingsPanel = ({
  onThemeChange = () => {},
  onPersonalityChange = () => {},
  onNotificationChange = () => {},
  currentTheme = "light",
  currentPersonality = "friendly",
  notificationsEnabled = true,
}: SettingsPanelProps) => {
  const [theme, setTheme] = useState(currentTheme);
  const [personality, setPersonality] = useState(currentPersonality);
  const [notifications, setNotifications] = useState(notificationsEnabled);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  const handlePersonalityChange = (newPersonality: string) => {
    setPersonality(newPersonality);
    onPersonalityChange(newPersonality);
  };

  const handleNotificationToggle = (enabled: boolean) => {
    setNotifications(enabled);
    onNotificationChange(enabled);
  };

  return (
    <Card className="w-full max-w-[600px] h-auto max-h-[700px] overflow-y-auto bg-background dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl">Settings</CardTitle>
        <CardDescription>
          Customize your task management experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="appearance" className="flex-1">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1">
              <User className="mr-2 h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-24 p-4"
                  onClick={() => handleThemeChange("light")}
                >
                  <Sun className="h-8 w-8 mb-2" />
                  <span>Light</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-24 p-4"
                  onClick={() => handleThemeChange("dark")}
                >
                  <Moon className="h-8 w-8 mb-2" />
                  <span>Dark</span>
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-24 p-4"
                  onClick={() => handleThemeChange("system")}
                >
                  <div className="flex h-8 w-8 mb-2">
                    <Sun className="h-8 w-8 opacity-50" />
                    <Moon className="h-8 w-8 -ml-4" />
                  </div>
                  <span>System</span>
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Color Scheme</h3>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 p-4 border-blue-500 bg-blue-50 dark:bg-blue-950"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 mb-2"></div>
                  <span>Ocean</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 p-4 border-green-500 bg-green-50 dark:bg-green-950"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500 mb-2"></div>
                  <span>Forest</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 p-4 border-purple-500 bg-purple-50 dark:bg-purple-950"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500 mb-2"></div>
                  <span>Lavender</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">AI Assistant Personality</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={personality === "friendly" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-24 p-4"
                  onClick={() => handlePersonalityChange("friendly")}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=friendly"
                      alt="Friendly AI"
                      className="w-full h-full"
                    />
                  </div>
                  <span>Friendly</span>
                </Button>
                <Button
                  variant={
                    personality === "professional" ? "default" : "outline"
                  }
                  className="flex flex-col items-center justify-center h-24 p-4"
                  onClick={() => handlePersonalityChange("professional")}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=professional"
                      alt="Professional AI"
                      className="w-full h-full"
                    />
                  </div>
                  <span>Professional</span>
                </Button>
                <Button
                  variant={
                    personality === "motivational" ? "default" : "outline"
                  }
                  className="flex flex-col items-center justify-center h-24 p-4"
                  onClick={() => handlePersonalityChange("motivational")}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=motivational"
                      alt="Motivational AI"
                      className="w-full h-full"
                    />
                  </div>
                  <span>Motivational</span>
                </Button>
                <Button
                  variant={personality === "humorous" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-24 p-4"
                  onClick={() => handlePersonalityChange("humorous")}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=humorous"
                      alt="Humorous AI"
                      className="w-full h-full"
                    />
                  </div>
                  <span>Humorous</span>
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Voice Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="voice-type">Voice Type</Label>
                  </div>
                  <Select defaultValue="neutral">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="feminine">Feminine</SelectItem>
                      <SelectItem value="masculine">Masculine</SelectItem>
                      <SelectItem value="robotic">Robotic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="voice-enabled">Voice Feedback</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable voice responses from AI
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {soundEnabled ? (
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Switch
                      id="voice-enabled"
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for task reminders and updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>

              {notifications && (
                <>
                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Notification Preferences
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="task-due">Task Due Reminders</Label>
                        <Switch id="task-due" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="achievement">
                          Achievement Unlocked
                        </Label>
                        <Switch id="achievement" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="suggestions">AI Suggestions</Label>
                        <Switch id="suggestions" defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reminder-time">
                        Default Reminder Time
                      </Label>
                      <Select defaultValue="30min">
                        <SelectTrigger id="reminder-time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10min">
                            10 minutes before
                          </SelectItem>
                          <SelectItem value="30min">
                            30 minutes before
                          </SelectItem>
                          <SelectItem value="1hour">1 hour before</SelectItem>
                          <SelectItem value="1day">1 day before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-notifications">
                        Email Notifications
                      </Label>
                      <Input
                        id="email-notifications"
                        type="email"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
