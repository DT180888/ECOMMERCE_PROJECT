import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { Button, Input, Checkbox, reactSelectDarkStyles } from "@my-project/ui";
import { TagIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[11px] font-mono text-destructive mt-1">{message}</p>;
}

const compactSelectStyles = {
  ...reactSelectDarkStyles,
  control: (base: any, state: any) => ({
    ...reactSelectDarkStyles.control!(base, state),
    minHeight: "32px",
    height: "32px",
    fontSize: "0.75rem",
    backgroundColor: "hsl(var(--card))",
    borderColor: state.isFocused ? "hsl(var(--foreground))" : "hsl(var(--border) / 0.6)",
    boxShadow: "none",
    borderRadius: "2px",
  }),
};

interface Props {
  attrAll: any[];
  attrOptions: Array<{ value: string | number; label: string }>;
}

export function ProductAttributes({ attrAll, attrOptions }: Props) {
  const {
    control,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<any>();
  const attrsFA = useFieldArray({ control, name: "attributes" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-xs font-medium font-sans uppercase tracking-[0.16em] text-foreground">
            Thông số kỹ thuật sản phẩm
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Khai báo các thuộc tính mô tả chi tiết (Chất liệu, Xuất xứ, Kiểu dáng, Hướng dẫn bảo quản...).
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={() => attrsFA.append({ attributeId: 0, valueText: "" })}
          className="rounded-[2px] h-8 text-xs font-semibold gap-1 shadow-none border-border/60 shrink-0"
        >
          <PlusIcon className="w-3.5 h-3.5 stroke-[1.5]" /> Thêm thông số
        </Button>
      </div>

      <div className="space-y-2">
        {attrsFA.fields.map((field, idx) => {
          const selectedAttrId = watch(`attributes.${idx}.attributeId`);
          const selectedAttrInfo = attrAll.find((a) => Number(a.attributeId) === Number(selectedAttrId));
          const dataType = selectedAttrInfo?.dataType;
          const unit = selectedAttrInfo?.unit;

          return (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-[2px] bg-surface/30 items-end hover:bg-surface/50 transition-colors"
            >
              <div className="md:col-span-5 space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                  Tên thuộc tính
                </label>
                <Controller
                  control={control}
                  name={`attributes.${idx}.attributeId`}
                  render={({ field: { onChange, value, ref } }) => (
                    <ReactSelect
                      ref={ref}
                      options={attrOptions}
                      value={attrOptions.find((o) => Number(o.value) === Number(value))}
                      onChange={(val: any) => {
                        onChange(Number(val?.value));
                        setValue(`attributes.${idx}.valueText`, "");
                        setValue(`attributes.${idx}.valueNumber`, undefined);
                        setValue(`attributes.${idx}.valueBool`, undefined);
                      }}
                      styles={compactSelectStyles}
                      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                      placeholder="Chọn thông số..."
                    />
                  )}
                />
                <FieldError message={(errors.attributes as any)?.[idx]?.attributeId?.message} />
              </div>

              <div className="md:col-span-6 space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                  Giá trị thiết lập {unit ? `(${unit})` : ""}
                </label>
                {dataType === 1 ? (
                  <Input
                    type="number"
                    {...register(`attributes.${idx}.valueNumber`, { valueAsNumber: true })}
                    placeholder="Nhập giá trị số..."
                    className="h-8 bg-card border-border/60 rounded-[2px] text-xs font-mono"
                  />
                ) : dataType === 2 ? (
                  <div className="flex items-center h-8">
                    <label className="text-xs text-foreground flex items-center gap-2 cursor-pointer select-none bg-card border border-border/60 px-3 h-full rounded-[2px] w-full transition-colors">
                      <Checkbox {...register(`attributes.${idx}.valueBool`)} />
                      <span>Kích hoạt / Xác nhận có</span>
                    </label>
                  </div>
                ) : (
                  <Input
                    type={dataType === 3 ? "date" : "text"}
                    {...register(`attributes.${idx}.valueText`)}
                    placeholder="Nhập giá trị thuộc tính..."
                    className="h-8 bg-card border-border/60 rounded-[2px] text-xs font-mono"
                  />
                )}
              </div>

              <div className="md:col-span-1 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => attrsFA.remove(idx)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-[2px]"
                  title="Xóa thông số này"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}

        {attrsFA.fields.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border/60 rounded-[2px] bg-transparent">
            <TagIcon className="w-8 h-8 mx-auto mb-2 opacity-30 text-muted-foreground" />
            <p className="text-xs">Chưa có thông số kỹ thuật nào được thêm cho sản phẩm này.</p>
            <p className="text-[11px] text-muted-foreground/70 font-mono mt-1">Bấm "Thêm thông số" ở trên để bổ sung</p>
          </div>
        )}
      </div>
    </div>
  );
}
