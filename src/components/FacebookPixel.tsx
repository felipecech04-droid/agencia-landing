"use client";

import { useEffect } from "react";

export default function FacebookPixel({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    if (!pixelId) return;

    // @ts-expect-error
    window.fbq = function (n, t, o, e, r) {
      // @ts-expect-error
      window._fbq = window._fbq || [];
      // @ts-expect-error
      window._fbq.push([n, t, o, e, r]);
      if (r) r();
    };
    // @ts-expect-error
    if (!window._fbq) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://connect.facebook.net/en_US/fbevents.js`;
      document.head.appendChild(script);

      // @ts-expect-error
      window._fbq = window._fbq || [];
      // @ts-expect-error
      window.fbq("init", pixelId);
      // @ts-expect-error
      window.fbq("track", "PageView");
    }
  }, [pixelId]);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
