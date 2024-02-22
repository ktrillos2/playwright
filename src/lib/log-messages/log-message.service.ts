import { FilterQuery } from "mongoose";
import { LogMessageModel } from "..";
import {
  LogMessage,
  LogType,
  LogCategory,
} from "@/interfaces/log-message.interface";

interface PaginateProps {
  page?: number;
  limit?: number;
  sort?: string;
}

interface PaginatorProps<T = any> extends PaginateProps {
  query?: FilterQuery<T>;
}

interface CreateLog {
  type: LogType;
  category: LogCategory;
  message: string;
  error?: any;
}

class LogMessageDbService {
  constructor(private logMessageModel = LogMessageModel) {}

  async createLogMessage({
    type,
    category,
    message,
    error,
  }: CreateLog): Promise<LogMessage> {
    return this.logMessageModel.create({ type, category, message, error });
  }

  async getLogMessagesByCategory(category: LogCategory): Promise<LogMessage[]> {
    return this.logMessageModel.find({ category }).sort({ createdAt: -1 });
  }

  async getAllLogMessages(): Promise<LogMessage[]> {
    return this.logMessageModel.find().sort({ createdAt: -1 });
  }

  async getPaginateLogMessages({
    limit = 5,
    page = 1,
    sort = "createdAt",
    query = {},
  }: PaginatorProps<LogMessage> = {}) {
    return this.logMessageModel.paginate(query, { limit, page, sort });
  }

  async deleteLogMessagesByCategory(category: LogCategory): Promise<any> {
    return this.logMessageModel.deleteMany({ category });
  }
}

export const logMessageService = new LogMessageDbService();
