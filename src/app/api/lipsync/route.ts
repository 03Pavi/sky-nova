import { NextRequest, NextResponse } from "next/server";
import { hf } from "@/lib/hf-client";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const video = formData.get("video") as File;
    const audio = formData.get("audio") as File;

    if (!video || !audio) {
      return NextResponse.json(
        { error: "Both video and audio files are required" },
        { status: 400 }
      );
    }

    // For multi-modal inputs, usually we map them to expected keys or specific structure
    // Since HF Inference API wrappers for custom complex pipelines can be tricky, simple way:
    // We can't easily do multi-file inputs via standard hf.request without constructing the body manually if the API expects it.
    // However, many HF pipeline APIs accept a dictionary of inputs.

    // NOTE: This implementation assumes the API endoint accepts standard multipart/form-data 
    // or a JSON with base64 encoded files if using the wrapper. 
    // But `hf.request` supports blobs.
    // Let's try sending just the video and audio as inputs if possible, but usually it needs specific keys.
    // For now, I will use a simplified assumption that the model takes a specific inputs structure.
    // It's safer to separate the logic if the standard wrapper fails, but let's try to just pass the video for now as primary input if we must choose, 
    // OR more likely, we need to defer to `fetch` directly to sending multipart if `hf` doesn't support named multi-file.

    // Let's assume we can use the backend API directly via fetch to ensure multipart works if `hf` wrapper is limited.
    const apiHtml = `https://api-inference.huggingface.co/models/Skywork/SkyReels-V1`;

    const backendFormData = new FormData();
    backendFormData.append("video", video);
    backendFormData.append("audio", audio);

    const response = await fetch(apiHtml, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        // Content-Type: multipart/form-data is set automatically by fetch when body is FormData
      },
      body: backendFormData,
    });

    if (!response.ok) {
      throw new Error(`HF API error: ${response.statusText}`);
    }

    const resultBlob = await response.blob();

    return new NextResponse(resultBlob, {
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  } catch (error) {
    console.error("Lip-sync Error:", error);
    return NextResponse.json(
      { error: "Failed to generate lip-sync video" },
      { status: 500 }
    );
  }
}
