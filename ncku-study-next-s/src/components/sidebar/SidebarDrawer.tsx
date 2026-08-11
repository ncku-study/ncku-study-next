"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { School, Settings, Home, AlertCircle } from "lucide-react";
import {
  Major as MajorLogo,
  Study as StudyLogo,
  Post as PostLogo,
  Contact as ContactLogo,
} from "@/components/logos";
import Link from "next/link";
import { useSidebar, SidebarProvider } from "./SidebarContext";

export { useSidebar, SidebarProvider };

type NavLink = {
  href: string;
  activePaths: string[];
  label: string;
  Icon: React.ComponentType<{ style?: React.CSSProperties }>;
  isExternal?: boolean;
};

const iconStyle = { width: "1.9rem", height: "1.9rem" };

function SchoolIcon({ style }: { style?: React.CSSProperties }) {
  return <School style={style} />;
}
function SettingsIcon({ style }: { style?: React.CSSProperties }) {
  return <Settings style={style} />;
}
function HomeIcon({ style }: { style?: React.CSSProperties }) {
  return <Home style={style} />;
}
function AlertCircleIcon({ style }: { style?: React.CSSProperties }) {
  return <AlertCircle style={style} />;
}

export function SidebarDrawer() {
  const { isOpen, setIsOpen, pendingHref, setPendingHref } = useSidebar();
  const pathname = usePathname();
  const t = useTranslations("nav");

  useEffect(() => {
    setPendingHref(null);
    setIsOpen(false);
  }, [pathname, setIsOpen, setPendingHref]);

  const isAdmin = pathname.startsWith("/admin/") || pathname === "/admin";

  const regularLinks: NavLink[] = [
    { href: "/", activePaths: ["/", "/major"], label: t("major") || "轉系雙主修", Icon: MajorLogo },
    { href: "/study", activePaths: ["/study"], label: t("study") || "學業心得", Icon: StudyLogo },
    { href: "/post", activePaths: ["/post"], label: t("post") || "我要分享", Icon: PostLogo },
    { href: "https://forms.gle/qqrnLmhQoLyZ1BULA", activePaths: [], label: "聯絡我們", Icon: ContactLogo, isExternal: true },
  ];

  const adminLinks: NavLink[] = [
    { href: "/admin/study", activePaths: ["/admin/study"], label: "審查學業", Icon: SchoolIcon },
    { href: "/admin/major", activePaths: ["/admin/major"], label: "審查轉輔轉", Icon: MajorLogo },
    { href: "/admin/department", activePaths: ["/admin/department"], label: "學院系設定", Icon: SettingsIcon },
    { href: "/admin/announcement", activePaths: ["/admin/announcement"], label: "公告設定", Icon: AlertCircleIcon },
    { href: "/", activePaths: [], label: "回到首頁", Icon: HomeIcon },
  ];

  const navLinks = isAdmin ? adminLinks : regularLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[110px] bg-white shadow-md transition-transform duration-300 ease-[ease] flex flex-col items-center ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:flex md:shadow-none shrink-0`}
      >
        <nav className="flex w-full flex-col">
          {navLinks.map((link) => {
            const isActive = pendingHref
              ? link.href === pendingHref
              : link.activePaths.some(
                  (p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/"))
                );
            const IconComponent = link.Icon;
            const isExternal = link.isExternal || link.href.startsWith("http");
            const linkProps = isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <Link
                key={link.href}
                href={link.href}
                {...linkProps}
                onClick={() => { if (!isExternal) { setPendingHref(link.href); setIsOpen(false); } }}
                className="flex flex-col items-center justify-center h-[80px] w-full cursor-pointer"
              >
                <div
                  className={`flex justify-center items-center w-[35px] h-[35px] rounded-[10px] mb-[5px] ${
                    isActive
                      ? "bg-yellow text-white"
                      : "bg-transparent text-yellow"
                  }`}
                  style={{ minWidth: "35px" }}
                >
                  <IconComponent style={iconStyle} />
                </div>
                <span className="text-[1.4rem] font-medium text-[#333333]">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
