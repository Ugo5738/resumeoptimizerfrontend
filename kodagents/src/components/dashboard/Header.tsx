import { Bell, ChevronDown, Menu } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/contexts/AuthContext";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderProps {
  activeTab: "resume" | "cover_letter";
  onTabChange: (tab: "resume" | "cover_letter") => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onMenuClick,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          className="md:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="hidden md:flex space-x-4">
          <Button
            variant="ghost"
            className={activeTab === "resume" ? "bg-indigo-500 text-white" : ""}
            onClick={() => {
              navigate("/dashboard");
              onTabChange("resume");
            }}
          >
            RESUMES
          </Button>
          <Button
            variant="ghost"
            className={
              activeTab === "cover_letter" ? "bg-indigo-500 text-white" : ""
            }
            onClick={() => {
              navigate("/dashboard");
              onTabChange("cover_letter");
            }}
          >
            COVER LETTERS
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="h-5 w-5 text-gray-500" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                {user?.firstName?.charAt(0) || "U"}
              </div>
              <span className="hidden md:inline">{user?.email || "User"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigate("/dashboard/account")}>
              Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/billing")}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/how-to-use")}>
              Suggest Feature
            </DropdownMenuItem>
            <DropdownMenuItem>User Guides</DropdownMenuItem>
            <DropdownMenuItem>Theme</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
