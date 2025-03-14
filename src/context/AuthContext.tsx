import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { User as UserProfile } from "@/types/schema";
import { getCurrentUser, signIn, signOut, signUp } from "@/lib/auth";
import { getUser } from "@/lib/database";

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
    onSuccess?: () => void,
  ) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    userData: Omit<UserProfile, "id" | "joinDate">,
    onSuccess?: () => void,
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      console.log("AuthProvider: Already initialized, skipping...");
      return;
    }

    console.log("AuthProvider: Starting initialization...");
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log(
          "AuthProvider: Initial auth check complete, user:",
          !!currentUser,
        );
        setUser(currentUser);

        if (currentUser) {
          const userProfile = await getUser(currentUser.id);
          console.log("AuthProvider: User profile fetched:", userProfile);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("AuthProvider: Error during initialization:", error);
        setUser(null);
        setProfile(null);
      } finally {
        console.log("AuthProvider: Initialization complete, isLoading:", false);
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(
          "AuthProvider: Auth state changed:",
          event,
          "user:",
          !!session?.user,
        );
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          try {
            const userProfile = await getUser(currentUser.id);
            setProfile(userProfile);
            console.log(
              "AuthProvider: Profile updated for user:",
              currentUser.id,
            );
          } catch (error) {
            console.error("AuthProvider: Error fetching profile:", error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      console.log("AuthProvider: Unsubscribing auth listener");
      authListener.subscription.unsubscribe();
    };
  }, [isInitialized]);

  const handleSignIn = async (
    email: string,
    password: string,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    try {
      const { user: authUser, error } = await signIn(email, password);
      if (error) return { error };
      setUser(authUser ?? null);
      if (authUser) {
        const userProfile = await getUser(authUser.id);
        setProfile(userProfile);
        if (onSuccess) onSuccess();
      }
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    userData: Omit<UserProfile, "id" | "joinDate">,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    try {
      const { user: authUser, error } = await signUp(email, password, userData);
      if (error) return { error };
      setUser(authUser ?? null);
      if (authUser) {
        const userProfile = await getUser(authUser.id);
        setProfile(userProfile);
        if (onSuccess) onSuccess();
      }
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
