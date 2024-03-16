import { consoleFont } from "@/config";

import { LogMessage, SpecialLog } from "@/interfaces";
import { LogText } from "..";
import { Divider } from "@nextui-org/react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  messages: (LogMessage | SpecialLog)[];
}

export const LoggerComponent: React.FC<Props> = ({
  messages,
  className,
  ...props
}) => {
  return (
    <code
      className={`w-full ${consoleFont.className} antialiased bg-content1 overflow-auto rounded-large shadow-small p-4 text-[12px] flex flex-col-reverse ${className}`}
      {...props}
    >
      {!messages.length ? (
        <div className="w-full h-full grid place-content-center text-base">
          No hay logs para mostrar
        </div>
      ) : (
        messages.map((message, index) =>
          message === SpecialLog.SEPARATOR ? (
            <Divider key={index} className="my-2"  />
          ) : (
            <LogText key={index} isLast={0 === index} logMessage={message} />
          )
        )
      )}
    </code>
  );
};
