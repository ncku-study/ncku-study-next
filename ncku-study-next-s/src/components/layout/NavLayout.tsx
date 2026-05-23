"use client";

import React from "react";
import { SidebarProvider, SidebarDrawer, useSidebar } from "@/components/sidebar/SidebarDrawer";
import { Menu } from "lucide-react";

function HamburgerButton() {
  const { toggle } = useSidebar();
  
  return (
    <button 
      onClick={toggle}
      className="p-2 -ml-2 text-[var(--color-light-black)] hover:bg-gray-100 rounded-md transition-colors"
      aria-label="Toggle menu"
    >
      <Menu size={24} />
    </button>
  );
}

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="md:grid md:grid-cols-[110px_1fr] flex flex-col h-screen overflow-hidden bg-[var(--color-dark-white)]">
        <SidebarDrawer />
        <div className="flex flex-col flex-1 overflow-hidden min-h-0">
          <header className="flex items-center h-[50px] px-4 bg-[var(--color-white)] shadow-sm md:hidden shrink-0">
            <HamburgerButton />
          </header>
          <main className="flex-1 overflow-y-auto section-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
