import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { NotificationsPanel } from './NotificationsPanel';

export const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopNav 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onToggleNotifications={() => setNotificationsPanelOpen(!notificationsPanelOpen)}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} />
        
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        
        <NotificationsPanel 
          open={notificationsPanelOpen} 
          onClose={() => setNotificationsPanelOpen(false)} 
        />
      </div>
    </div>
  );
};