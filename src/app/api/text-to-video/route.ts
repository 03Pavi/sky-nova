import { NextRequest, NextResponse } from "next/server";
import { hf } from "@/lib/hf-client";

export const maxDuration = 300; // 5 minutes timeout for generation

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await hf.textToVideo({
      model: "ali-vilab/text-to-video-ms-1.7b",
      inputs: prompt,
    });

    return new NextResponse(response, {
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  } catch (error) {
    console.error("Text-to-Video Error:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}
