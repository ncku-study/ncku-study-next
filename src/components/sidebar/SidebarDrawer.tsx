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
    { href: "/", activePaths: ["/", "/major"], label: t("major"), Icon: MajorLogo },
    { href: "/study", activePaths: ["/study"], label: t("study"), Icon: StudyLogo },
    { href: "/post", activePaths: ["/post"], label: t("post"), Icon: PostLogo },
    { href: "https://forms.gle/qqrnLmhQoLyZ1BULA", activePaths: [], label: t("contact"), Icon: ContactLogo, isExternal: true },
  ];

  const adminLinks: NavLink[] = [
    { href: "/admin/study", activePaths: ["/admin/study"], label: t("adminStudy"), Icon: SchoolIcon },
    { href: "/admin/major", activePaths: ["/admin/major"], label: t("adminMajor"), Icon: MajorLogo },
    { href: "/admin/department", activePaths: ["/admin/department"], label: t("adminDepartment"), Icon: SettingsIcon },
    { href: "/admin/announcement", activePaths: ["/admin/announcement"], label: t("adminAnnouncement"), Icon: AlertCircleIcon },
    { href: "/", activePaths: [], label: t("home"), Icon: HomeIcon },
  ];

  const navLinks = isAdmin ? adminLinks : regularLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 min-[993px]:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[110px] box-content border-r border-[rgba(0,0,0,0.12)] bg-white shadow-md transition-transform duration-300 ease-[ease] flex flex-col items-center ${
          isOpen ? "translate-x-0" : "max-[992px]:hidden -translate-x-full"
        } min-[993px]:relative min-[993px]:translate-x-0 min-[993px]:flex min-[993px]:shadow-none shrink-0`}
      >
        <nav className="flex w-full flex-col pt-[8px]">
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
