"use client";
import { Category, Commerce } from "@/interfaces";
import { Select, SelectItem, SelectProps } from "@nextui-org/react";

interface Props extends Omit<SelectProps, "children"> {
  categories: Commerce["categories"] | Category[];
}

export const SelectCategory: React.FC<Props> = ({
  categories,
  selectionMode,
  ...rest
}) => {

  return (
    <Select
      items={categories}
      label="Selecciona la categoría"
      className="w-1/6"
      variant="underlined"
      classNames={{
        trigger: "min-h-unit-18",
      }}
      {...rest}
    >
      {(category: any) => (
        <SelectItem
          key={category.category._id}
          textValue={category.category.name}
        >
          <div className="flex gap-2 items-center">
            <div className="flex flex-col">
              <span className="text-small">{category.category.name}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};
