import { PipelineStage } from "mongoose";

export interface LookupProps {
  pipeline?: PipelineStage.Lookup["$lookup"]["pipeline"],
  unwindData?: boolean
}