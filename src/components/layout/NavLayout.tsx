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
    <button className="lg:hidden cursor-pointer border-0 bg-filter-transparent p-0 mr-0 leading-none" onClick={toggle} aria-label={t("menu")}>
      <svg
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={30}
        height={30}
        fill="var(--color-dark-black)"
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
  const displayPathname = isNavigating ? pendingHref! : pathname;
  const title = getTitle(displayPathname, t);
  const isShowSearch = displayPathname === '/study';
  const isMajorPage = displayPathname === '/' || displayPathname.startsWith('/major') || displayPathname.startsWith('/admin/major');

  return (
    <div
      className={`study-nav-content box-border grid grid-cols-1 w-full h-screen min-h-0 py-8 px-12 bg-white custom-scrollbar ${isMajorPage ? 'overflow-y-hidden' : 'overflow-y-auto'} max-sm:p-4 max-sm:pb-0 lg:flex-1 lg:min-w-0`}
      data-show-search={isShowSearch}
      style={isShowSearch ? undefined : { gridTemplateRows: '50px minmax(0, 1fr)' }}
    >
      <header className="w-full flex flex-wrap items-center max-sm:px-0">
        <HamburgerButton />
        <h1 className="m-0 text-[1.7rem] font-medium w-full max-lg:w-auto max-lg:pl-8">{title}</h1>
        {isShowSearch && (
          <form
            className="relative flex items-center w-220 h-18 max-lg:grow max-lg:w-1/2 max-lg:h-14 max-lg:pl-10 max-sm:w-1/3 max-sm:h-14 max-sm:pl-10"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="w-full h-18 py-4 px-6 box-border border border-input-border rounded-full bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-overlay max-sm:h-14 text-[13.3333px] leading-normal outline-none"
              aria-label="search"
            />
            <button
              type="submit"
              className="block absolute top-2 right-5 h-10 cursor-pointer p-0 border-0 bg-white text-[13.3333px] leading-normal"
            >
              <SearchIcon
                className="block"
                style={{ fill: 'var(--color-yellow)', width: '2.1875rem', height: '2.1875rem' }}
                aria-hidden="true"
              />
            </button>
          </form>
        )}
      </header>
      <div className={`relative min-h-0 ${isMajorPage ? 'h-full overflow-hidden' : ''} ${isShowSearch ? 'max-[576px]:-mx-[10px]' : ''}`}>
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
      <div className="lg:flex-row flex flex-col h-screen overflow-hidden bg-dark-white">
        <SidebarDrawer />
        <NavContent>{children}</NavContent>
      </div>
    </SidebarProvider>
  );
}
