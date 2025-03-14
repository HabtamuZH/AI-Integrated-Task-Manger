import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, BrainCircuit, Plus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  subTasks: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskCreationFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  aiSuggestions?: string[];
  isOpen?: boolean;
  initialData?: {
    title: string;
    description?: string;
    dueDate?: Date | string; // Accepts ISO string or Date
    priority: "high" | "medium" | "low";
    subTasks?: string[];
  };
  isEditing?: boolean;
}

const TaskCreationForm = ({
  onSubmit,
  aiSuggestions = [],
  isOpen = true,
  initialData,
  isEditing = false,
}: TaskCreationFormProps) => {
  const [subTasks, setSubTasks] = useState<string[]>(
    initialData?.subTasks || [],
  );
  const [newSubTask, setNewSubTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || "",
          dueDate: initialData.dueDate
            ? new Date(initialData.dueDate)
            : undefined,
          priority: initialData.priority,
          subTasks: initialData.subTasks || [],
        }
      : {
          title: "",
          description: "",
          priority: "medium",
          subTasks: [],
        },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = {
        ...values,
        subTasks,
        dueDate:
          values.dueDate ||
          new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 1 week from now
      };
      await onSubmit(formData);
      form.reset();
      setSubTasks([]);
    } catch (err) {
      setError("Failed to save task. Please try again.");
      console.error("Task creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([...subTasks, newSubTask.trim()]);
      setNewSubTask("");
    }
  };

  const removeSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  const applySuggestion = (suggestion: string) => {
    form.setValue("title", suggestion);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full max-w-2xl p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? "Edit Task" : "Create New Task"}
        </h2>
        <BrainCircuit className="h-6 w-6 text-primary" />
      </div>

      {aiSuggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <BrainCircuit className="h-4 w-4 mr-1" />
            AI Suggestions
          </h3>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applySuggestion(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} />
                </FormControl>
                <FormDescription>
                  Give your task a clear, descriptive title.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your task in detail"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        fromDate={new Date()} // Start from today (March 14, 2025)
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Sub-Tasks</FormLabel>
            <div className="flex mt-2">
              <Input
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                placeholder="Add a sub-task"
                className="flex-1"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={addSubTask}
                className="ml-2"
                variant="outline"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {subTasks.length > 0 && (
              <ul className="mt-3 space-y-2">
                {subTasks.map((task, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-700"
                  >
                    <span className="text-sm text-gray-800 dark:text-white">
                      {task}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubTask(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TaskCreationForm;
