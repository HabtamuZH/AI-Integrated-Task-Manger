import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Edit, Trash2, Clock } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  priority: "high" | "medium" | "low";
  completed: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string, completed: boolean) => void;
}

const TaskCard = ({
  id,
  title,
  description,
  dueDate,
  priority,
  completed,
  onEdit,
  onDelete,
  onComplete,
}: TaskCardProps) => {
  const priorityBadgeVariants = {
    high: "destructive",
    medium: "default",
    low: "secondary",
  } as const;

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = !completed && new Date(dueDate) < new Date();

  return (
    <Card
      className={`w-full max-w-[320px] h-[180px] flex flex-col ${completed ? "opacity-70" : ""} bg-white hover:shadow-md transition-all duration-200 border-l-4 ${priority === "high" ? "border-l-red-500" : priority === "medium" ? "border-l-yellow-500" : "border-l-green-500"} dark:bg-gray-800`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle
              className={`text-lg ${completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-white"}`}
            >
              {title}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={priorityBadgeVariants[priority]}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </Badge>
              {completed && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <CardDescription
          className={`text-sm ${completed ? "text-gray-400" : "text-gray-600 dark:text-gray-300"} line-clamp-2`}
        >
          {description}
        </CardDescription>
        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-1" />
          <span>Due: {formatDueDate(dueDate)}</span>
        </div>
        {isOverdue && (
          <div className="mt-2 text-xs text-red-500 font-medium flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-1"></span>
            Overdue
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 pb-3 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="px-2"
          onClick={() => onComplete(id, !completed)}
        >
          <CheckCircle
            className={`h-4 w-4 mr-1 ${completed ? "text-green-500" : "text-gray-400"}`}
          />
          {completed ? "Undo" : "Complete"}
        </Button>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
            <Edit className="h-4 w-4 text-gray-500 dark:text-gray-300" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
            <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-300" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
