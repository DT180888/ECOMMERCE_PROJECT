import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, CaretRight, Circle, CaretDown } from "@phosphor-icons/react";
import { cn } from "../shared/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center rounded-md px-2.5 py-1.5 text-[13px] font-sans outline-none focus:bg-primary/10 focus:text-primary data-[state=open]:bg-primary/10 data-[state=open]:text-primary transition-colors",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <CaretRight className="ml-auto h-3.5 w-3.5" weight="regular" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-9999 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-surface p-1.5 text-popover-foreground shadow-elevation-3 font-sans",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[9rem] overflow-hidden rounded-lg border border-border bg-surface p-1.5 text-popover-foreground shadow-elevation-3 font-sans",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 sm:py-1.5 text-sm sm:text-[13px] font-sans outline-none transition-colors min-h-[38px] sm:min-h-0 touch-manipulation",
      "focus:bg-primary/10 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2.5 text-[13px] font-sans outline-none transition-colors",
      "focus:bg-primary/10 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-20 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5 text-primary stroke-[2]" weight="bold" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2.5 text-[13px] font-sans outline-none transition-colors",
      "focus:bg-primary/10 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      className
    )}
    {...props}
  >
    <span className="absolute left-20 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-primary" weight="fill" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2.5 py-1.5 text-xs font-sans font-semibold text-muted-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};

/* -------------------------------------------------------------------------- */
/* FilterDropdown Preset Component                                            */
/* -------------------------------------------------------------------------- */

export interface FilterDropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface FilterDropdownProps {
  options: FilterDropdownOption[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  align?: "start" | "end" | "center";
  className?: string;
}

export function FilterDropdown({
  options,
  value,
  onSelect,
  placeholder,
  icon,
  align = "end",
  className,
}: FilterDropdownProps) {
  const active = options.find((o) => o.value === value) || options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-[34px] px-3 flex items-center justify-between gap-2 rounded-md transition-all cursor-pointer select-none",
            "bg-card text-foreground border border-border shadow-sm hover:border-border-strong",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
            "text-[13px] font-sans",
            className
          )}
        >
          <span className="flex items-center gap-1.5 min-w-0">
            {active?.icon || icon}
            {placeholder && (
              <span className="text-muted-foreground font-medium shrink-0">{placeholder}</span>
            )}
            <span className="truncate font-medium">{active?.label ?? ""}</span>
          </span>
          <CaretDown className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 shrink-0" weight="regular" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="min-w-[170px]">
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSelect(option.value)}
              data-state={isActive ? "active" : "inactive"}
              className={cn(
                "justify-between cursor-pointer",
                isActive && "font-semibold text-primary bg-primary/10",
                option.className
              )}
            >
              <span className="flex items-center gap-2 truncate">
                {option.icon && <span className="inline-flex shrink-0">{option.icon}</span>}
                <span className="truncate">{option.label}</span>
              </span>
              {isActive && <Check className="w-3.5 h-3.5 text-primary stroke-[2] shrink-0 ml-2" weight="bold" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
