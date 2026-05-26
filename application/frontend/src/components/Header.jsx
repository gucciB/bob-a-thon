import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const Header = ({ pageTitle }) => {
  return (
    <header className="bg-[#262626] text-[#f4f4f4] border-b border-[#393939] px-6 py-2">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>
        </div>

        {/* Right Section - IBM Consulting Branding & User */}
        <div className="flex items-center space-x-6">
          {/* IBM Consulting Badge */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-[#161616] rounded-lg border border-[#393939]">
            <div className="w-6 h-6 bg-[#0f62fe] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">IBM</span>
            </div>
            <span className="text-sm font-medium">IBM Consulting</span>
          </div>

          {/* User Avatar */}
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#393939] px-3 py-2 rounded-lg transition-colors">
            <UserCircleIcon className="w-8 h-8 text-[#0f62fe]" />
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-gray-400">Auditor</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

// Made with Bob
