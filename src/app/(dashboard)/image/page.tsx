"use client";

import { useState } from "react";
import VideoGenerator from "@/components/VideoGenerator";
import FileUpload from "@/components/FileUpload";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addJob, updateJobStatus } from "@/store/slices/queue-slice";
import { v4 as uuidv4 } from "uuid";
import QueueStatus from "@/components/QueueStatus";

export default function ImageToVideoPage() {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.queue.jobs);

  const handleGenerate = async () => {
    if (!image) return;

    const jobId = uuidv4();
    setLoading(true);
    setCurrentResult(null);

    dispatch(addJob({
      id: jobId,
      type: "image",
      status: "processing",
      createdAt: new Date().toISOString(),
      prompt,
    }));

    try {
      const formData = new FormData();
      formData.append("image", image);
      if (prompt) formData.append("prompt", prompt);

      const response = await fetch("/api/image-to-video", {
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
        title="Image to Video"
        description="Animate your static images into captivating videos using SkyReels V2."
        isLoading={loading}
        onGenerate={handleGenerate}
        resultUrl={currentResult}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Source Image
            </label>
            <FileUpload
              label="Upload an image"
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
              onFileSelect={setImage}
              selectedFile={image}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Optional Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              placeholder="Describe the motion (e.g., camera pan right, slow zoom)..."
            />
          </div>
        </div>
      </VideoGenerator>
      <QueueStatus jobs={jobs} />
    </>
  );
}
