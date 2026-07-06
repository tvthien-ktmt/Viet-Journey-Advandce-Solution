import React from 'react';
import { Outlet } from 'react-router-dom';
import { RootLayout } from './RootLayout';

export default function SidebarLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-64 p-4 border-r">Sidebar Placeholder</aside>
      <main className="flex-1 p-4">
        {children || <Outlet />}
      </main>
    </div>
  );
}
