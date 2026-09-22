/* eslint-disable @typescript-eslint/no-explicit-any */
import { GroupBase, StylesConfig } from "react-select";

// Custom Styles cho React Select theo Neumorphism (Soft UI) Design System
export const reactSelectFlatStyles: StylesConfig<any, false, GroupBase<any>> = {
    control: (base, state) => {
        const hasError = (state.selectProps as any).error;
        return {
            ...base,
            backgroundColor: state.isFocused ? "hsl(var(--background))" : "hsl(var(--foreground) / 0.1)",
            borderColor: hasError
                ? "hsl(var(--error))"
                : state.isFocused
                    ? "hsl(var(--foreground) / 0.4)"
                    : "transparent",
            borderWidth: "1px",
            minHeight: "32px",
            height: "32px",
            boxShadow: hasError
                ? "0 0 0 1px hsl(var(--error))"
                : state.isFocused
                    ? "0 0 0 1px hsl(var(--foreground) / 0.2)"
                    : "none",
            color: "hsl(var(--foreground))",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
                backgroundColor: state.isFocused ? "hsl(var(--background))" : "hsl(var(--foreground) / 0.04)",
            }
        };
    },

    valueContainer: (base) => ({
        ...base,
        padding: "0 8px",
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        height: "100%",
        margin: 0,
    }),

    singleValue: (base) => ({
        ...base,
        color: "hsl(var(--foreground))",
        fontWeight: 600,
        fontSize: "0.875rem",
        margin: 0,
        lineHeight: 1.5,
    }),

    placeholder: (base) => ({
        ...base,
        color: "hsl(var(--foreground) / 0.5)",
        fontSize: "0.75rem",
        fontWeight: 500,
        margin: 0,
        lineHeight: 1.5,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
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
            backgroundColor: "transparent !important"
        }
    }),

    menu: (base) => ({
        ...base,
        backgroundColor: "hsl(var(--card))",
        border: "1px solid hsl(var(--foreground) / 0.05)",
        borderRadius: "var(--radius-button)",
        boxShadow: "0 10px 24px rgba(0, 0, 0, 0.04), 0 4px 6px rgba(0, 0, 0, 0.02)",
        padding: "8px",
        zIndex: 9999,
        marginTop: "8px",
        overflow: "hidden",
    }),

    menuPortal: (base) => ({
        ...base,
        zIndex: 99999
    }),

    menuList: (base) => ({
        ...base,
        padding: 0,
        "::-webkit-scrollbar": { width: "6px" },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": {
            background: "hsl(var(--foreground) / 0.2)",
            borderRadius: "3px"
        },
        "::-webkit-scrollbar-thumb:hover": {
            background: "hsl(var(--foreground) / 0.4)"
        },
    }),

    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? "hsl(var(--foreground))"
            : state.isFocused
                ? "hsl(var(--foreground) / 0.04)"
                : "transparent",
        color: state.isSelected
            ? "hsl(var(--background))"
            : "hsl(var(--foreground))",
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: "0.875rem",
        fontWeight: state.isSelected ? 600 : 500,
        borderRadius: "4px",
        marginBottom: "4px",
        transition: "all 0.2s ease",
        "&:active": {
            backgroundColor: "hsl(var(--foreground) / 0.9)",
        },
        "&:last-child": {
            marginBottom: 0,
        }
    }),

    dropdownIndicator: (base, state) => ({
        ...base,
        color: "hsl(var(--muted))",
        padding: "4px",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s",
        transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
        "&:hover": {
            color: "hsl(var(--foreground))"
        }
    }),

    clearIndicator: (base) => ({
        ...base,
        color: "hsl(var(--muted))",
        padding: "4px",
        transition: "color 0.2s",
        "&:hover": {
            color: "hsl(var(--error))"
        }
    }),

    indicatorsContainer: (base) => ({
        ...base,
        paddingRight: "4px"
    }),
    indicatorSeparator: () => ({ display: "none" }),
};

// Aliases for backward compatibility
export const reactSelectLightStyles = reactSelectFlatStyles;
export const reactSelectDarkStyles = reactSelectFlatStyles;