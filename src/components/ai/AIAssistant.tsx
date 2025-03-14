import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Sparkles,
  Settings,
  MessageSquare,
  Volume2,
  BrainCircuit,
} from "lucide-react";
import SuggestionList from "./SuggestionList";
import VoiceCommandInterface from "./VoiceCommandInterface";

interface AIAssistantProps {
  userName?: string;
  assistantName?: string;
  assistantAvatar?: string;
  isLoading?: boolean;
  onCommand?: (command: string) => void;
  onAddSuggestion?: (suggestion: any) => void;
  onSettingsClick?: () => void;
}

const AIAssistant = ({
  userName = "User",
  assistantName = "Nova",
  assistantAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=nova",
  isLoading = false,
  onCommand = () => {},
  onAddSuggestion = () => {},
  onSettingsClick = () => {},
}: AIAssistantProps) => {
  const [activeTab, setActiveTab] = useState<string>("suggestions");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [lastCommand, setLastCommand] = useState<string>("");

  const handleCommand = (command: string) => {
    setLastCommand(command);
    onCommand(command);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <Card className="w-full h-full overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg rounded-xl">
      <CardHeader className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src={assistantAvatar} alt={assistantName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {assistantName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-medium">
                {assistantName}
                <Badge
                  variant="outline"
                  className="ml-2 bg-indigo-100 text-indigo-800"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              </CardTitle>
              <p className="text-xs text-gray-500">
                Your intelligent task assistant
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs
          defaultValue="suggestions"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2 rounded-none border-b bg-muted/50">
            <TabsTrigger
              value="suggestions"
              className="data-[state=active]:bg-background"
            >
              <BrainCircuit className="h-4 w-4 mr-2" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="data-[state=active]:bg-background"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Voice Commands
            </TabsTrigger>
          </TabsList>

          <div className="p-4 h-[400px] overflow-y-auto">
            <TabsContent value="suggestions" className="mt-0 h-full">
              <SuggestionList
                isLoading={isLoading}
                onAddSuggestion={onAddSuggestion}
              />
            </TabsContent>

            <TabsContent value="voice" className="mt-0 h-full">
              <VoiceCommandInterface
                isListening={isListening}
                onToggleListening={toggleListening}
                onCommand={handleCommand}
              />
            </TabsContent>
          </div>
        </Tabs>

        {lastCommand && (
          <div className="p-3 bg-muted/30 border-t text-sm">
            <div className="flex items-start space-x-2">
              <MessageSquare className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <span className="font-medium">Last command:</span> {lastCommand}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
