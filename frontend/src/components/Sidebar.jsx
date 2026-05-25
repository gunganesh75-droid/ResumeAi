import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiFileText, FiGrid, FiCpu, FiPieChart, FiSettings, FiLogOut, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
  { name: 'My Resumes', icon: <FiFileText />, path: '/builder' },
  { name: 'Templates', icon: <FiGrid />, path: '/templates' },
  { name: 'AI Tools', icon: <FiCpu />, path: '/ai-tools' },
  { name: 'Analytics', icon: <FiPieChart />, path: '/analytics' },
  { name: 'Settings', icon: <FiSettings />, path: '/settings' },
];

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();

  const displayName = user?.name || 'John Doe';
  const displayEmail = user?.email || 'john@example.com';
  const displayAvatar = user?.avatar || 'JD';

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="h-14 sm:h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl">
            R
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">ResumeAI</span>
        </div>
        {/* Close button — only visible on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-sm ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* User Profile + Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm shrink-0">
            {displayAvatar}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={displayName}>{displayName}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate" title={displayEmail}>{displayEmail}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-medium text-sm text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <FiLogOut className="text-lg shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
