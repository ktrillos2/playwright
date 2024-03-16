
export interface LogMessage {
  type: LogType;
  category?: LogCategory;
  message: string;
  error?: any
  createdAt?: Date;
  updatedAt?: Date;
  date?: string
}

export enum SpecialLog {
  SEPARATOR = "separator",
}

export enum LogType {
  INFO = "INFO",
  LOADING = "LOADING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
}

export enum LogCategory {
  COUPON = "COUPON",
}
