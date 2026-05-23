import React from "react";
import NavLayout from "@/components/layout/NavLayout";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavLayout>{children}</NavLayout>;
}
