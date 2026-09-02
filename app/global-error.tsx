"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Layout Error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#050816] p-6 text-center text-white font-sans">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 text-red-400">
          <AlertTriangle aria-hidden="true" className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Application Error</h1>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          An unhandled error occurred in the application.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="ui-pressable ui-glass-surface ui-button-sheen flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-blue-500 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <RefreshCw aria-hidden="true" className="w-4 h-4" />
          <span>Reset Application</span>
        </button>
      </body>
    </html>
  );
}
