import { NextRequest, NextResponse } from "next/server";
import { hf } from "@/lib/hf-client";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const audio = formData.get("audio") as File;

    if (!image || !audio) {
      return NextResponse.json(
        { error: "Both image and audio files are required" },
        { status: 400 }
      );
    }

    // Using SadTalker model for Talking Avatar
    const apiHtml = `https://api-inference.huggingface.co/models/vinthony/SadTalker`;

    // SadTalker typically expects certain input names.
    // Since direct API support varies, we map "image" to "source_image" and "audio" to "driven_audio".
    const backendFormData = new FormData();
    backendFormData.append("source_image", image);
    backendFormData.append("driven_audio", audio);
    // Add default settings if needed
    // backendFormData.append("preprocess", "full"); 

    const response = await fetch(apiHtml, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      // If the specific model API fails (often due to input format or loading), 
      // we might want to log the text for debugging.
      const errText = await response.text();
      console.error("HF SadTalker API Error:", response.status, errText);
      throw new Error(`HF API error: ${response.statusText}`);
    }

    const resultBlob = await response.blob();

    return new NextResponse(resultBlob, {
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  } catch (error) {
    console.error("Talking Avatar Error:", error);
    return NextResponse.json(
      { error: "Failed to generate avatar video" },
      { status: 500 }
    );
  }
}
