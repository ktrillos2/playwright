import { LogText } from "..";
import { consoleFont } from "@/config";

import { LogMessage } from "@/interfaces";

interface Props {
  messages: LogMessage[];
}

export const LoggerComponent: React.FC<Props> = ({ messages }) => {
  const lastIndex = messages.length - 1;
  return (
    <code
      className={`w-full ${consoleFont.className} antialiased bg-content1 overflow-auto rounded-large shadow-small p-4 text-[12px] h-[50vh] lg:h-[75vh]`}
    >
      {!messages.length ? (
        <div className="w-full h-full grid place-content-center text-base">
          No hay logs para mostrar
        </div>
      ) : (
        messages.map((message, index) => (
          <LogText
            key={index}
            isLast={lastIndex === index}
            logMessage={message}
          />
        ))
      )}

      {/* Esperando nuevos logs <span className="dot" /> */}
    </code>
  );
};
