import { HfInference } from "@huggingface/inference";

// Use a cleaner singleton pattern check
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!HUGGINGFACE_API_KEY) {
  console.warn("HUGGINGFACE_API_KEY is not defined in environment variables");
}

export const hf = new HfInference(HUGGINGFACE_API_KEY);
