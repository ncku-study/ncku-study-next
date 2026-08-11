"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarDrawer, useSidebar } from "@/components/sidebar/SidebarDrawer";
import { Search as SearchIcon } from "@/components/logos";
import NavigationSkeleton from "@/components/layout/NavigationSkeleton";
import ModalSkeleton from "@/components/layout/ModalSkeleton";

/** Returns true when the href is a detail modal route, e.g. /major/123 */
function isModalRoute(href: string): boolean {
  return /^\/major\/\d+/.test(href)
    || /^\/admin\/major\/\d+/.test(href)
    || /^\/admin\/study\/[^/]+$/.test(href)
    || /^\/study\/[^/]+$/.test(href);
}

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
    <button className="md:hidden cursor-pointer border-0 bg-transparent p-0 mr-0 leading-none" onClick={toggle} aria-label="選單">
      <svg
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={30}
        height={30}
        fill="rgba(29, 30, 34, 1)"
      >
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
    </button>
  );
}

function NavContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { pendingHref } = useSidebar();
  const isNavigating = pendingHref !== null && pendingHref !== pathname;
  const isModalNavigating = isNavigating && isModalRoute(pendingHref!);
  const isPageNavigating = isNavigating && !isModalNavigating;
  const title = isNavigating ? getTitle(pendingHref!) : getTitle(pathname);
  const isShowSearch = pathname === '/study';

  return (
    <div
      className={`box-border grid grid-cols-auto w-full h-screen py-[20px] px-[30px] bg-white overflow-y-auto max-lg:grid-rows-[50px_auto] max-sm:p-[10px] max-sm:pb-0 [&::-webkit-scrollbar]:w-[1px] [&::-webkit-scrollbar]:h-[1px] [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:border-none [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:opacity-50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:border-0 ${isShowSearch ? 'grid-rows-[120px_auto]' : 'grid-rows-[50px_auto]'}`}
    >
      <header className="w-full flex flex-wrap items-center h-[50px]">
        <HamburgerButton />
        <h1 className="m-0 text-[1.7rem] font-medium w-full max-lg:w-auto max-lg:pl-[20px]">{title}</h1>
        {isShowSearch && (
          <form
            className="relative flex items-center w-[550px] h-[45px] max-lg:grow max-lg:w-1/2 max-lg:h-[35px] max-lg:pl-[25px] max-sm:w-[30%] max-sm:h-[35px] max-sm:pl-[25px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="w-full h-full py-[10px] px-[15px] box-border border border-black/5 rounded-[55px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-black/50 max-sm:h-[35px] text-[1.5rem] outline-none"
              aria-label="search"
            />
            <button
              type="submit"
              className="inline-flex absolute right-[12px] cursor-pointer p-0 border-0 bg-white"
            >
              <SearchIcon
                style={{ fill: 'var(--color-yellow)', width: '2.1875rem', height: '2.1875rem' }}
                aria-hidden="true"
              />
            </button>
          </form>
        )}
      </header>
      <div className="relative">
        {isPageNavigating ? <NavigationSkeleton /> : children}
        {isModalNavigating && <ModalSkeleton />}
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
