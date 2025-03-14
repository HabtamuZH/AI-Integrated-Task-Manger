export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  joinDate: string;
};

export type Achievement = {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  unlocked: boolean;
};

export type Suggestion = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
  estimatedTime?: string;
  dueDate?: string;
  userId: string;
};
