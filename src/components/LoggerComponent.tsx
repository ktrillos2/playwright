import { consoleFont } from "@/config";

enum LogType {
  INFO = "INFO",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
}

enum LogCategory {
  COUPON = "COUPON",
}

interface LogMessage {
  type: LogType;
  category: LogCategory;
  message: string;
  date: string;
}

interface Props {
  messages: LogMessage[];
}

const Colors = {
  INFO: "text-white",
  ERROR: "text-red-500",
  SUCCESS: "text-green-500",
  WARNING: "text-yellow-500",
};

export const LoggerComponent: React.FC<Props> = ({ messages }) => {
  return (
    <div
      className={`w-full ${consoleFont.className} antialiased bg-content1 overflow-auto rounded-large shadow-small p-4 text-sm`}
    >
      {messages.map((message, index) => (
        <LogText key={index} {...message} />
      ))}
    </div>
  );
};

const LogText: React.FC<LogMessage> = ({ type, category, message, date }) => {
  return (
    <div className={Colors[type]}>
      <span>{date}</span> | <span>{category}</span> | <span>{type}</span> :{" "}
      <span>{message}</span>
    </div>
  );
};
