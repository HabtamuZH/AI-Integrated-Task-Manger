import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, SortDesc, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string (e.g., "2025-03-20")
  priority: "high" | "medium" | "low";
  completed: boolean;
}

interface TaskGridProps {
  tasks: Task[];
  isLoading?: boolean;
  onAddTask: () => void;
  onEditTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask: (id: string, completed: boolean) => void;
}

const TaskGrid = ({
  tasks,
  isLoading = false,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
}: TaskGridProps) => {
  const [filterBy, setFilterBy] = useState<
    "all" | "completed" | "active" | "high" | "medium" | "low"
  >("all");
  const [sortBy, setSortBy] = useState<"priority" | "dueDate" | "title">(
    "priority",
  );

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    switch (filterBy) {
      case "all":
        return true;
      case "completed":
        return task.completed;
      case "active":
        return !task.completed;
      case "high":
        return task.priority === "high";
      case "medium":
        return task.priority === "medium";
      case "low":
        return task.priority === "low";
      default:
        return true;
    }
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "priority": {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full h-full max-h-[600px] bg-white shadow-lg p-6 rounded-xl overflow-auto border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Tasks
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {sortedTasks.length} {sortedTasks.length === 1 ? "task" : "tasks"} •{" "}
            {filterBy !== "all" ? `Filtered by ${filterBy}` : "All tasks"}
          </p>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterBy("all")}>
                All Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("active")}>
                Active Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("completed")}>
                Completed Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("high")}>
                High Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("medium")}>
                Medium Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("low")}>
                Low Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <SortDesc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("priority")}>
                By Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
                By Due Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title")}>
                By Title
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={onAddTask} className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-700 dark:border-gray-600">
          <p className="text-gray-500 mb-4 dark:text-gray-400">
            No tasks match your current filters
          </p>
          <Button variant="outline" onClick={() => setFilterBy("all")}>
            Show All Tasks
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              dueDate={task.dueDate}
              priority={task.priority}
              completed={task.completed}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onComplete={onCompleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskGrid;
