"use client";
import { Category, Commerce } from "@/interfaces";
import { Select, SelectItem, SelectProps } from "@nextui-org/react";

interface Props extends Omit<SelectProps, "children"> {
  categories: Commerce["categories"] | Category[];
  isCategoryByCommerce?: boolean;
  valueKey?: keyof Category;
}

export const SelectCategory: React.FC<Props> = ({
  categories,
  isCategoryByCommerce = false,
  valueKey = "_id",
  ...rest
}) => {
  return (
    <Select
      items={categories}
      label="Selecciona la categoría"
      variant="underlined"
      {...rest}
    >
      {(e: any) => {
        const category = isCategoryByCommerce ? e.category : e;
        return (
          <SelectItem key={category[valueKey]} textValue={category.name}>
            <div className="flex gap-2 items-center">
              <div className="flex flex-col">
                <span className="text-small">{category.name}</span>
              </div>
            </div>
          </SelectItem>
        );
      }}
    </Select>
  );
};
