/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, type ReactElement, type Ref } from "react";
import ReactSelect, {
  type Props as SelectProps,
  type GroupBase,
  type SelectInstance,
  type StylesConfig,
} from "react-select";

// Custom Styles cho React Select theo Editorial Flat Design System
export const reactSelectFlatStyles: StylesConfig<any, boolean, GroupBase<any>> = {
  control: (base, state) => {
    const hasError = (state.selectProps as any).error;
    return {
      ...base,
      backgroundColor: state.isFocused ? "hsl(var(--background))" : "hsl(var(--surface) / 0.5)",
      borderColor: hasError
        ? "hsl(var(--error))"
        : state.isFocused
          ? "hsl(var(--foreground))"
          : "hsl(var(--border) / 0.6)",
      borderWidth: "1px",
      borderRadius: "2px",
      minHeight: "36px",
      height: "36px",
      boxShadow: "none",
      color: "hsl(var(--foreground))",
      cursor: "pointer",
      transition: "colors 0.2s",
      "&:hover": {
        borderColor: "hsl(var(--foreground))",
      },
    };
  },

  valueContainer: (base) => ({
    ...base,
    padding: "0 10px",
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    height: "100%",
    margin: 0,
  }),

  singleValue: (base) => ({
    ...base,
    color: "hsl(var(--foreground))",
    fontWeight: 500,
    fontSize: "0.75rem",
    fontFamily: "var(--font-display, inherit)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: 0,
  }),

  placeholder: (base) => ({
    ...base,
    color: "hsl(var(--muted-foreground) / 0.6)",
    fontSize: "0.75rem",
    fontFamily: "var(--font-display, inherit)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: 0,
  }),

  input: (base) => ({
    ...base,
    color: "hsl(var(--foreground))",
    margin: 0,
    padding: 0,
    "& input": {
      boxShadow: "none !important",
      outline: "none !important",
      border: "none !important",
      backgroundColor: "transparent !important",
    },
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border) / 0.6)",
    borderRadius: "2px",
    boxShadow: "none",
    padding: "4px",
    zIndex: 9999,
    marginTop: "4px",
    overflow: "hidden",
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),

  menuList: (base) => ({
    ...base,
    padding: 0,
    "::-webkit-scrollbar": { width: "4px" },
    "::-webkit-scrollbar-track": { background: "transparent" },
    "::-webkit-scrollbar-thumb": {
      background: "hsl(var(--border))",
      borderRadius: "2px",
    },
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "hsl(var(--foreground))"
      : state.isFocused
        ? "hsl(var(--surface))"
        : "transparent",
    color: state.isSelected
      ? "hsl(var(--background))"
      : "hsl(var(--foreground))",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontFamily: "var(--font-display, inherit)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: state.isSelected ? 600 : 400,
    borderRadius: "2px",
    marginBottom: "2px",
    transition: "colors 0.15s",
    "&:last-child": {
      marginBottom: 0,
    },
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: "hsl(var(--muted-foreground))",
    padding: "4px 8px",
    transition: "transform 0.2s, color 0.2s",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
    "&:hover": {
      color: "hsl(var(--foreground))",
    },
  }),

  clearIndicator: (base) => ({
    ...base,
    color: "hsl(var(--muted))",
    padding: "4px",
    transition: "color 0.2s",
    "&:hover": {
      color: "hsl(var(--error))",
    },
  }),

  indicatorsContainer: (base) => ({
    ...base,
    paddingRight: "4px",
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

// Aliases for backward compatibility
export const reactSelectLightStyles = reactSelectFlatStyles;
export const reactSelectDarkStyles = reactSelectFlatStyles;

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

export const LegacySelect = SelectRender as unknown as SelectComponent;
