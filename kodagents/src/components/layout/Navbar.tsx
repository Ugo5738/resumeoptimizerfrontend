import { useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineClose,
} from "react-icons/ai";

// Assuming all icons from 'react-icons/ai' for consistency
const navItems = [
  { name: "How to Use", href: "#", icon: AiOutlineHome },
  { name: "About", href: "#", icon: AiOutlineUser }, // Assuming 'About' uses 'AiOutlineUser'
  { name: "AI Agents", href: "#", icon: AiOutlineUser }, // Assuming a different or same icon can be used
  { name: "Pricing", href: "#", icon: AiOutlineMail },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
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
            <a
              key={name}
              href={href}
              className="flex items-center justify-center w-3/4 p-4 m-2 text-lg font-medium rounded-full shadow-lg bg-gray-100 shadow-gray-400 cursor-pointer hover:scale-110 ease-in duration-200"
            >
              <Icon size={20} className="mr-4" />
              {name}
            </a>
          ))}
        </div>
      )}

      {/* Desktop navigation */}
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global navigation"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Kodagents</span>
            {/* Placeholder for logo */}
            <img
              className="w-auto h-8"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Logo"
            />
          </a>
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navItems.map(({ name, href }) => (
            <a
              key={name}
              href={href}
              className="text-lg font-semibold text-gray-900"
            >
              {name}
            </a>
          ))}
        </div>

        <a
          href="#"
          className="hidden lg:flex lg:flex-1 justify-end text-lg font-semibold text-gray-900"
        >
          Log in <span aria-hidden="true">&rarr;</span>
        </a>
      </nav>
    </div>
  );
};

export default Navbar;
