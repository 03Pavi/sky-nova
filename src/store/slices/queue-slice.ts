import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Job {
  id: string;
  type: "text" | "image" | "audio" | "lipsync";
  status: "queued" | "processing" | "completed" | "failed";
  createdAt: string; // ISO string
  prompt?: string;
  resultUrl?: string; // Add result URL to job
}

interface QueueState {
  jobs: Job[];
}

const initialState: QueueState = {
  jobs: [],
};

const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    addJob: (state, action: PayloadAction<Job>) => {
      // Add new job to the beginning of the list
      state.jobs.unshift(action.payload);
    },
    updateJobStatus: (state, action: PayloadAction<{ id: string; status: Job["status"]; resultUrl?: string }>) => {
      const job = state.jobs.find((j) => j.id === action.payload.id);
      if (job) {
        job.status = action.payload.status;
        if (action.payload.resultUrl) {
          job.resultUrl = action.payload.resultUrl;
        }
      }
    },
    removeJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter((j) => j.id !== action.payload);
    },
  },
});

export const { addJob, updateJobStatus, removeJob } = queueSlice.actions;
export default queueSlice.reducer;
