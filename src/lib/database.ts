import { supabase } from "./supabase";
import { Task, User, Achievement, Suggestion } from "@/types/schema";

// Tasks
export async function getTasks(userId: string) {
  try {
    console.log("Fetching tasks for user:", userId);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("userid", userId)
      .order("createdat", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      // Check if the error is because the table doesn't exist
      if (error.message.includes('relation "tasks" does not exist')) {
        console.error("Tasks table does not exist. Please run the migrations.");
      }
      return [];
    }

    console.log("Tasks data from Supabase:", data);
    // Map database column names to our schema property names
    const formattedTasks = data.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description || "",
      dueDate: task.duedate,
      priority: task.priority,
      completed: task.completed || false,
      userId: task.userid,
      createdAt: task.createdat,
      updatedAt: task.updatedat,
    }));
    return formattedTasks as Task[];
  } catch (e) {
    console.error("Exception in getTasks:", e);
    return [];
  }
}

export async function createTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt">,
) {
  // Map our schema property names to database column names
  const dbTask = {
    title: task.title,
    description: task.description,
    duedate: task.dueDate,
    priority: task.priority,
    completed: task.completed,
    userid: task.userId,
    createdat: new Date().toISOString(),
    updatedat: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert([dbTask])
    .select();

  if (error) {
    console.error("Error creating task:", error);
    return null;
  }

  // Map back to our schema format
  const createdTask = {
    id: data[0].id,
    title: data[0].title,
    description: data[0].description || "",
    dueDate: data[0].duedate,
    priority: data[0].priority,
    completed: data[0].completed || false,
    userId: data[0].userid,
    createdAt: data[0].createdat,
    updatedAt: data[0].updatedat,
  };

  return createdTask as Task;
}

export async function updateTask(id: string, updates: Partial<Task>) {
  // Map our schema property names to database column names
  const dbUpdates: any = {};

  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined)
    dbUpdates.description = updates.description;
  if (updates.dueDate !== undefined) dbUpdates.duedate = updates.dueDate;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.completed !== undefined) dbUpdates.completed = updates.completed;

  dbUpdates.updatedat = new Date().toISOString();

  const { data, error } = await supabase
    .from("tasks")
    .update(dbUpdates)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating task:", error);
    return null;
  }

  // Map back to our schema format
  const updatedTask = {
    id: data[0].id,
    title: data[0].title,
    description: data[0].description || "",
    dueDate: data[0].duedate,
    priority: data[0].priority,
    completed: data[0].completed || false,
    userId: data[0].userid,
    createdAt: data[0].createdat,
    updatedAt: data[0].updatedat,
  };

  return updatedTask as Task;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    console.error("Error deleting task:", error);
    return false;
  }

  return true;
}

// Users
export async function getUser(userId: string) {
  try {
    console.log("Fetching user profile for ID:", userId);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      // Check if the error is because the user doesn't exist
      if (error.code === "PGRST116") {
        console.log("User profile not found, may need to create one");
      }
      return null;
    }

    // Map database column names to our schema property names
    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      phone: data.phone,
      location: data.location,
      bio: data.bio,
      joinDate: data.joindate,
    };

    return user as User;
  } catch (e) {
    console.error("Exception in getUser:", e);
    return null;
  }
}

export async function updateUser(userId: string, updates: Partial<User>) {
  // Map our schema property names to database column names
  const dbUpdates: any = {};

  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  if (updates.bio !== undefined) dbUpdates.bio = updates.bio;

  const { data, error } = await supabase
    .from("users")
    .update(dbUpdates)
    .eq("id", userId)
    .select();

  if (error) {
    console.error("Error updating user:", error);
    return null;
  }

  // Map back to our schema format
  const updatedUser = {
    id: data[0].id,
    name: data[0].name,
    email: data[0].email,
    avatar: data[0].avatar,
    phone: data[0].phone,
    location: data[0].location,
    bio: data[0].bio,
    joinDate: data[0].joindate,
  };

  return updatedUser as User;
}

// Achievements
export async function getAchievements(userId: string) {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("userid", userId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }

  // Map database column names to our schema property names
  const achievements = data.map((achievement) => ({
    id: achievement.id,
    userId: achievement.userid,
    title: achievement.title,
    description: achievement.description || "",
    date: achievement.date,
    unlocked: achievement.unlocked || false,
  }));

  return achievements as Achievement[];
}

export async function unlockAchievement(achievement: Omit<Achievement, "id">) {
  // Map our schema property names to database column names
  const dbAchievement = {
    userid: achievement.userId,
    title: achievement.title,
    description: achievement.description,
    date: achievement.date,
    unlocked: achievement.unlocked,
  };

  const { data, error } = await supabase
    .from("achievements")
    .insert([dbAchievement])
    .select();

  if (error) {
    console.error("Error unlocking achievement:", error);
    return null;
  }

  // Map back to our schema format
  const unlockedAchievement = {
    id: data[0].id,
    userId: data[0].userid,
    title: data[0].title,
    description: data[0].description || "",
    date: data[0].date,
    unlocked: data[0].unlocked || false,
  };

  return unlockedAchievement as Achievement;
}

// Suggestions
export async function getSuggestions(userId: string) {
  const { data, error } = await supabase
    .from("suggestions")
    .select("*")
    .eq("userid", userId)
    .order("createdat", { ascending: false });

  if (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }

  // Map database column names to our schema property names
  const suggestions = data.map((suggestion) => ({
    id: suggestion.id,
    title: suggestion.title,
    description: suggestion.description || "",
    category: suggestion.category,
    priority: suggestion.priority,
    estimatedTime: suggestion.estimatedtime,
    dueDate: suggestion.duedate,
    userId: suggestion.userid,
  }));

  return suggestions as Suggestion[];
}
