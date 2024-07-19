import { LogCategory, LogType } from "@/interfaces";
import mongoose, { Document, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


interface LogMessageDocument extends Document {
  type: LogType;
  category: LogCategory;
  message: string;
  error?: any;
}

const logMessageSchema = new Schema<LogMessageDocument>({
  type: { type: String, enum: Object.values(LogType), required: true },
  category: { type: String, enum: Object.values(LogCategory), required: true },
  message: { type: String, required: true },
  error: { type: Schema.Types.Mixed, default: null },
}, { timestamps: true });

logMessageSchema.plugin(mongoosePaginate);

export const LogMessageModel: PaginateModel<LogMessageDocument> =
  (mongoose.models.ScraperLogMessage as PaginateModel<LogMessageDocument>) ||
  mongoose.model<LogMessageDocument, PaginateModel<LogMessageDocument>>(
    "ScraperLogMessage",
    logMessageSchema
  );