import { GA_TRACKING_ID } from 'libs/gtag';
import { ReactNode } from 'react';
import Script from 'next/script';

interface AnalyticsProps {
  children?: ReactNode;
}

export function Analytics({}: AnalyticsProps) {
  return (
    <>
      <Script
        id="analytics"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
