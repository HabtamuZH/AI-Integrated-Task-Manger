// fetch.ts
import { supabase } from "./supabase";
import { Task, User, Achievement, Suggestion } from "@/types/schema";

// Tasks
export async function getTasks(userId: string): Promise<Task[]> {
  try {
    console.log("Fetching tasks for user:", userId);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("userId", userId) // Matches table
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      if (error.message.includes('relation "tasks" does not exist')) {
        console.error("Tasks table does not exist. Please run the migrations.");
      }
      return [];
    }

    console.log("Tasks data from Supabase:", data);
    return data as Task[]; // Type assertion since column names match TS type
  } catch (e) {
    console.error("Exception in getTasks:", e);
    return [];
  }
}

export async function createTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt">,
): Promise<Task | null> {
  const dbTask = {
    ...task,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert([dbTask])
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    return null;
  }

  return data as Task;
}

export async function updateTask(
  id: string,
  updates: Partial<Task>,
): Promise<Task | null> {
  const dbUpdates: any = { ...updates };
  if (updates.updatedAt === undefined) {
    dbUpdates.updatedAt = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    return null;
  }

  return data as Task;
}

export async function deleteTask(id: string): Promise<boolean> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) {
    console.error("Error deleting task:", error);
    return false;
  }
  return true;
}

// Users
export async function getUser(userId: string): Promise<User | null> {
  try {
    console.log("Fetching user profile for ID:", userId);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      if (error.code === "PGRST116") {
        console.log("User profile not found, may need to create one");
      }
      return null;
    }

    return data as User;
  } catch (e) {
    console.error("Exception in getUser:", e);
    return null;
  }
}

export async function updateUser(
  userId: string,
  updates: Partial<User>,
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    return null;
  }

  return data as User;
}

// Achievements
export async function getAchievements(userId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("userId", userId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }

  return data as Achievement[];
}

export async function unlockAchievement(
  achievement: Omit<Achievement, "id">,
): Promise<Achievement | null> {
  const { data, error } = await supabase
    .from("achievements")
    .insert([achievement])
    .select()
    .single();

  if (error) {
    console.error("Error unlocking achievement:", error);
    return null;
  }

  return data as Achievement;
}

// Suggestions
export async function getSuggestions(userId: string): Promise<Suggestion[]> {
  const { data, error } = await supabase
    .from("suggestions")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }

  return data as Suggestion[];
}
