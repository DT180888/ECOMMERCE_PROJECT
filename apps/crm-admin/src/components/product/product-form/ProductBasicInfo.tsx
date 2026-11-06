import React, { useState, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import {
  Input,
  TextArea,
  Checkbox,
  Label,
  Switch,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  reactSelectDarkStyles,
  cn,
} from "@my-project/ui";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[11px] font-mono text-destructive mt-1">{message}</p>;
}

interface Props {
  brandOptions: Array<{ value: string | number; label: string }>;
  categoryOptions: Array<{ value: string | number; label: string }>;
  collectionOptions: Array<{ value: string | number; label: string }>;
}

export function ProductBasicInfo({ brandOptions, categoryOptions, collectionOptions }: Props) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<any>();
  const [catSearch, setCatSearch] = useState("");

  const filteredCategories = useMemo(() => {
    if (!catSearch.trim()) return categoryOptions;
    const q = catSearch.toLowerCase();
    return categoryOptions.filter((c) => c.label.toLowerCase().includes(q));
  }, [categoryOptions, catSearch]);

  const selectedCategoryIds = (watch("categoryIds") || []) as string[];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
      {/* ── Left Column (Col 1-8 / 70%): Product Core Identity ── */}
      <div className="lg:col-span-8 space-y-6 md:space-y-8">
        {/* Section 1: Định danh sản phẩm */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium font-sans uppercase tracking-[0.16em] text-foreground">
            Định danh sản phẩm
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">
                Tên sản phẩm <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("name")}
                placeholder="VD: Áo Thun Nam Cotton Signature"
                className="h-8 text-xs rounded-[2px] border-border/60 focus:border-foreground"
                error={!!errors.name}
              />
              <FieldError message={errors.name?.message as unknown as string} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">
                Đường dẫn liên kết (Slug) <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center bg-surface/40 border border-border/60 rounded-[2px] h-8 text-xs focus-within:border-foreground transition-colors overflow-hidden">
                <span className="px-2.5 h-full flex items-center font-mono text-[11px] text-muted-foreground border-r border-border/60 bg-surface select-none">
                  /product/
                </span>
                <Input
                  {...register("slug")}
                  className="bg-transparent border-0 focus:ring-0 focus:border-0 rounded-none text-foreground flex-1 px-2.5 placeholder:text-muted-foreground/40 font-mono text-xs h-full shadow-none"
                  placeholder="ao-thun-nam-signature"
                />
              </div>
              <FieldError message={errors.slug?.message as unknown as string} />
              <p className="text-[11px] text-muted-foreground">
                Đường dẫn cố định cho sản phẩm trên website bán hàng (tự động tạo từ tên sản phẩm).
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Mô tả chi tiết */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium font-sans uppercase tracking-[0.16em] text-foreground">
            Nội dung & Mô tả chi tiết
          </h3>
          <div className="space-y-2">
            <TextArea
              {...register("description")}
              rows={8}
              placeholder="Nhập mô tả chi tiết về sản phẩm, chất liệu, form dáng và hướng dẫn sử dụng/bảo quản..."
              className="text-xs leading-relaxed rounded-[2px] border-border/60 focus:border-foreground"
            />
          </div>
        </div>
      </div>

      {/* ── Right Column (Col 9-12 / 30%): Metadata & Classification ── */}
      <div className="lg:col-span-4 space-y-6 md:space-y-8 sticky top-16">
        {/* Trạng thái mở bán */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium font-sans uppercase tracking-[0.16em] text-foreground">
            Phân loại & Hiển thị
          </h3>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-foreground">Trạng thái mở bán</Label>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => {
                const isActive = Number(value) === 1;
                return (
                  <div className="flex flex-col gap-2 p-3 rounded-[2px] bg-surface/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">
                        {isActive ? "Đang mở bán (Active)" : "Tạm ẩn (Inactive)"}
                      </span>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => onChange(checked ? 1 : 0)}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      {isActive
                        ? "Sản phẩm được kích hoạt và xuất hiện trên toàn bộ danh mục bán hàng."
                        : "Sản phẩm đang được ẩn khỏi người dùng khách hàng."}
                    </p>
                  </div>
                );
              }}
            />
          </div>
        </div>

        {/* Thương hiệu */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-foreground">Thương hiệu</Label>
          <Controller
            control={control}
            name="brandId"
            render={({ field: { onChange, value } }) => (
              <Select
                value={value ? String(value) : "NONE"}
                onValueChange={(val) => onChange(val === "NONE" ? "" : val)}
              >
                <SelectTrigger className="h-8 text-xs bg-surface border-border/60 rounded-[2px]">
                  <SelectValue placeholder="-- Chọn thương hiệu --" />
                </SelectTrigger>
                <SelectContent className="rounded-[2px] border-border/60 max-h-56">
                  <SelectItem value="NONE">— Chưa gán thương hiệu —</SelectItem>
                  {brandOptions.map((b) => (
                    <SelectItem key={b.value} value={String(b.value)}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Danh mục */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-foreground">Danh mục sản phẩm</Label>
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
              {selectedCategoryIds.length} đã chọn
            </span>
          </div>

          {/* Micro search filter for categories */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
            <Input
              type="text"
              value={catSearch}
              onChange={(e) => setCatSearch(e.target.value)}
              placeholder="Lọc danh mục..."
              className="w-full h-8 pl-8 pr-2 text-xs bg-surface/50 border-border/60 rounded-[2px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground font-sans shadow-none"
            />
          </div>

          <div className="space-y-1 max-h-[200px] overflow-y-auto custom-scrollbar p-1">
            {filteredCategories.length === 0 ? (
              <p className="text-[11px] text-muted-foreground text-center py-4 italic">
                Không tìm thấy danh mục
              </p>
            ) : (
              filteredCategories.map((o) => {
                const val = String(o.value);
                const checked = selectedCategoryIds.includes(val);
                return (
                  <label
                    key={val}
                    className={cn(
                      "flex items-center gap-2 text-xs cursor-pointer px-2 py-1.5 rounded-[2px] transition-colors select-none",
                      checked
                        ? "bg-surface text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onChange={(e) => {
                        const cur = new Set(selectedCategoryIds);
                        if (e.target.checked) cur.add(val);
                        else cur.delete(val);
                        setValue("categoryIds", Array.from(cur), {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />
                    <span className="truncate">{o.label}</span>
                  </label>
                );
              })
            )}
          </div>
          <FieldError message={errors.categoryIds?.message as unknown as string} />
        </div>

        {/* Bộ sưu tập */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-foreground">Bộ sưu tập</Label>
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
                  onChange={(newVals: any) =>
                    onChange(newVals ? newVals.map((v: any) => v.value) : [])
                  }
                  options={collectionOptions}
                  styles={reactSelectDarkStyles}
                  menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                  placeholder="Chọn bộ sưu tập..."
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
