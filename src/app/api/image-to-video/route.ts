import { NextRequest, NextResponse } from "next/server";
import { hf } from "@/lib/hf-client";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const prompt = formData.get("prompt") as string;

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Convert File to Blob for HF API
    const imageBlob = new Blob([await image.arrayBuffer()], { type: image.type });

    const response = await hf.imageToVideo({
      model: "Skywork/SkyReels-V2-I2V-14B",
      inputs: imageBlob,
      parameters: {
        prompt: prompt || "animate this image",
        num_inference_steps: 25,
      }
    });

    return new NextResponse(response, {
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  } catch (error) {
    console.error("Image-to-Video Error:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}
