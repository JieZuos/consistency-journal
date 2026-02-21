import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Toaster } from './ui/sonner';
import { useEffect } from 'react';

export function Layout() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}