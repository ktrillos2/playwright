import { DBCollectionNames } from "@/enums";
import { LookupProps } from "..";
import { unwindLookup } from "../utils/unwind.util";
import { PipelineStage } from "mongoose";

export const commerceLookup = ({
  pipeline = [],
  unwindData = false,
}: LookupProps = {}): PipelineStage[] => {
  const stages: PipelineStage[] = [];

  stages.push({
    $lookup: {
      from: DBCollectionNames.COMMERCES,
      localField: "commerce",
      foreignField: "_id",
      as: "commerce",
      pipeline,
    },
  });

  if (unwindData) {
    stages.push(unwindLookup("commerce"));
  }

  return stages;
};

export const categoryLookup = ({
  pipeline = [],
  unwindData = false,
}: LookupProps = {}) => {

  const stages: PipelineStage[] = [];

  stages.push({
    $lookup: {
      from: DBCollectionNames.CATEGORIES,
      localField: "category",
      foreignField: "_id",
      as: "category",
      pipeline,
    },
  });

  if (unwindData) {
    stages.push(unwindLookup("category"));
  }

  return stages;
};
