"use client";

import { useState } from "react";
import VideoGenerator from "@/components/VideoGenerator";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addJob, updateJobStatus } from "@/store/slices/queue-slice";
import { v4 as uuidv4 } from "uuid";
import QueueStatus from "@/components/QueueStatus";

export default function TextToVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.queue.jobs);

  const handleGenerate = async () => {
    if (!prompt) return;

    const jobId = uuidv4();
    setLoading(true);
    setCurrentResult(null);

    // Add job to queue
    dispatch(addJob({
      id: jobId,
      type: "text",
      status: "processing",
      createdAt: new Date().toISOString(),
      prompt,
    }));

    try {
      const response = await fetch("/api/text-to-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setCurrentResult(url);
      dispatch(updateJobStatus({ id: jobId, status: "completed", resultUrl: url }));
    } catch (error) {
      console.error(error);
      dispatch(updateJobStatus({ id: jobId, status: "failed" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VideoGenerator
        title="Text to Video"
        description="Transform your imagination into reality with SkyReels V2 based on text prompts."
        isLoading={loading}
        onGenerate={handleGenerate}
        resultUrl={currentResult}
      >
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
            placeholder="A futuristic city with flying cars at sunset..."
          />
        </div>
      </VideoGenerator>
      <QueueStatus jobs={jobs} />
    </>
  );
}
