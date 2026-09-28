"use client";

import Script from "next/script";

const GA_MEASUREMENT_ID = "G-QL363EG2WY";

export default function GoogleAnalytics() {
  return (
    <>
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){window.dataLayer.push(arguments);};
          window.gtag('js', new Date());
          window.gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
