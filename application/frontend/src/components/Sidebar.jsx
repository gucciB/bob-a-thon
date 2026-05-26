import React from 'react';
import {
  HomeIcon,
  ClockIcon,
  DocumentTextIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed, isHidden, setIsHidden }) => {
  const navItems = [
    { id: 'new-audit', label: 'New Audit', icon: HomeIcon },
    { id: 'history', label: 'Audit History', icon: ClockIcon },
    { id: 'reports', label: 'Reports', icon: DocumentTextIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon }
  ];

  return (
    <>
      {/* Mobile/Desktop Toggle Button - Shows when sidebar is hidden */}
      {isHidden && (
        <button
          onClick={() => setIsHidden(false)}
          className="fixed top-20 left-4 z-50 p-2 bg-[#262626] text-[#f4f4f4] rounded-lg hover:bg-[#393939] transition-colors shadow-lg"
          title="Show sidebar"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`bg-[#161616] text-[#f4f4f4] h-screen flex flex-col transition-all duration-300 ${
          isHidden ? '-translate-x-full absolute' : 'relative'
        } ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Logo Section */}
        <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#0f62fe] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IBM</span>
                </div>
                <div>
                  <h1 className="text-sm font-semibold">Compliance</h1>
                  <p className="text-xs text-gray-400">Audit Platform</p>
                </div>
              </div>
              <button
                onClick={() => setIsHidden(true)}
                className="p-1 hover:bg-[#262626] rounded transition-colors"
                title="Hide sidebar"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-[#0f62fe] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">IBM</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center py-3 transition-colors relative ${
                isActive
                  ? 'bg-[#0f62fe] text-white'
                  : 'text-[#f4f4f4] hover:bg-[#262626]'
              } ${isCollapsed ? 'justify-center px-0' : 'justify-start space-x-3 px-4'}`}
              title={isCollapsed ? item.label : ''}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
              )}
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-[#262626]">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-white hover:bg-[#262626] rounded transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

// Made with Bob
