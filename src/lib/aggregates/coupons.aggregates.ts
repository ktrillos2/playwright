import { DBCollectionNames } from "@/enums";
import { LookupProps, stringToObjectId } from "..";
import { unwindLookup } from "../utils/unwind.util";
import { PipelineStage } from "mongoose";

export const generalLookup = ({
  pipeline = [],
  unwindData = false,
  collection,
  field
}: LookupProps & {
  collection: DBCollectionNames;
  field: string;
}): PipelineStage[] => {
  const stages: PipelineStage[] = [];

  stages.push({
    $lookup: {
      from: collection,
      localField: field,
      foreignField: "_id",
      as: field,
      pipeline,
    },
  });

  if (unwindData) {
    stages.push(unwindLookup(field));
  }

  return stages;
};

export const couponLookup = ({
  pipeline = [],
  unwindData = false,
}: LookupProps = {}): PipelineStage[] => {
  return generalLookup({
    pipeline,
    unwindData,
    collection: DBCollectionNames.COUPONS,
    field: "coupon",
  })
};

export const commerceLookup = ({
  pipeline = [],
  unwindData = false,
}: LookupProps = {}): PipelineStage[] => {
  return generalLookup({
    pipeline,
    unwindData,
    collection: DBCollectionNames.COMMERCES,
    field: "commerce",
  })
};

export const categoryLookup = ({
  pipeline = [],
  unwindData = false,
}: LookupProps = {}) => {
  return generalLookup({
    pipeline,
    unwindData,
    collection: DBCollectionNames.CATEGORIES,
    field: "category",
  })
};

export const validateMongoId = (_id: string, label = '_id') => {
  return {
    [label]: stringToObjectId(_id)
  }
}