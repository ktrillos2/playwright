import { LogText } from "../ui/buttons";
import { consoleFont } from "@/config";

import { LogMessage, LogType } from "@/interfaces";

interface Props {
  messages: LogMessage[];
}

export const LoggerComponent: React.FC<Props> = ({ messages }) => {
  return (
    <code
      className={`w-full ${consoleFont.className} antialiased bg-content1 overflow-auto rounded-large shadow-small p-4 text-[12px] max-h-[50vh] lg:max-h-[75vh] flex flex-col-reverse`}
    >
      {!messages.length ? (
        <div className="w-full h-full grid place-content-center text-base">
          No hay logs para mostrar
        </div>
      ) : (
        messages.map((message, index) => (
          <LogText key={index} isLast={0 === index} logMessage={message} />
        ))
      )}
    </code>
  );
};
