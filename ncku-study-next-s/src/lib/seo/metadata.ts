import type { Metadata } from 'next';

const DEFAULT_SITE_URL = 'http://localhost:3000';
export const LEGACY_SHARE_IMAGE = 'https://i.imgur.com/GJawE7A.jpg';
export const SITE_NAME = 'NCKU STUDY';

export function normalizeSeoDescription(value: string | null | undefined): string {
  const description = (value ?? '')
    .replace(/<br\s*\/?>/gi, '')
    .replace(/\r?\n/g, '')
    .trim();

  return description.length > 85
    ? `${description.substring(0, 85)}......`
    : description;
}

function getMetadataBase(): URL {
  const configuredSiteUrl = process.env.NEXTAUTH_URL || DEFAULT_SITE_URL;

  try {
    return new URL(configuredSiteUrl);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

function getCanonicalUrl(pathname: string): string {
  const url = new URL(pathname, getMetadataBase());
  url.search = '';
  url.hash = '';
  return url.toString();
}

interface BuildSeoMetadataOptions {
  title: string;
  description: string;
  pathname: string;
  openGraphType?: 'article' | 'website';
  robots?: Metadata['robots'];
}

export function buildSeoMetadata({
  title,
  description,
  pathname,
  openGraphType = 'website',
  robots,
}: BuildSeoMetadataOptions): Metadata {
  const normalizedDescription = normalizeSeoDescription(description);
  const canonicalUrl = getCanonicalUrl(pathname);

  return {
    metadataBase: getMetadataBase(),
    title,
    description: normalizedDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: normalizedDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'zh_TW',
      type: openGraphType,
      images: [
        {
          url: LEGACY_SHARE_IMAGE,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: normalizedDescription,
      images: [LEGACY_SHARE_IMAGE],
    },
    ...(robots ? { robots } : {}),
  };
}

export function buildAdminRobots(): Metadata['robots'] {
  return {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  };
}
