import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b]">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse" />

        <div className="relative bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-xl">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          SkyReels
        </h3>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_200ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_400ms]" />
        </div>
      </div>
    </div>
  );
}
