import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";
import { User as UserProfile } from "@/types/schema";

export async function signUp(
  email: string,
  password: string,
  userData: Omit<UserProfile, "id" | "joinDate">,
): Promise<{ user?: User; error?: string }> {
  try {
    console.log("Starting signup process for:", email);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Error signing up:", authError);
      return { error: authError.message };
    }

    if (!authData.user) {
      console.error("No user returned from auth signup");
      return { error: "Failed to create user" };
    }

    console.log("Auth user created successfully, ID:", authData.user.id);

    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        email: authData.user.email,
        name: userData.name,
        avatar: userData.avatar,
        phone: userData.phone || null,
        location: userData.location,
        bio: userData.bio,
        joindate: new Date().toISOString(),
      },
    ]);

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      return { error: profileError.message };
    }

    console.log("User profile created successfully");
    return { user: authData.user };
  } catch (e) {
    console.error("Exception in signUp function:", e);
    return { error: "An unexpected error occurred during signup" };
  }
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ user?: User; error?: string }> {
  try {
    console.log("Attempting to sign in user:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error);
      return { error: error.message };
    }

    console.log("Sign in successful, user:", data.user?.id);
    return { user: data.user ?? undefined };
  } catch (e) {
    console.error("Exception during sign in:", e);
    return { error: "An unexpected error occurred during sign in" };
  }
}

export async function signOut(): Promise<{ error?: string }> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    return { error: error.message };
  }

  return {};
}

export async function getCurrentUser(): Promise<User | null> {
  const timeoutPromise = new Promise<null>((_, reject) =>
    setTimeout(() => reject(new Error("getCurrentUser timed out")), 5000),
  );

  try {
    console.log("Checking for current user...");
    const result = await Promise.race([
      (async () => {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          return null;
        }
        if (sessionData?.session?.user) {
          console.log("Found user in session:", sessionData.session.user.id);
          return sessionData.session.user;
        }

        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error getting user:", error);
          return null;
        }

        if (data?.user) {
          console.log("Found user with getUser:", data.user.id);
          return data.user;
        }

        console.log("No user found in getCurrentUser");
        return null;
      })(),
      timeoutPromise,
    ]);

    return result;
  } catch (e) {
    console.error("Exception or timeout in getCurrentUser:", e);
    return null;
  }
}

export async function resetPassword(
  email: string,
): Promise<{ success?: boolean; error?: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    console.error("Error resetting password:", error);
    return { error: error.message };
  }

  return { success: true };
}
