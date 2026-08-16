"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

interface MajorModalRouteValue {
  majorId: number | null;
  studyId: string | null;
  navigate: (href: string) => void;
  close: (backHref?: string) => void;
}

const MajorModalRouteContext = createContext<MajorModalRouteValue | null>(null);
const historyListeners = new Set<() => void>();

function subscribeToHistory(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  historyListeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    historyListeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

function getClientPathname() {
  return typeof window === "undefined" ? "" : window.location.pathname;
}

function notifyHistoryListeners() {
  historyListeners.forEach((listener) => listener());
}

function getMajorId(pathname: string): number | null {
  const match = pathname.match(/^\/major\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

function getStudyId(pathname: string): string | null {
  const match = pathname.match(/^\/study\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function toSameOriginPath(href: string) {
  const target = new URL(href, window.location.origin);
  if (target.origin !== window.location.origin) return null;
  return `${target.pathname}${target.search}${target.hash}`;
}

export function MajorModalRouteProvider({ children }: { children: React.ReactNode }) {
  const routerPathname = usePathname();
  const pathname = useSyncExternalStore(
    subscribeToHistory,
    getClientPathname,
    () => routerPathname ?? "",
  );

  const navigate = useCallback((href: string) => {
    const nextPath = toSameOriginPath(href);
    if (!nextPath) return;

    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (currentPath === nextPath) return;

    window.history.pushState(window.history.state, "", nextPath);
    notifyHistoryListeners();
  }, []);

  const close = useCallback((backHref = "/major") => {
    const nextPath = toSameOriginPath(backHref);
    if (!nextPath) return;

    window.history.replaceState(window.history.state, "", nextPath);
    notifyHistoryListeners();
  }, []);

  const value = useMemo(
    () => ({ majorId: getMajorId(pathname), studyId: getStudyId(pathname), navigate, close }),
    [close, navigate, pathname],
  );

  return <MajorModalRouteContext.Provider value={value}>{children}</MajorModalRouteContext.Provider>;
}

export function useOptionalMajorModalRoute() {
  return useContext(MajorModalRouteContext);
}

export function useOptionalStudyModalRoute() {
  return useContext(MajorModalRouteContext);
}
