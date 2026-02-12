'use client';

import { useState } from 'react';
import Script from 'next/script';

const CONSENT_KEY = 'cb-analytics-consent';
const GA_ID = 'G-N91F3VEKB4';

function getStoredConsent(): 'granted' | 'denied' | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'granted' || stored === 'denied') return stored;
  return null;
}

export function CookieConsent() {
  const [consent, setConsent] = useState<'granted' | 'denied' | null>(getStoredConsent);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    setConsent('granted');
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    setConsent('denied');
  };

  // No stored preference — show banner
  const showBanner = consent === null;

  return (
    <>
      {/* Only load GA after consent */}
      {consent === 'granted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-lg rounded-xl border border-accent/20 bg-background/95 p-4 shadow-2xl backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-auto sm:p-5"
        >
          <p className="mb-3 text-sm leading-relaxed text-foreground/80">
            This site uses Google Analytics to understand how visitors interact with it. No personal data is sold.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={accept}
              className="rounded-lg bg-accent/20 px-4 py-2 font-mono text-xs tracking-wider text-accent transition-colors hover:bg-accent/30"
            >
              Accept
            </button>
            <button
              onClick={decline}
              className="rounded-lg px-4 py-2 font-mono text-xs tracking-wider text-foreground/60 transition-colors hover:text-foreground/90"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
