import { forwardRef, type ReactElement, type Ref } from "react";
import ReactSelect, {
  type Props as SelectProps,
  type GroupBase,
  type SelectInstance,
  type StylesConfig,
} from "react-select";
import { reactSelectFlatStyles } from "./styles";

export type CustomSelectProps<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = SelectProps<Option, IsMulti, Group> & {
  error?: boolean;
};

export type SelectComponent = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: CustomSelectProps<Option, IsMulti, Group> & {
    ref?: Ref<SelectInstance<Option, IsMulti, Group>>;
  }
) => ReactElement | null;

const SelectRender = forwardRef(function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  { styles, error, ...props }: CustomSelectProps<Option, IsMulti, Group>,
  ref: Ref<SelectInstance<Option, IsMulti, Group>>
) {
  const mergedStyles: StylesConfig<Option, IsMulti, Group> = {
    ...(reactSelectFlatStyles as unknown as StylesConfig<Option, IsMulti, Group>),
    ...styles,
  };

  return (
    <ReactSelect
      ref={ref}
      styles={mergedStyles}
      menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
      {...props}
      {...({ error } as Record<string, unknown>)}
    />
  );
});

SelectRender.displayName = "Select";

export const Select = SelectRender as unknown as SelectComponent;
