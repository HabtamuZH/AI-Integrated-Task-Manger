import React from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  Calendar,
  Settings,
  BarChart2,
  Users,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: (route: string) => void;
  currentRoute?: string;
}

const Sidebar = ({
  collapsed = false,
  onToggleCollapse = () => {},
  onNavigate = () => {},
  currentRoute = "/",
}: SidebarProps) => {
  const menuItems = [
    { icon: <Home size={20} />, label: "Dashboard", route: "/" },
    { icon: <Calendar size={20} />, label: "Calendar", route: "/calendar" },
    { icon: <BarChart2 size={20} />, label: "Reports", route: "/reports" },
    { icon: <Users size={20} />, label: "Team", route: "/team" },
    {
      icon: <MessageSquare size={20} />,
      label: "Messages",
      route: "/messages",
    },
    { icon: <Settings size={20} />, label: "Settings", route: "/settings" },
  ];

  return (
    <div
      className={`h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-center h-12 mb-6">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TaskAI
              </span>
            </div>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.route}
              variant={currentRoute === item.route ? "default" : "ghost"}
              className={`w-full justify-${collapsed ? "center" : "start"} ${currentRoute === item.route ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => onNavigate(item.route)}
            >
              {item.icon}
              {!collapsed && <span className="ml-2">{item.label}</span>}
            </Button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 w-full px-4">
        <Button
          variant="outline"
          className={`w-full justify-${collapsed ? "center" : "start"}`}
        >
          <HelpCircle size={20} />
          {!collapsed && <span className="ml-2">Help & Support</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
