import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus, Star, Clock, Calendar } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
  estimatedTime?: string;
  dueDate?: string;
}

interface SuggestionListProps {
  suggestions?: SuggestionItem[];
  onAddSuggestion?: (suggestion: SuggestionItem) => void;
  isLoading?: boolean;
}

const SuggestionList = ({
  suggestions = [
    {
      id: "1",
      title: "Complete project documentation",
      description: "Update the README file with installation instructions",
      category: "work",
      priority: "high",
      estimatedTime: "1 hour",
      dueDate: "Tomorrow",
    },
    {
      id: "2",
      title: "Schedule dentist appointment",
      description: "Call Dr. Smith's office for a check-up",
      category: "personal",
      priority: "medium",
      dueDate: "This week",
    },
    {
      id: "3",
      title: "Research new productivity tools",
      description: "Look for task management alternatives",
      category: "self-improvement",
      priority: "low",
      estimatedTime: "30 minutes",
    },
  ],
  onAddSuggestion = () => {},
  isLoading = false,
}: SuggestionListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "bg-blue-100 text-blue-800";
      case "personal":
        return "bg-purple-100 text-purple-800";
      case "self-improvement":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white p-4 rounded-lg">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
        <p className="text-sm text-gray-500">
          Tasks you might want to add based on your patterns
        </p>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all"
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-medium">
                  {suggestion.title}
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onAddSuggestion(suggestion)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to tasks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription className="text-xs text-gray-500 mt-1">
                {suggestion.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-2 flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className={getCategoryColor(suggestion.category)}
              >
                {suggestion.category}
              </Badge>
              <Badge
                variant="outline"
                className={getPriorityColor(suggestion.priority)}
              >
                <Star className="h-3 w-3 mr-1" />
                {suggestion.priority}
              </Badge>
              {suggestion.estimatedTime && (
                <Badge variant="outline" className="bg-gray-100">
                  <Clock className="h-3 w-3 mr-1" />
                  {suggestion.estimatedTime}
                </Badge>
              )}
              {suggestion.dueDate && (
                <Badge variant="outline" className="bg-gray-100">
                  <Calendar className="h-3 w-3 mr-1" />
                  {suggestion.dueDate}
                </Badge>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No suggestions available right now</p>
          <p className="text-sm">
            Check back later for AI-generated task ideas
          </p>
        </div>
      )}
    </div>
  );
};

export default SuggestionList;
