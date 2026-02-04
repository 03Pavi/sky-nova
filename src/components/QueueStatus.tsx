"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "@/store/hooks";
import { removeJob } from "@/store/slices/queue-slice";
import { Loader2, CheckCircle2, Clock } from "lucide-react";

export interface Job {
  id: string;
  type: "text" | "image" | "audio" | "lipsync" | "talking-avatar";
  status: "queued" | "processing" | "completed" | "failed";
  createdAt: Date;
  prompt?: string;
}

export default function QueueStatus({ jobs = [] }: { jobs: Job[] }) {
  const [visibleJobs, setVisibleJobs] = useState<Job[]>(jobs);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setVisibleJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    jobs.forEach((job) => {
      if (job.status === "failed") {
        const timer = setTimeout(() => {
          setVisibleJobs((current) => current.filter((j) => j.id !== job.id));
          dispatch(removeJob(job.id));
        }, 3000);
        return () => clearTimeout(timer);
      }
    });
  }, [jobs, dispatch]);

  if (visibleJobs.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {visibleJobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="pointer-events-auto w-80 bg-[#09090b] border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4"
          >
            <div className="relative flex-shrink-0">
              {job.status === "processing" && (
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              )}
              {job.status === "completed" && (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              )}
              {job.status === "queued" && (
                <Clock className="w-8 h-8 text-amber-500" />
              )}
              {job.status === "failed" && (
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <span className="text-red-500 font-bold text-lg">!</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-white capitalize leading-tight mb-1">
                {job.type} Generation
              </h4>
              <p className="text-xs text-gray-400 capitalize truncate">
                {job.status === "failed" ? "Failed" : `${job.status}...`}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
