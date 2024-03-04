import { PipelineStage } from "mongoose";

export const unwindLookup = (
  path: string,
  preserveNullAndEmptyArrays: boolean = false
): PipelineStage.Unwind => ({
  $unwind: { path: `$${path}`, preserveNullAndEmptyArrays },
});
