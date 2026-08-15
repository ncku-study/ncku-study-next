'use client';

import { useEffect } from 'react';
import { normalizeSeoDescription, LEGACY_SHARE_IMAGE, SITE_NAME } from './metadata';

interface SeoValues {
  title: string;
  description: string;
  pathname: string;
  openGraphType: 'article' | 'website';
}

interface UseClientSeoOptions {
  baseline: SeoValues;
  detail?: SeoValues;
}

function upsertMeta(attribute: 'name' | 'property', value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.content = content;
}

function getCanonicalUrl(pathname: string): string {
  const existingCanonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  const baseUrl = existingCanonical ? new URL(existingCanonical).origin : window.location.origin;
  const url = new URL(pathname, baseUrl);
  url.search = '';
  url.hash = '';
  return url.toString();
}

function applyClientSeo(values: SeoValues) {
  const description = normalizeSeoDescription(values.description);
  const canonicalUrl = getCanonicalUrl(values.pathname);

  document.title = values.title;
  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', values.title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:locale', 'zh_TW');
  upsertMeta('property', 'og:type', values.openGraphType);
  upsertMeta('property', 'og:image', LEGACY_SHARE_IMAGE);
  upsertMeta('property', 'og:image:alt', values.title);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', values.title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', LEGACY_SHARE_IMAGE);
  upsertMeta('name', 'twitter:image:alt', values.title);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;
}

export function useClientSeo({ baseline, detail }: UseClientSeoOptions) {
  const baselineTitle = baseline.title;
  const baselineDescription = baseline.description;
  const baselinePathname = baseline.pathname;
  const baselineOpenGraphType = baseline.openGraphType;
  const detailTitle = detail?.title;
  const detailDescription = detail?.description;
  const detailPathname = detail?.pathname;
  const detailOpenGraphType = detail?.openGraphType;

  useEffect(() => {
    const baselineValues: SeoValues = {
      title: baselineTitle,
      description: baselineDescription,
      pathname: baselinePathname,
      openGraphType: baselineOpenGraphType,
    };
    const values: SeoValues = detailTitle && detailDescription && detailPathname && detailOpenGraphType
      ? {
          title: detailTitle,
          description: detailDescription,
          pathname: detailPathname,
          openGraphType: detailOpenGraphType,
        }
      : baselineValues;

    applyClientSeo(values);

    return () => {
      applyClientSeo(baselineValues);
    };
  }, [
    baselineTitle,
    baselineDescription,
    baselinePathname,
    baselineOpenGraphType,
    detailTitle,
    detailDescription,
    detailPathname,
    detailOpenGraphType,
  ]);
}
