import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import QueryProvider from "@/providers/query-provider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import "./globals.css";

export const viewport = {
  themeColor: "rgba(254, 218, 106, 1)",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('site');
  return buildSeoMetadata({
    title: t('title'),
    description: t('description'),
    pathname: '/major',
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css?family=Noto+Sans+TC:100,400,700"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
