/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import ReactSelect, { Props as SelectProps, GroupBase } from "react-select";
import { reactSelectFlatStyles } from "./styles";

export interface CustomSelectProps<
  Option = any,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends SelectProps<Option, IsMulti, Group> {
  error?: boolean;
}

export const Select = forwardRef<any, CustomSelectProps<any, any, any>>(
  ({ styles, error, ...props }, ref) => {
    return (
      <ReactSelect
        ref={ref}
        styles={{ ...reactSelectFlatStyles, ...styles }}
        menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
        // Pass error through selectProps so it's accessible in styles.ts
        {...props}
        {...({ error } as any)}
      />
    );
  }
);

Select.displayName = "Select";
