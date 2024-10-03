import React, { useState } from "react";
import {
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlineUser,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { name: "How to Use", href: "/how-to-use", icon: AiOutlineHome },
  { name: "About", href: "/about", icon: AiOutlineUser },
  { name: "Pricing", href: "/pricing", icon: AiOutlineMail },
  { name: "Terms Of Use", href: "/terms", icon: AiOutlineMail },
];

const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      {/* Mobile menu toggle button */}
      <button
        className="absolute top-4 right-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <AiOutlineClose size={24} />
        ) : (
          <AiOutlineMenu size={24} />
        )}
      </button>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white/90 z-40 flex flex-col items-center justify-center">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              to={href}
              className="flex items-center justify-center w-3/4 p-4 m-2 text-lg font-medium rounded-full shadow-lg bg-gray-100 shadow-gray-400 cursor-pointer hover:scale-110 ease-in duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon size={20} className="mr-4" />
              {name}
            </Link>
          ))}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-3/4 p-4 m-2 text-lg font-medium rounded-full shadow-lg bg-gray-100 shadow-gray-400 cursor-pointer hover:scale-110 ease-in duration-200"
            >
              <AiOutlineUser size={20} className="mr-4" />
              Log out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center justify-center w-3/4 p-4 m-2 text-lg font-medium rounded-full shadow-lg bg-gray-100 shadow-gray-400 cursor-pointer hover:scale-110 ease-in duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <AiOutlineUser size={20} className="mr-4" />
                Log in
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center w-3/4 p-4 m-2 text-lg font-medium rounded-full shadow-lg bg-indigo-600 text-white cursor-pointer hover:bg-indigo-500 ease-in duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <AiOutlineUser size={20} className="mr-4" />
                Try for free
              </Link>
            </>
          )}
        </div>
      )}

      {/* Desktop navigation */}
      <nav
        className="flex items-center justify-between p-6 lg:px-8 bg-transparent"
        aria-label="Global navigation"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Resumeguru.pro</span>
            {/* <img
              className="w-auto h-8"
              src="https://kodastorage1.s3.amazonaws.com/static/logos/resumelogo.png"
              alt="Logo"
            /> */}
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navItems.map(({ name, href }) => (
            <Link
              key={name}
              to={href}
              className="text-lg font-semibold text-gray-900 hover:text-gray-700"
            >
              {name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-6">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-lg font-semibold text-gray-900 hover:text-gray-700 cursor-pointer"
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-lg font-semibold text-gray-900 hover:text-gray-700"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Try for Free
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
