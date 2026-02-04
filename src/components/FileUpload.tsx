"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, FileVideo, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  accept: Record<string, string[]>;
  maxSize?: number; // in bytes
  label: string;
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
}

export default function FileUpload({
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  label,
  onFileSelect,
  selectedFile
}: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  const getIcon = () => {
    if (selectedFile?.type.startsWith('audio')) return <FileAudio className="w-8 h-8 text-indigo-400" />;
    if (selectedFile?.type.startsWith('video')) return <FileVideo className="w-8 h-8 text-indigo-400" />;
    return <ImageIcon className="w-8 h-8 text-indigo-400" />;
  };
  const Motion = motion.div

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <Motion
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...getRootProps() as any}
            className={cn(
              "relative cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-3xl border-2 border-dashed transition-all duration-300 bg-white/5",
              isDragActive ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/10",
              isDragReject && "border-red-500 bg-red-500/10"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <p className="mb-2 text-lg font-medium text-gray-300">
                {isDragActive ? "Drop the file here" : label}
              </p>
              <p className="text-sm text-gray-500">
                Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
              </p>
            </div>
          </Motion>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative w-full h-64 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6"
          >
            <button
              onClick={clearFile}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
              {getIcon()}
            </div>

            <p className="text-xl font-medium text-white truncate max-w-full px-4 mb-1">
              {selectedFile.name}
            </p>
            <p className="text-sm text-gray-400">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
