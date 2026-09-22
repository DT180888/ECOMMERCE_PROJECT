import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { Button, Input, Checkbox, reactSelectDarkStyles } from "@my-project/ui";
import { TagIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-error mt-1 ml-1 flex items-center gap-1">⚠️ {message}</p>;
}

const compactSelectStyles = {
    ...reactSelectDarkStyles,
    control: (base: any, state: any) => ({
        ...reactSelectDarkStyles.control!(base, state),
        minHeight: '36px',
        height: '36px',
        fontSize: '0.875rem',
        backgroundColor: 'hsl(var(--card))',
        borderColor: state.isFocused ? 'hsl(var(--accent))' : 'hsl(var(--border) / 0.4)',
    })
};

interface Props {
  attrAll: any[];
  attrOptions: Array<{ value: string | number; label: string }>;
}

export function ProductAttributes({ attrAll, attrOptions }: Props) {
  const { control, watch, setValue, register, formState: { errors } } = useFormContext<any>();
  const attrsFA = useFieldArray({ control, name: "attributes" });

  return (
    <div className="bg-transparent border border-neo-bevel rounded-card p-6">
        <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
                <h3 className="text-lg font-medium text-foreground">Thông số kỹ thuật</h3>
                <p className="text-sm text-muted">Thêm các thuộc tính mô tả (VD: Chất liệu, Năm sản xuất...)</p>
            </div>
            <Button type="button" variant="outline" onClick={() => attrsFA.append({ attributeId: 0, valueText: "" })} className="border-dashed border-border text-foreground hover:text-foreground hover:border-accent hover:bg-accent/10 transition-all">
                <PlusIcon className="w-3 h-3 md:w-4 md:h-4 mr-2"/> Thêm thuộc tính
            </Button>
        </div>
        
        <div className="space-y-3">
            {attrsFA.fields.map((field, idx) => {
                const selectedAttrId = watch(`attributes.${idx}.attributeId`);
                const selectedAttrInfo = attrAll.find(a => Number(a.attributeId) === Number(selectedAttrId));
                const dataType = selectedAttrInfo?.dataType;
                const unit = selectedAttrInfo?.unit;

                return (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-card bg-transparent border border-neo-bevel items-end hover:bg-foreground/5 transition-all duration-200">
                        <div className="md:col-span-5 space-y-1.5">
                            <label className="text-[10px] text-muted uppercase font-bold">Tên thuộc tính</label>
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
                                        menuPortalTarget={document.body}
                                        placeholder="Chọn..."
                                    />
                                )}
                            />
                            <FieldError message={(errors.attributes as any)?.[idx]?.attributeId?.message} />
                        </div>
                        <div className="md:col-span-6 space-y-1.5">
                            <label className="text-[10px] text-muted uppercase font-bold">
                                Giá trị {unit ? `(${unit})` : ""}
                            </label>
                            {dataType === 1 ? (
                                <Input 
                                    type="number" 
                                    {...register(`attributes.${idx}.valueNumber`, { valueAsNumber: true })} 
                                    placeholder="Nhập số..." 
                                    className="h-[36px] bg-background border-transparent focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-sm" 
                                />
                            ) : dataType === 2 ? (
                                <div className="flex items-center h-[36px]">
                                    <label className="text-xs text-foreground flex items-center gap-2 cursor-pointer select-none bg-background border border-foreground/5 hover:bg-foreground/10 px-3 h-full rounded w-full transition-colors">
                                        <Checkbox {...register(`attributes.${idx}.valueBool`)} />
                                        Đồng ý / Kích hoạt
                                    </label>
                                </div>
                            ) : (
                                <Input 
                                    type={dataType === 3 ? "date" : "text"}
                                    {...register(`attributes.${idx}.valueText`)} 
                                    placeholder="Nhập giá trị..." 
                                    className="h-[36px] bg-background border-transparent focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-sm" 
                                />
                            )}
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                            <Button type="button" variant="ghost" onClick={() => attrsFA.remove(idx)} className="h-[36px] w-[36px] p-0 text-muted hover:text-destructive hover:bg-destructive/10 rounded-button">
                                <TrashIcon className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                );
            })}
            {attrsFA.fields.length === 0 && (
                <div className="text-center py-12 text-muted italic border border-neo-bevel rounded-card bg-transparent">
                    <TagIcon className="w-10 h-10 mx-auto mb-2 opacity-30"/>
                    Chưa có thông số nào
                </div>
            )}
        </div>
    </div>
  );
}

