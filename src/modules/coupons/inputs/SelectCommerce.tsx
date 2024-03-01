"use client";
import { Commerce } from "@/interfaces";
import { Avatar, Select, SelectItem, SelectProps } from "@nextui-org/react";
import clsx from "clsx";

interface Props extends Omit<SelectProps, "children"> {
  commerces: Commerce[];
  valueKey?: keyof Commerce
}

export const SelectCommerce: React.FC<Props> = ({
  commerces,
  selectionMode,
  valueKey = "_id",
  ...rest
}) => {
  const isMultiple = selectionMode === "multiple";

  return (
    <Select
      items={commerces}
      selectionMode={selectionMode}
      label="Comercio"
      variant="underlined"

      renderValue={(items: any) => {
        return (
          <div className={clsx({ "flex gap-1.5": isMultiple })}>
            {items.map((commerce: any) => (
              <div className="flex gap-2 items-center" key={commerce.key}>
                <Avatar src={commerce.data?.image} alt="image" size="sm" />
                {isMultiple ? null : (
                  <div className="flex flex-col">
                    <span className="text-small">{commerce.data?.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }}
      {...rest}
    >
      {(commerce: any) => (
        <SelectItem key={commerce[valueKey]} textValue={commerce.name}>
          <div className="flex gap-2 items-center">
            <Avatar src={commerce.image} alt="image" size="md" />
            <div className="flex flex-col">
              <span className="text-small">{commerce.name}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};
