"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/user-slice";
import { motion } from "framer-motion";
import { Video, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    dispatch(setUser(email.split("@")[0])); // Use part of email as name
    router.push("/");
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#09090b] text-white overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 relative z-10">
        <div className="mb-12">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
            <Video className="text-white w-7 h-7" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
          >
            Welcome to SkyReels
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            The next generation of AI video creation.
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleLogin}
          className="space-y-6 max-w-sm"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-600"
              placeholder="name@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-indigo-500/25 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-sm text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.form>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Abstract visual representation */}
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[100px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
