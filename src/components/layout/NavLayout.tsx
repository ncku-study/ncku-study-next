"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { SidebarProvider, SidebarDrawer, useSidebar } from "@/components/sidebar/SidebarDrawer";
import { Search as SearchIcon } from "@/components/logos";
import NavigationSkeleton from "@/components/layout/NavigationSkeleton";
import ModalSkeleton from "@/components/layout/ModalSkeleton";
import AnnouncementNotification from "@/components/layout/AnnouncementNotification";

/** Returns true when the href is a detail modal route, e.g. /major/123 */
function isModalRoute(href: string): boolean {
  return /^\/major\/\d+/.test(href)
    || /^\/admin\/major\/\d+/.test(href)
    || /^\/admin\/study\/[^/]+$/.test(href)
    || /^\/study\/[^/]+$/.test(href);
}

const pageTitleKeys: Record<string, string> = {
  "/": "majorTitle",
  "/major": "majorTitle",
  "/study": "studyTitle",
  "/post": "postTitle",
};

function getTitle(pathname: string, t: (key: string) => string): string {
  if (pathname.startsWith("/admin/study")) return t("adminStudyTitle");
  if (pathname.startsWith("/admin/major")) return t("adminMajorTitle");
  if (pathname.startsWith("/admin/department")) return t("adminDepartmentTitle");
  if (pathname.startsWith("/admin/announcement")) return t("adminAnnouncementTitle");
  const key = pageTitleKeys[pathname] || pageTitleKeys[pathname.split("/").slice(0, 2).join("/")] || "majorTitle";
  return t(key);
}

function HamburgerButton() {
  const { toggle } = useSidebar();
  const t = useTranslations("nav");
  return (
    <button className="md:hidden cursor-pointer border-0 bg-transparent p-0 mr-0 leading-none" onClick={toggle} aria-label={t("menu")}>
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
  const t = useTranslations("nav");
  const { pendingHref } = useSidebar();
  const isNavigating = pendingHref !== null && pendingHref !== pathname;
  const isModalNavigating = isNavigating && isModalRoute(pendingHref!);
  const isPageNavigating = isNavigating && !isModalNavigating;
  const title = isNavigating ? getTitle(pendingHref!, t) : getTitle(pathname, t);
  const isShowSearch = pathname === '/study';
  const isMajorPage = pathname === '/' || pathname.startsWith('/major') || pathname.startsWith('/admin/major');

  return (
    <div
      className={`box-border grid grid-cols-auto w-full h-screen min-h-0 py-[20px] px-[30px] bg-white overflow-x-hidden ${isMajorPage ? 'overflow-y-hidden grid-rows-[50px_minmax(0,1fr)]' : 'overflow-y-auto max-lg:grid-rows-[50px_auto]'} max-sm:p-[10px] max-sm:pb-0 [&::-webkit-scrollbar]:w-[1px] [&::-webkit-scrollbar]:h-[1px] [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:border-none [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:opacity-50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:border-0 ${!isMajorPage && (isShowSearch ? 'grid-rows-[120px_auto]' : 'grid-rows-[50px_auto]')}`}
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
      <div className={`relative min-h-0 ${isMajorPage ? 'h-full overflow-hidden' : ''}`}>
        {isPageNavigating ? <NavigationSkeleton pathname={pendingHref!} /> : children}
        {isModalNavigating && <ModalSkeleton />}
      </div>
    </div>
  );
}

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AnnouncementNotification />
      <div className="md:grid md:grid-cols-[110px_1fr] flex flex-col h-screen overflow-hidden bg-[var(--color-dark-white)]">
        <SidebarDrawer />
        <NavContent>{children}</NavContent>
      </div>
    </SidebarProvider>
  );
}
