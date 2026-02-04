"use client";

import { useState } from "react";
import VideoGenerator from "@/components/VideoGenerator";
import FileUpload from "@/components/FileUpload";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addJob, updateJobStatus } from "@/store/slices/queue-slice";
import { v4 as uuidv4 } from "uuid";
import QueueStatus from "@/components/QueueStatus";

export default function LipSyncPage() {
  const [video, setVideo] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.queue.jobs);

  const handleGenerate = async () => {
    if (!video || !audio) return;

    const jobId = uuidv4();
    setLoading(true);
    setCurrentResult(null);

    dispatch(addJob({
      id: jobId,
      type: "lipsync",
      status: "processing",
      createdAt: new Date().toISOString(),
    }));

    try {
      const formData = new FormData();
      formData.append("video", video);
      formData.append("audio", audio);

      const response = await fetch("/api/lipsync", {
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
        title="Lip Sync"
        description="Sync any video's lip movements to a target audio track using SkyReels V1."
        isLoading={loading}
        onGenerate={handleGenerate}
        resultUrl={currentResult}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Source Video (Face)
            </label>
            <FileUpload
              label="Upload source video"
              accept={{ 'video/*': ['.mp4', '.mov', '.webm'] }}
              onFileSelect={setVideo}
              selectedFile={video}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Target Audio (Vocals)
            </label>
            <FileUpload
              label="Upload vocal track"
              accept={{ 'audio/*': ['.mp3', '.wav', '.m4a'] }}
              onFileSelect={setAudio}
              selectedFile={audio}
            />
          </div>
        </div>
      </VideoGenerator>
      <QueueStatus jobs={jobs} />
    </>
  );
}
