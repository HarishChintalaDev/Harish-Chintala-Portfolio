"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#050816] p-6 text-center text-white" role="alert">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 text-red-400">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Something went wrong</h1>
      <p className="text-sm text-[#A0AEC0] max-w-md mb-6">
        An error occurred while loading this page.
      </p>
      <div className="flex w-full max-w-sm flex-col items-stretch justify-center gap-3 min-[420px]:flex-row min-[420px]:items-center">
        <button
          onClick={() => reset()}
          className="ui-pressable ui-glass-surface ui-button-sheen flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-medium text-white transition-all hover:bg-[#1D4ED8]"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
        <Link
          href="/"
          className="ui-pressable ui-glass-surface inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-medium text-white transition-all hover:bg-white/10"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
