"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarDrawer, useSidebar } from "@/components/sidebar/SidebarDrawer";
import { Menu } from "lucide-react";
import NavigationSkeleton from "@/components/layout/NavigationSkeleton";

const pageTitles: Record<string, string> = {
  "/": "成大轉系/輔系/雙主修心得",
  "/major": "成大轉系/輔系/雙主修心得",
  "/study": "成大學業心得",
  "/post": "分享心得",
};

function getTitle(pathname: string): string {
  if (pathname.startsWith("/admin/study")) return "綜合學業心得";
  if (pathname.startsWith("/admin/major")) return "審查 轉系/輔系/雙主修心得";
  if (pathname.startsWith("/admin/department")) return "學院學系設定";
  if (pathname.startsWith("/admin/announcement")) return "公告設定";
  return pageTitles[pathname] || pageTitles[pathname.split("/").slice(0, 2).join("/")] || "成大轉系/輔系/雙主修心得";
}

function HamburgerButton() {
  const { toggle } = useSidebar();
  return (
    <button className="lg:hidden p-2 mr-2 hidden" onClick={toggle} aria-label="選單">
      <Menu size={30} color="rgba(29, 30, 34, 1)" />
    </button>
  );
}

function NavContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { pendingHref } = useSidebar();
  const isNavigating = pendingHref !== null && pendingHref !== pathname;
  const title = isNavigating ? getTitle(pendingHref) : getTitle(pathname);

  return (
    <div
      className="box-border grid grid-cols-auto grid-rows-[50px_auto] w-full h-screen py-[20px] px-[30px] bg-white overflow-y-auto max-lg:grid-rows-[50px_auto] max-sm:p-[10px] max-sm:pb-0 [&::-webkit-scrollbar]:w-[1px] [&::-webkit-scrollbar]:h-[1px] [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:border-none [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:opacity-50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:border-0"
    >
      <header className="flex items-center justify-between h-[50px]">
        <h1 className="m-0 text-[1.7rem] font-medium w-full">{title}</h1>
      </header>
      <div>
        {isNavigating ? <NavigationSkeleton /> : children}
      </div>
    </div>
  );
}

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="md:grid md:grid-cols-[110px_1fr] flex flex-col h-screen overflow-hidden bg-[var(--color-dark-white)]">
        <SidebarDrawer />
        <NavContent>{children}</NavContent>
      </div>
    </SidebarProvider>
  );
}
