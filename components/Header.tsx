
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'dashboard':
        return `Welcome back, ${user?.name.split(' ')[0]}!`;
      case 'log-food':
        return 'Log Your Meal';
      case 'progress':
        return 'Your Progress';
      case 'recipes':
        return 'Recipe Analyzer';
      case 'profile':
        return 'Profile Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden mr-4">
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-600 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
        >
          {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
