import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const AppShell = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <Sidebar isOpen={mobileSidebarOpen} toggleMobileOpen={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      
      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-6 md:p-8 max-w-[1200px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};