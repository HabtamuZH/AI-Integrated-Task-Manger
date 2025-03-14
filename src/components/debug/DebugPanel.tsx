import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { createTask } from "@/lib/database";
import { supabase } from "@/lib/supabase";

const DebugPanel = () => {
  const { user } = useAuth();
  const [dbStatus, setDbStatus] = useState<string>("Unknown");
  const [dbStatusColor, setDbStatusColor] = useState<string>("bg-gray-100");
  const [lastAction, setLastAction] = useState<string>("");

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from("tasks").select("count()");

      if (error) {
        console.error("Database connection error:", error);
        setDbStatus("Error: " + error.message);
        setDbStatusColor("bg-red-100 text-red-800");
      } else {
        setDbStatus("Connected");
        setDbStatusColor("bg-green-100 text-green-800");
      }
    } catch (e) {
      console.error("Exception checking connection:", e);
      setDbStatus(`Exception: ${e.message}`);
      setDbStatusColor("bg-red-100 text-red-800");
    }
  };

  const createSampleTask = async () => {
    if (!user) {
      setLastAction("Error: No user logged in");
      return;
    }

    try {
      const newTaskData = {
        title: "Sample Task " + new Date().toLocaleTimeString(),
        description: "This is a sample task created for debugging",
        dueDate: new Date().toISOString().split("T")[0],
        priority: "medium" as const,
        completed: false,
        userId: user.id,
      };

      const newTask = await createTask(newTaskData);
      if (newTask) {
        setLastAction(`Task created: ${newTask.title}`);
      } else {
        setLastAction("Failed to create task");
      }
    } catch (e) {
      console.error("Error creating sample task:", e);
      setLastAction(`Error: ${e.message}`);
    }
  };

  const showTables = async () => {
    try {
      // This query works in PostgreSQL to list tables
      const { data, error } = await supabase.rpc("get_tables");

      if (error) {
        console.error("Error listing tables:", error);
        setLastAction(`Error listing tables: ${error.message}`);
      } else {
        console.log("Database tables:", data);
        setLastAction(`Tables retrieved: ${data ? data.length : 0} tables`);
      }
    } catch (e) {
      console.error("Exception listing tables:", e);
      setLastAction(`Exception: ${e.message}`);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border border-gray-100 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Database Debug Panel</span>
          <Badge className={dbStatusColor}>{dbStatus}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={checkConnection} variant="outline">
            Check Connection
          </Button>
          <Button onClick={createSampleTask} variant="outline">
            Create Sample Task
          </Button>
          <Button onClick={showTables} variant="outline">
            Show Tables
          </Button>
          <Button
            onClick={() => console.log("Current user:", user)}
            variant="outline"
          >
            Log User
          </Button>
        </div>

        {lastAction && (
          <div className="text-sm p-2 bg-gray-100 rounded">
            <strong>Last Action:</strong> {lastAction}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>
            Supabase URL:{" "}
            {import.meta.env.VITE_SUPABASE_URL ? "Set" : "Not set"}
          </p>
          <p>
            Supabase Key:{" "}
            {import.meta.env.VITE_SUPABASE_ANON_KEY ? "Set" : "Not set"}
          </p>
          <p>User ID: {user?.id || "Not logged in"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
