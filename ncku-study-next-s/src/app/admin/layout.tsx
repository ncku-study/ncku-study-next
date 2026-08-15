import React from "react";
import { getTranslations } from "next-intl/server";
import { buildAdminRobots, buildSeoMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  const t = await getTranslations('site');
  return buildSeoMetadata({
    title: t('title'),
    description: t('description'),
    pathname: '/admin',
    robots: buildAdminRobots(),
  });
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
