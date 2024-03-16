import dayjs from "dayjs";

import { LogMessage, LogType } from "@/interfaces";

const Colors = {
  INFO: "text-blue-500",
  LOADING: "text-white",
  ERROR: "text-red-500",
  SUCCESS: "text-green-500",
  WARNING: "text-yellow-500",
};

interface Props {
  logMessage: LogMessage;
  isLast?: boolean;
}

export const LogText: React.FC<Props> = ({ logMessage, isLast = false }) => {
  const { type, category, message, createdAt } = logMessage;

  const isLoading = type === LogType.LOADING;
  const date = dayjs(createdAt);
  const formattedDate = date.format("DD/MM/YYYY HH:mm:ss");
  return (
    <div className={Colors[type]}>
      <span>
        [{formattedDate}] {category ? `${category} |` : null} {type} : {message}
      </span>
      {isLoading && isLast ? <span className="dot ml-0.5" /> : null}
    </div>
  );
};
