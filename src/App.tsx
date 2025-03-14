import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Home = lazy(() => import("./components/home"));
const AuthPage = lazy(() => import("./components/auth/AuthPage"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [timeoutExceeded, setTimeoutExceeded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("ProtectedRoute: Loading timeout exceeded");
      setTimeoutExceeded(true);
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timer);
  }, []);

  console.log(
    "ProtectedRoute: isLoading:",
    isLoading,
    "user:",
    !!user,
    "timeoutExceeded:",
    timeoutExceeded,
  );

  if (isLoading && !timeoutExceeded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-2 text-gray-500">Loading your account...</p>
      </div>
    );
  }

  if (!user || timeoutExceeded) {
    console.log(
      "ProtectedRoute: No user or timeout, redirecting to /auth from:",
      location.pathname,
    );
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  console.log("ProtectedRoute: User authenticated, rendering content");
  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="ml-2 text-gray-500">Loading application...</p>
        </div>
      }
    >
      <Routes location={location}>
        <Route
          path="/auth"
          element={<AuthPage intendedRoute={location.state?.from || "/"} />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={<></>} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
