import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const noStoreHeaders = [
  { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
  { key: 'Pragma', value: 'no-cache' },
  { key: 'Expires', value: '0' },
  { key: 'Surrogate-Control', value: 'no-store' },
];

const publicApiCacheHeaders = [
  { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=30, stale-while-revalidate=30' },
  { key: 'Surrogate-Control', value: 'max-age=30' },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  // next-auth@5.0.0-beta.31 currently exposes type declarations that are
  // incompatible with this project's React/Next versions. Only the EC2 deploy
  // command sets this flag, so local and CI type checks still surface the issue.
  typescript: {
    ignoreBuildErrors: process.env.SKIP_NEXT_TYPECHECK === 'true',
  },
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      { source: '/', destination: '/major', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        missing: [{ type: 'header', key: 'x-api-cache', value: 'no-store' }],
        headers: publicApiCacheHeaders,
      },
      {
        source: '/api/v2/admin/:path*',
        headers: noStoreHeaders,
      },
      {
        source: '/admin/:path*',
        headers: noStoreHeaders,
      },
      {
        source: '/api/:path*',
        has: [{ type: 'header', key: 'x-api-cache', value: 'no-store' }],
        headers: noStoreHeaders,
      },
      {
        source: '/api/auth/:path*',
        headers: noStoreHeaders,
      },
      {
        source: '/api/v2/user/:path*',
        headers: noStoreHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
