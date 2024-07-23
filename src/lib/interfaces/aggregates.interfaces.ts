import { PipelineStage } from "mongoose";

export interface LookupProps {
  pipeline?: any[],
  unwindData?: boolean
}