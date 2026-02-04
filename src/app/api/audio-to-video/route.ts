import { NextRequest, NextResponse } from "next/server";
import { hf } from "@/lib/hf-client";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    const prompt = formData.get("prompt") as string;

    if (!audio) {
      return NextResponse.json(
        { error: "Audio is required" },
        { status: 400 }
      );
    }

    const audioBlob = new Blob([await audio.arrayBuffer()], { type: audio.type });

    // Using generic request for custom model capability
    // This assumes the model accepts audio input directly
    const response = await hf.request({
      model: "Skywork/SkyReels-V3-A2V-19B",
      inputs: audioBlob,
      parameters: {
        prompt: prompt || "visualize this audio",
      }
    });

    return new NextResponse(response as Blob, {
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  } catch (error) {
    console.error("Audio-to-Video Error:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}
