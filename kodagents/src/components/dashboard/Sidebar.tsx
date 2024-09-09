import { X } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    navigate("/upgrade"); // Navigate to /upgrade when button is clicked
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-indigo-800 to-purple-700 text-white py-7 px-2 shadow-lg z-50 transform transition-transform duration-200 ease-in-out flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:h-auto`}
      >
        <div className="flex justify-between items-center px-4">
          <h2 className="text-xl font-bold mt-4 mb-8">ResumeGuru</h2>
          <Button variant="ghost" className="md:hidden" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-8 flex-grow">
          <ul className="space-y-10">
            <li>
              <Link
                to="/dashboard"
                className="block py-2 px-4 bg-indigo-600 font-medium hover:bg-indigo-700 rounded-md transition duration-150 ease-in-out"
              >
                CREATE NEW RESUME
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="block py-2 px-4 hover:bg-indigo-700 rounded-md transition duration-150 ease-in-out"
              >
                My Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/upload"
                className="block py-2 px-4 hover:bg-indigo-700 rounded-md transition duration-150 ease-in-out"
              >
                Quick Optimize
              </Link>
            </li>
            <li>
              <div className="relative py-2 px-4 rounded transition duration-200 hover:bg-indigo-700">
                <Link to="#" className="inline-block">
                  Analyse Resume
                  <span className="absolute top-0 ml-1 bg-red-400 text-white text-[10px] px-1.5 py-0.5 rounded-full transform -translate-y-1/2">
                    Coming Soon
                  </span>
                </Link>
              </div>
            </li>
            <li>
              <div className="relative py-2 px-4 rounded transition duration-200 hover:bg-indigo-700">
                <Link to="#" className="inline-block">
                  Template Library
                </Link>
                <span className="absolute top-0 ml-1 bg-red-400 text-white text-[10px] px-1.5 py-0.5 rounded-full transform -translate-y-1/2">
                  Coming Soon
                </span>
              </div>
            </li>
          </ul>
        </nav>
        <div className="p-4 mt-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm block">Get Hired Fast</span>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleUpgradeClick}
            >
              UPGRADE
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
