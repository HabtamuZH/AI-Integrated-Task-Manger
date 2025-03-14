import React, { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Bell,
  Cog,
  HelpCircle,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Sun,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onToggleAIAssistant?: () => void;
  onToggleSettings?: () => void;
  onProfileClick?: () => void;
  onSearchSubmit?: (query: string) => void;
  userName?: string;
  userAvatar?: string;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const Header = ({
  onToggleAIAssistant = () => {},
  onToggleSettings = () => {},
  onProfileClick = () => {},
  onSearchSubmit = () => {},
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  isDarkMode = false,
  onToggleTheme = () => {},
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { signOut } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="w-full h-[72px] px-4 border-b border-gray-200 bg-background flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div className="hidden md:block">
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TaskAI
              </span>
              <p className="text-xs text-gray-500 -mt-1">
                Intelligent Task Management
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex relative max-w-md w-full mx-4">
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-gray-200 bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleTheme}>
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDarkMode ? "Light mode" : "Dark mode"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleAIAssistant}>
                <MessageSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleSettings}>
                <Cog className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
