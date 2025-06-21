"use client";

import { ReactNode, useEffect } from "react";
import NextTopLoader from "nextjs-toploader";
import { Tooltip } from "react-tooltip";
import config from "@/config";
import QueryProvider from "@/app/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// All the client wrappers are here (they can't be in server components)
// 1. NextTopLoader: Show a progress bar at the top when navigating between pages
// 2. Toaster: Show Success/Error messages anywhere from the app with toast()
// 3. Tooltip: Show tooltips if any JSX elements has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content=""
// 4. QueryProvider: Tanstack Query client provider
// 5. Analytics: Vercel Analytics
// 6. SpeedInsights: Vercel Speed Insights
const LayoutClient = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) =>
          console.log(
            "Service Worker registration successful, scope is:",
            registration.scope
          )
        )
        .catch((error) =>
          console.log("Service Worker registration failed:", error)
        );
    }
  }, []);

  return (
    <QueryProvider>
      <Toaster
        toastOptions={{
          duration: 3000,
        }}
      />
      {/* Show a progress bar at the top when navigating between pages */}
      <NextTopLoader color={config.colors.main} showSpinner={false} />

      {/* Content inside app/page.js files  */}
      {children}

      {/* Show tooltips if any JSX elements has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content="" */}
      <Tooltip
        id="tooltip"
        className="z-[60] !opacity-100 max-w-sm shadow-lg"
      />
      <Analytics />
      <SpeedInsights />
    </QueryProvider>
  );
};

export default LayoutClient;
