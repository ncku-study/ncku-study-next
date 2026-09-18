"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { BarChart as BarChartLogo } from "@/components/logos";

interface StatisticControlProps {
  children: React.ReactNode;
}

export default function StatisticControl({ children }: StatisticControlProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("major");

  return (
    <>
      {/* Outer div always occupies the grid slot. Inner div hidden on mobile so children don't render. */}
      <div className="h-64 max-lg:h-0 overflow-hidden">
        <div className="max-lg:hidden h-full">{children}</div>
      </div>

      {/* Mobile float button — fixed bottom-right, hidden on desktop */}
        <button
          className="hidden max-lg:fixed max-lg:bottom-10 max-lg:right-5 max-lg:flex max-lg:z-40 max-lg:w-20 max-lg:h-20 max-lg:rounded-full bg-white shadow items-center justify-center text-yellow cursor-pointer border-none"
          onClick={() => setOpen(true)}
          aria-label={t("statistics")}
        >
          <BarChartLogo style={{ width: "3rem", height: "3rem" }} />
        </button>

      {/* Mobile modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-md px-2 w-11/12 max-w-168"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 min-h-20 flex items-center">
              <h4 className="m-0 text-[1.6rem]">{t("statistics")}</h4>
              <button
                className="absolute top-2 right-2 w-14 h-14 bg-transparent border-none outline-none flex items-center justify-center text-overlay cursor-pointer"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
              >
                <X size={20} />
              </button>
            </div>

            {/* Divider */}
            <div className="bg-card-border w-11/12 h-px mx-4 my-0" />

            {/* Content */}
            {children}
          </div>
        </div>
      )}
    </>
  );
}
