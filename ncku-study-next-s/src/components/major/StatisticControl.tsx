"use client";

import React, { useState } from "react";
import { BarChart2, X } from "lucide-react";

interface StatisticControlProps {
  children: React.ReactNode;
}

export default function StatisticControl({ children }: StatisticControlProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Outer div always occupies the grid slot. Inner div hidden on mobile so children don't render. */}
      <div>
        <div className="max-[576px]:hidden h-full">{children}</div>
      </div>

      {/* Mobile float button — fixed bottom-right, hidden on desktop */}
      <button
        className="min-[577px]:hidden fixed bottom-[40px] right-[20px] z-40 w-[50px] h-[50px] rounded-full bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] flex items-center justify-center text-yellow cursor-pointer border-none"
        onClick={() => setOpen(true)}
        aria-label="統計數據"
      >
        <BarChart2 style={{ width: "3rem", height: "3rem" }} />
      </button>

      {/* Mobile modal */}
      {open && (
        <div
          className="min-[577px]:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-[5px] px-[2px] w-[90vw] max-w-[420px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-[15px] min-h-[50px] flex items-center">
              <h4 className="m-0 text-[1.6rem]">統計數據</h4>
              <button
                className="absolute top-[5px] right-[5px] w-[35px] h-[35px] bg-transparent border-none outline-none flex items-center justify-center text-black/50 cursor-pointer"
                onClick={() => setOpen(false)}
                aria-label="關閉"
              >
                <X size={20} />
              </button>
            </div>

            {/* Divider */}
            <div className="bg-black/[0.125] w-[95%] h-[0.5px] mx-[10px] my-0" />

            {/* Content */}
            {children}
          </div>
        </div>
      )}
    </>
  );
}
