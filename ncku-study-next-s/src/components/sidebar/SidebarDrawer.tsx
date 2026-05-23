"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, BookOpen, PenLine } from "lucide-react";
import { useSidebar, SidebarProvider } from "./SidebarContext";

export { useSidebar, SidebarProvider };

export function SidebarDrawer() {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();
  const t = useTranslations("nav");

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  const navLinks = [
    { href: "/", activePath: ["/", "/major"], label: t("major"), icon: Home },
    { href: "/study", activePath: ["/study"], label: t("study"), icon: BookOpen },
    { href: "/post", activePath: ["/post"], label: t("post"), icon: PenLine },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[110px] bg-[var(--color-white)] shadow-md transition-transform duration-300 ease-[ease] flex flex-col items-center py-4 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:flex`}
      >
        <nav className="flex w-full flex-col mt-4">
          {navLinks.map((link) => {
            const isActive = link.activePath.some(
              (path) => pathname === path || (path !== "/" && pathname.startsWith(path + "/"))
            );
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center py-6 px-2 w-full transition-colors ${
                  isActive
                    ? "text-[var(--color-yellow)]"
                    : "text-[var(--color-light-black)] hover:bg-[var(--color-dark-white)]"
                }`}
              >
                <Icon className="w-8 h-8 mb-2" />
                <span className="text-base font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
