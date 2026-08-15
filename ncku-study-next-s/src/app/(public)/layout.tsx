import React from "react";
import NavLayout from "@/components/layout/NavLayout";
import { MajorModalRouteProvider } from "@/components/major/MajorModalRouteContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavLayout>
      <MajorModalRouteProvider>{children}</MajorModalRouteProvider>
    </NavLayout>
  );
}
