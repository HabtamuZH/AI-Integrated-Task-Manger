import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import TaskGrid from "./dashboard/TaskGrid";
import ProgressTracker from "./dashboard/ProgressTracker";
import TaskCreationForm from "./task/TaskCreationForm";
import { Button } from "@/components/ui/button";
import { LogOut, Star, Trophy } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

const Home = () => {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (values: any) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            user_id: user!.id,
            title: values.title,
            description: values.description,
            due_date: values.dueDate.toISOString(),
            priority: values.priority,
            completed: false,
          },
        ])
        .select();
      if (error) throw error;
      setTasks([...tasks, data[0]]);
      setShowTaskForm(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setEditingTask(task);
      setShowTaskForm(true);
    }
  };

  const handleUpdateTask = async (values: any) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: values.title,
          description: values.description,
          due_date: values.dueDate.toISOString(),
          priority: values.priority,
        })
        .eq("id", editingTask!.id);
      if (error) throw error;
      setTasks(
        tasks.map((t) =>
          t.id === editingTask!.id
            ? { ...t, ...values, dueDate: values.dueDate.toISOString() }
            : t,
        ),
      );
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCompleteTask = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", id);
      if (error) throw error;
      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed } : t)));
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };

  // Calculate progress metrics
  const taskCompletionRate =
    tasks.length > 0
      ? Math.round(
          (tasks.filter((t) => t.completed).length / tasks.length) * 100,
        )
      : 0;
  const tasksCompletedToday = tasks.filter(
    (t) =>
      t.completed &&
      new Date(t.dueDate).toDateString() === new Date().toDateString(),
  ).length;
  const tasksCompletedThisWeek = tasks.filter(
    (t) =>
      t.completed &&
      new Date(t.dueDate) >=
        new Date(new Date().setDate(new Date().getDate() - 7)),
  ).length;

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Early Bird",
      description: "Complete 5 tasks before 9 AM",
      icon: <Star className="h-4 w-4" />,
      unlocked: tasksCompletedToday >= 5,
    },
    {
      id: "2",
      title: "Productivity Master",
      description: "Complete 50 tasks in a week",
      icon: <Trophy className="h-4 w-4" />,
      unlocked: tasksCompletedThisWeek >= 50,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Welcome, {user?.email}
        </h1>
        <Button onClick={signOut} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskGrid
            tasks={tasks}
            isLoading={isLoading}
            onAddTask={() => setShowTaskForm(true)}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCompleteTask={handleCompleteTask}
          />
        </div>
        <div className="lg:col-span-1">
          <ProgressTracker
            taskCompletionRate={taskCompletionRate}
            currentStreak={5} // Replace with real streak logic
            longestStreak={12} // Replace with real streak logic
            tasksCompletedToday={tasksCompletedToday}
            tasksCompletedThisWeek={tasksCompletedThisWeek}
            achievements={achievements}
          />
        </div>
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <TaskCreationForm
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            aiSuggestions={[
              "Review project plan",
              "Schedule meeting",
              "Update docs",
            ]}
            isOpen={true}
            initialData={
              editingTask
                ? { ...editingTask, dueDate: new Date(editingTask.dueDate) }
                : undefined
            }
            isEditing={!!editingTask}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
