"use client";

import { useState } from "react";
import VideoGenerator from "@/components/VideoGenerator";
import FileUpload from "@/components/FileUpload";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addJob, updateJobStatus } from "@/store/slices/queue-slice";
import { v4 as uuidv4 } from "uuid";
import QueueStatus from "@/components/QueueStatus";

export default function AudioToVideoPage() {
  const [audio, setAudio] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.queue.jobs);

  const handleGenerate = async () => {
    if (!audio) return;

    const jobId = uuidv4();
    setLoading(true);
    setCurrentResult(null);

    dispatch(addJob({
      id: jobId,
      type: "audio",
      status: "processing",
      createdAt: new Date().toISOString(),
      prompt,
    }));

    try {
      const formData = new FormData();
      formData.append("audio", audio);
      if (prompt) formData.append("prompt", prompt);

      const response = await fetch("/api/audio-to-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Generation failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setCurrentResult(url);
      dispatch(updateJobStatus({ id: jobId, status: "completed", resultUrl: url }));
    } catch (error) {
      dispatch(updateJobStatus({ id: jobId, status: "failed" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VideoGenerator
        title="Audio to Video"
        description="Create visualizers that react to your audio tracks using SkyReels V3."
        isLoading={loading}
        onGenerate={handleGenerate}
        resultUrl={currentResult}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Source Audio
            </label>
            <FileUpload
              label="Upload audio track"
              accept={{ 'audio/*': ['.mp3', '.wav', '.m4a'] }}
              onFileSelect={setAudio}
              selectedFile={audio}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Visual Style Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              placeholder="Neon lights pulsing, cyberpunk vibes, abstract geometric shapes..."
            />
          </div>
        </div>
      </VideoGenerator>
      <QueueStatus jobs={jobs} />
    </>
  );
}
