import { Control, useFieldArray, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { reactSelectDarkStyles, Button, Input } from "@my-project/ui";
import { SwatchIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ProductFormSchema } from "@schemas/product";

const compactSelectStyles = {
  ...reactSelectDarkStyles,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: (base: any, state: any) => ({
    ...reactSelectDarkStyles.control!(base, state),
    minHeight: "36px",
    height: "36px",
    fontSize: "0.875rem",
    backgroundColor: "hsl(var(--card))",
    borderColor: state.isFocused ? "hsl(var(--accent))" : "hsl(var(--border) / 0.4)",
  }),
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-error mt-1 ml-1 flex items-center gap-1">⚠️ {message}</p>;
}

interface Props {
  control: Control<ProductFormSchema>;
  index: number;
  variantOptions: Array<{ value: number; label: string }>;
  getError: (oIdx: number, path: "attributeId" | "value") => string | undefined;
}

export function ProductFormSkuOptionsEditor({ control, index, variantOptions, getError }: Props) {
  const optsFA = useFieldArray({ control, name: `skus.${index}.options` as const });

  return (
    <div className="rounded-button bg-muted/20 p-4 space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
          <SwatchIcon className="w-3 h-3" /> Thuộc tính biến thể
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => optsFA.append({ attributeId: 0, value: "" })}
          className="text-xs h-6 px-2 text-accent hover:bg-accent/10"
        >
          + Thêm
        </Button>
      </div>

      {optsFA.fields.length === 0 && (
        <div className="text-xs text-muted italic text-center py-2">
          Không có thuộc tính nào (VD: Màu, Size).
        </div>
      )}

      {optsFA.fields.map((o, oIdx) => (
        <div
          key={o.id}
          className="grid grid-cols-1 md:grid-cols-7 gap-2 items-start animate-in slide-in-from-top-1 duration-200"
        >
          <div className="md:col-span-3">
            <Controller
              control={control}
              name={`skus.${index}.options.${oIdx}.attributeId`}
              render={({ field: { onChange, value, ref } }) => (
                <ReactSelect
                  ref={ref}
                  options={variantOptions}
                  value={variantOptions.find((opt) => Number(opt.value) === Number(value))}
                  onChange={(val: any) => onChange(Number(val?.value))}
                  styles={compactSelectStyles}
                  menuPortalTarget={document.body}
                  placeholder="Chọn thuộc tính"
                />
              )}
            />
            <FieldError message={getError(oIdx, "attributeId")} />
          </div>

          <div className="md:col-span-3">
            <Input
              {...control.register(`skus.${index}.options.${oIdx}.value` as const)}
              placeholder="Giá trị (VD: XL)"
              className="h-[36px] bg-card/50 border-transparent text-foreground text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
            />
            <FieldError message={getError(oIdx, "value")} />
          </div>

          <div className="md:col-span-1 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => optsFA.remove(oIdx)}
              className="h-[36px] w-[36px] p-0 text-muted hover:text-destructive hover:bg-destructive/10 rounded-inner"
            >
              <XMarkIcon className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

