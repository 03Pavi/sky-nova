"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Type, Image as ImageIcon, Mic, Users } from "lucide-react";

const features = [
  {
    icon: Type,
    title: "Text to Video",
    description: "Transform detailed text prompts into stunning video sequences via SkyReels V2.",
    href: "/text",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: ImageIcon,
    title: "Image to Video",
    description: "Bring static images to life with fluid motion and dynamic transitions.",
    href: "/image",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Mic,
    title: "Audio to Video",
    description: "Generate visuals that perfectly sync with your audio beats using SkyReels V3.",
    href: "/audio",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    title: "Lip Sync",
    description: "Create realistic lip-sync animations from audio tracks using SkyReels V1.",
    href: "/lipsync",
    color: "from-rose-500 to-pink-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Welcome back, Creator
        </h1>
        <p className="text-gray-400 text-lg">
          Select a tool below to start generating amazing content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Link key={feature.title} href={feature.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-full bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-6 flex-1 text-lg leading-relaxed">{feature.description}</p>

                <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors font-medium">
                  Try it now <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
