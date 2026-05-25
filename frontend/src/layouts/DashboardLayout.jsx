import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FiMenu, FiHome, FiFileText, FiGrid, FiCpu, FiPieChart, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

// Mobile bottom navigation items
const mobileNav = [
  { name: 'Home', icon: <FiHome />, path: '/dashboard' },
  { name: 'Builder', icon: <FiFileText />, path: '/builder' },
  { name: 'Templates', icon: <FiGrid />, path: '/templates' },
  { name: 'AI', icon: <FiCpu />, path: '/ai-tools' },
  { name: 'Analytics', icon: <FiPieChart />, path: '/analytics' },
  { name: 'Settings', icon: <FiSettings />, path: '/settings' },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const displayAvatar = user?.avatar || 'JD';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, slides in when open */}
      <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Open menu"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            {/* Logo on mobile */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">R</div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">ResumeAI</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm border border-primary-200 dark:border-primary-800 cursor-pointer select-none">
              {displayAvatar}
            </div>
          </div>
        </header>

        {/* Page Content — add pb for mobile bottom nav */}
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around h-16 px-1 shadow-lg">
        {mobileNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-colors min-w-[50px] ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] font-semibold tracking-wide">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default DashboardLayout;
