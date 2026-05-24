"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarDrawer, useSidebar } from "@/components/sidebar/SidebarDrawer";
import { Menu } from "lucide-react";

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
    <button className="lg:hidden p-2 mr-2" onClick={toggle} aria-label="選單">
      <Menu size={30} color="rgba(29, 30, 34, 1)" />
    </button>
  );
}

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <SidebarDrawer />
        <div
          className="box-border grid w-full h-screen py-[20px] px-[30px] bg-white overflow-y-auto grid-rows-[50px_auto] max-lg:grid-rows-[50px_auto] max-sm:p-[10px] max-sm:pb-0 custom-scrollbar"
        >
          {/* Header row - h-[50px] */}
          <header className="grid grid-cols-[auto_120px] h-[50px] items-center">
            <div className="flex items-center">
              <HamburgerButton />
              <h1 className="m-0 text-[2.2rem] font-semibold">{title}</h1>
            </div>
          </header>
          {/* Content */}
          <div className="overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
