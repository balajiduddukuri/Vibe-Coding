
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeIcon, ChartBarIcon, DocumentTextIcon, UserIcon, ArrowLeftOnRectangleIcon, CalculatorIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: HomeIcon, text: 'Dashboard' },
    { to: '/log-food', icon: DocumentTextIcon, text: 'Log Food' },
    { to: '/progress', icon: ChartBarIcon, text: 'Progress' },
    { to: '/recipes', icon: CalculatorIcon, text: 'Recipe Analyzer' },
    { to: '/profile', icon: UserIcon, text: 'Profile' },
  ];

  const baseClasses = "flex items-center px-4 py-3 my-1 font-medium transition-colors duration-200 transform rounded-lg";
  const activeClasses = "bg-gradient-to-r from-green-500 to-sky-500 text-white shadow-lg";
  const inactiveClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 px-4 py-8 overflow-y-auto bg-white dark:bg-gray-900 border-r dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center mb-8">
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CalorieApp
          </div>
        </div>

        <nav className="flex flex-col justify-between flex-1 h-full">
          <div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
              >
                <item.icon className="w-6 h-6 mr-3" />
                <span>{item.text}</span>
              </NavLink>
            ))}
          </div>

          <div>
            <button
              onClick={handleLogout}
              className={`${baseClasses} ${inactiveClasses} w-full`}
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
