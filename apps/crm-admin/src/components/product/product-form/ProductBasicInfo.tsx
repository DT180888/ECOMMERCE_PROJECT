import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { Label, Input, TextArea, Checkbox, reactSelectDarkStyles } from "@my-project/ui";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-error mt-1 ml-1 flex items-center gap-1">⚠️ {message}</p>;
}

interface Props {
  brandOptions: Array<{ value: string | number; label: string }>;
  categoryOptions: Array<{ value: string | number; label: string }>;
  collectionOptions: Array<{ value: string | number; label: string }>;
}

export function ProductBasicInfo({ brandOptions, categoryOptions, collectionOptions }: Props) {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<any>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Main Info */}
      <div className="lg:col-span-2 space-y-6">
          <div className="bg-transparent border border-neo-bevel rounded-card p-5 space-y-4">
              <div className="space-y-2">
                  <Label className="text-foreground font-medium">Tên sản phẩm <span className="text-destructive">*</span></Label>
                  <Input {...register("name")} placeholder="VD: Áo thun nam Cotton" error={!!errors.name} />
                  <FieldError message={(errors.name?.message as unknown as string)} />
              </div>
              
              <div className="space-y-2">
                  <Label className="text-foreground font-medium">Đường dẫn (Slug) <span className="text-destructive">*</span></Label>
                  <div className="flex items-center bg-background border border-foreground/[0.04] dark:border-white/[0.05] rounded-button h-[40px] text-muted text-sm focus-within:border-accent transition-colors overflow-hidden">
                      <span className="pl-3 select-none text-muted border-r border-foreground/[0.04] dark:border-white/[0.05] pr-2 mr-2 bg-muted/20 h-full flex items-center">/product/</span>
                      <input {...register("slug")} className="bg-transparent outline-none text-accent flex-1 pr-3 placeholder-muted/50 font-mono text-sm" placeholder="ao-thun-nam" />
                  </div>
                  <FieldError message={(errors.slug?.message as unknown as string)} />
              </div>

              <div className="space-y-2">
                  <Label className="text-foreground font-medium">Mô tả chi tiết</Label>
                  <TextArea {...register("description")} rows={8} placeholder="Nhập mô tả sản phẩm..." className="text-sm leading-relaxed" />
              </div>
          </div>
      </div>

      {/* Right: Sidebar Info */}
      <div className="space-y-6">
          <div className="bg-transparent border border-neo-bevel rounded-card p-5 space-y-5 sticky top-0">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-foreground/[0.04] dark:border-white/[0.05] pb-2">Phân loại</h3>
              
              <div className="space-y-2">
                  <Label className="text-muted text-xs uppercase font-medium">Trạng thái</Label>
                  <Controller
                      control={control}
                      name="status"
                      render={({ field: { onChange, value, ref } }) => (
                          <ReactSelect
                              ref={ref}
                              value={[{ value: 1, label: "Active" }, { value: 0, label: "Inactive" }].find(o => o.value === Number(value))}
                              onChange={(val: any) => onChange(Number(val?.value))}
                              options={[{ value: 1, label: "Active" }, { value: 0, label: "Inactive" }]}
                              styles={reactSelectDarkStyles}
                              menuPortalTarget={document.body}
                          />
                      )}
                  />
              </div>

              <div className="space-y-2">
                  <Label className="text-muted text-xs uppercase font-medium">Thương hiệu</Label>
                  <Controller
                      control={control}
                      name="brandId"
                      render={({ field: { onChange, value, ref } }) => (
                          <ReactSelect
                              ref={ref}
                              value={brandOptions.find(o => String(o.value) === String(value))}
                              onChange={(val: any) => onChange(val?.value ? String(val.value) : "")}
                              options={brandOptions}
                              styles={reactSelectDarkStyles}
                              menuPortalTarget={document.body}
                              placeholder="-- Chọn --"
                              isClearable
                          />
                      )}
                  />
              </div>

              <div className="space-y-3 pt-2 border-t border-foreground/[0.04] dark:border-white/[0.05]">
                  <Label className="text-muted text-xs uppercase font-medium">Danh mục</Label>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                      {categoryOptions.map((o) => {
                          const val = String(o.value);
                          const checked = (watch("categoryIds") || []).includes(val);
                          return (
                              <label key={val} className={`flex items-center gap-3 text-sm cursor-pointer p-2 rounded-button border transition-all ${checked ? "bg-accent/10 border-accent/20 text-accent font-medium" : "bg-transparent border-transparent text-muted hover:bg-foreground/5"}`}>
                              <Checkbox
                                  checked={checked}
                                  onChange={(e) => {
                                      const cur = new Set(watch("categoryIds") || []);
                                      if (e.target.checked) cur.add(val);
                                      else cur.delete(val);
                                      setValue("categoryIds", Array.from(cur));
                                  }}
                              />
                              {o.label}
                              </label>
                          );
                      })}
                  </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-foreground/[0.04] dark:border-white/[0.05]">
                  <Label className="text-muted text-xs uppercase font-medium">Bộ sưu tập</Label>
                  <Controller
                      control={control}
                      name="collectionIds"
                      render={({ field: { onChange, value, ref } }) => {
                          const selectedItems = collectionOptions.filter((o) => (value || []).includes(o.value));
                          return (
                              <ReactSelect
                                  ref={ref}
                                  isMulti={true as any}
                                  value={selectedItems}
                                  onChange={(newVals: any) => onChange(newVals ? newVals.map((v: any) => v.value) : [])}
                                  options={collectionOptions}
                                  styles={reactSelectDarkStyles}
                                  menuPortalTarget={document.body}
                                  placeholder="Chọn các Bộ sưu tập..."
                              />
                          );
                      }}
                  />
              </div>
          </div>
      </div>
    </div>
  );
}

