import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Edit, Search, Tag, X } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

interface SearchResultsProps {
  searchQuery?: string;
  results?: Task[];
  isLoading?: boolean;
  onClearSearch?: () => void;
  onEditTask?: (id: string) => void;
  onCompleteTask?: (id: string, completed: boolean) => void;
}

const SearchResults = ({
  searchQuery = "",
  results = [],
  isLoading = false,
  onClearSearch = () => {},
  onEditTask = () => {},
  onCompleteTask = () => {},
}: SearchResultsProps) => {
  // Format due date for display
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get priority badge variant
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive">
            <Tag className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="default">
            <Tag className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="secondary">
            <Tag className="h-3 w-3 mr-1" />
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle className="text-xl">Searching...</CardTitle>
          <CardDescription>Looking for "{searchQuery}"</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Search Results</CardTitle>
            <CardDescription>
              {results.length} results for "{searchQuery}"
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClearSearch}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((task, index) => (
              <div key={task.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-6 w-6 rounded-full ${task.completed ? "bg-green-100" : "bg-gray-100"}`}
                      onClick={() => onCompleteTask(task.id, !task.completed)}
                    >
                      <CheckCircle
                        className={`h-4 w-4 ${task.completed ? "text-green-600" : "text-gray-400"}`}
                      />
                    </Button>
                    <div>
                      <h3
                        className={`text-base font-medium ${task.completed ? "line-through text-gray-500" : ""}`}
                      >
                        {task.title}
                      </h3>
                      <p
                        className={`text-sm ${task.completed ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {task.description.length > 100
                          ? `${task.description.substring(0, 100)}...`
                          : task.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getPriorityBadge(task.priority)}
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Due: {formatDueDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditTask(task.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                {index < results.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">
              No results found
            </h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchResults;
