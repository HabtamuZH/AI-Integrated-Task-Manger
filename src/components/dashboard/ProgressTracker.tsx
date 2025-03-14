import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Star, Award, Target, Calendar } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

interface ProgressTrackerProps {
  taskCompletionRate: number; // Percentage (0-100)
  currentStreak: number; // Days
  longestStreak: number; // Days
  tasksCompletedToday: number;
  tasksCompletedThisWeek: number;
  achievements: Achievement[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  taskCompletionRate,
  currentStreak,
  longestStreak,
  tasksCompletedToday,
  tasksCompletedThisWeek,
  achievements,
}) => {
  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-t-lg border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
          Your Progress
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Track your productivity journey as of March 14, 2025
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        {/* Task Completion Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Task Completion Rate
            </h4>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              {taskCompletionRate}%
            </span>
          </div>
          <Progress value={taskCompletionRate} className="h-2" />
        </div>

        {/* Streaks */}
        <div className="flex justify-between gap-2">
          <div className="flex-1 bg-slate-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Current Streak
              </span>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {currentStreak} days
            </p>
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Longest Streak
              </span>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {longestStreak} days
            </p>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="flex justify-between gap-2">
          <div className="flex-1 bg-slate-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Today
              </span>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {tasksCompletedToday}
            </p>
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                This Week
              </span>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {tasksCompletedThisWeek}
            </p>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Achievements
          </h4>
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-2 rounded-md ${achievement.unlocked ? "bg-green-50 dark:bg-green-900" : "bg-slate-50 dark:bg-gray-700 opacity-70"}`}
              >
                <div
                  className={`p-2 rounded-full ${achievement.unlocked ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200" : "bg-slate-200 text-slate-500 dark:bg-gray-600 dark:text-gray-400"}`}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-800 dark:text-white">
                    {achievement.title}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-600 border-green-200 dark:bg-green-800 dark:text-green-200 dark:border-green-700"
                  >
                    Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
          <Award className="h-4 w-4" />
          <span>Keep going to unlock more achievements!</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProgressTracker;
