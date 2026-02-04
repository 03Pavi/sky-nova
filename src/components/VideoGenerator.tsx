"use client";

import { useState } from "react";
import { Send, Loader2, Download, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface VideoGeneratorProps {
  title: string;
  description: string;
  isLoading: boolean;
  onGenerate: () => void;
  resultUrl?: string | null;
  children: React.ReactNode;
}

export default function VideoGenerator({
  title,
  description,
  isLoading,
  onGenerate,
  resultUrl,
  children
}: VideoGeneratorProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          {title}
        </h1>
        <p className="text-gray-400 text-lg">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
            {children}

            <button
              onClick={onGenerate}
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate Video
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:h-[500px] h-[400px]">
          <div className="h-full w-full rounded-3xl border border-white/10 bg-black/40 overflow-hidden relative">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6" />
                <p className="text-lg font-medium text-white animate-pulse text-center">
                  Creating your masterpiece...
                </p>
                <p className="text-sm text-gray-500 mt-2 text-center max-w-xs">
                  This typically takes 2-3 minutes using SkyReels models.
                </p>
              </div>
            ) : resultUrl ? (
              <div className="relative h-full w-full group">
                <video
                  src={resultUrl}
                  controls
                  className="h-full w-full object-contain bg-black"
                  autoPlay
                  loop
                />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={resultUrl}
                    download={`skyreels-video-${Date.now()}.mp4`}
                    className="p-2 bg-black/60 backdrop-blur-md text-white rounded-lg hover:bg-white hover:text-black transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
                  <RefreshCw className="w-10 h-10 opacity-20" />
                </div>
                <p className="text-lg">Preview will appear here</p>
                <p className="text-sm opacity-60">Generate a video to see the magic</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
