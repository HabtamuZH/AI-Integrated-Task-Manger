import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthPageProps {
  intendedRoute?: string; // Passed from App.tsx via location.state.from
}

const AuthPage = ({ intendedRoute = "/" }: AuthPageProps) => {
  const { user, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      console.log("User is logged in, navigating to:", intendedRoute);
      navigate(intendedRoute); // Redirect to the intended route after login
    }
  }, [user, isLoading, navigate, intendedRoute]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-14 w-14 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TaskAI
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Your intelligent task management assistant
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            AI-Powered
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Cloud Sync
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Secure
          </div>
        </div>
      </div>

      {showLogin ? (
        <LoginForm
          onRegisterClick={() => setShowLogin(false)}
          onSuccess={() => navigate(intendedRoute)}
        />
      ) : (
        <RegisterForm
          onLoginClick={() => setShowLogin(true)}
          onSuccess={() => navigate(intendedRoute)}
        />
      )}
    </div>
  );
};

export default AuthPage;
