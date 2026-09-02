import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#050816] p-6 text-center text-white">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#7C5CFC] p-[1px] mb-6">
        <div className="w-full h-full bg-[#050816] rounded-[15px] flex items-center justify-center">
          <Terminal className="w-8 h-8 text-[#00E5FF]" />
        </div>
      </div>

      <h1 className="text-6xl font-black font-mono text-[#00E5FF]">404</h1>
      <h2 className="text-2xl font-bold text-white mt-2">Page Not Found</h2>
      <p className="text-xs text-[#A0AEC0] max-w-sm mt-2 leading-relaxed">
        The requested page endpoint does not exist or has been relocated.
      </p>

      <Link
        href="/"
        className="ui-pressable ui-glass-surface ui-button-sheen mt-6 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-indigo-700 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-[#4F8CFF]/20 transition-all hover:from-sky-600 hover:to-indigo-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Portfolio</span>
      </Link>
    </main>
  );
}
