import { useState, useEffect } from "react";
import { CreatePromotionReq } from "@my-project/api";
import { useCategoryOptions } from "@hooks/useCategory";
import { Input, Button, Label, Switch, Tabs, TabsList, TabsTrigger, reactSelectDarkStyles } from "@my-project/ui";
import { TagIcon, Squares2X2Icon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import ReactSelect from "react-select";

interface PromotionSharedFormProps {
  initialData?: CreatePromotionReq & { startsAtStr?: string; endsAtStr?: string };
  onSave: (payload: CreatePromotionReq & { startsAtStr?: string; endsAtStr?: string }) => Promise<void>;
  loading: boolean;
  submitLabel?: string;
  readOnly?: boolean;
  isDrawer?: boolean;
  formId?: string;
}

export function PromotionSharedForm({
  initialData,
  onSave,
  loading,
  submitLabel = "Lưu Khuyến Mãi",
  readOnly = false,
  isDrawer = false,
  formId = "promotion-shared-form",
}: PromotionSharedFormProps) {
  const { options: categoryOptions, isLoading: isCategoryLoading } = useCategoryOptions();

  const [form, setForm] = useState<CreatePromotionReq>({
    name: "",
    code: "",
    type: 0,
    value: 0,
    isActive: true,
    scope: 0,
    minOrderAmount: null,
    maxDiscountAmount: null,
    categoryIds: [],
    productIds: [],
  });

  const [startsAtStr, setStartsAtStr] = useState<string>("");
  const [endsAtStr, setEndsAtStr] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        code: initialData.code ?? "",
        type: initialData.type,
        value: initialData.value,
        isActive: initialData.isActive,
        maxRedemptions: initialData.maxRedemptions,
        scope: initialData.scope,
        minOrderAmount: initialData.minOrderAmount,
        maxDiscountAmount: initialData.maxDiscountAmount,
        categoryIds: initialData.categoryIds ?? [],
        productIds: initialData.productIds ?? [],
      });
      if (initialData.startsAtStr) setStartsAtStr(initialData.startsAtStr);
      if (initialData.endsAtStr) setEndsAtStr(initialData.endsAtStr);
    }
  }, [initialData]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave({ ...form, startsAtStr, endsAtStr });
  };

  const selectedCategoryItems = form.categoryIds
    ?.map((id) => categoryOptions.find((opt) => opt.value === id))
    .filter(Boolean) as any[];

  // Sub-sections flat on Canvas with pure spacing
  const basicInfoSection = (
    <section className="flex flex-col gap-3 md:gap-4">
      <div>
        <h3 className="text-xs font-medium font-display uppercase tracking-[0.16em] text-foreground">
          Thông tin cơ bản
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
        <div className="sm:col-span-2 flex flex-col gap-1">
          <Label className="text-xs font-medium text-foreground">
            Tên chương trình <span className="text-destructive">*</span>
          </Label>
          <Input
            required
            disabled={readOnly}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-8 text-xs rounded-[2px] border-border/60 focus:border-foreground"
            placeholder="VD: Siêu Sale Mùa Hè 2026"
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1">
          <Label className="text-xs font-medium text-foreground">Mã Voucher (Code)</Label>
          <Input
            disabled={readOnly}
            value={form.code ?? ""}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="h-8 text-xs rounded-[2px] border-border/60 focus:border-foreground font-mono tracking-wider uppercase"
            placeholder="SUMMER2026"
          />
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Bỏ trống nếu đây là chương trình tự động áp dụng (Flash Sale) toàn hệ thống.
          </p>
        </div>
      </div>
    </section>
  );

  const discountConfigSection = (
    <section className="flex flex-col gap-3 md:gap-4">
      <div>
        <h3 className="text-xs font-medium font-display uppercase tracking-[0.16em] text-foreground">
          Cấu hình giảm giá
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <Label className="text-xs font-medium text-foreground">Loại giảm giá</Label>
          <Tabs
            value={form.type.toString()}
            onValueChange={(v) => setForm({ ...form, type: Number(v) })}
            className="w-full sm:max-w-xs"
          >
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger
                value="0"
                className={readOnly ? "pointer-events-none opacity-60" : ""}
              >
                Phần trăm (%)
              </TabsTrigger>
              <TabsTrigger
                value="1"
                className={readOnly ? "pointer-events-none opacity-60" : ""}
              >
                Tiền mặt (VNĐ)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-foreground">
            Giá trị giảm <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              type="number"
              required
              disabled={readOnly}
              min={0}
              value={form.value || ""}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              className="h-8 text-xs rounded-[2px] border-border/60 pr-12 font-mono focus:border-foreground"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">
              {form.type === 0 ? "%" : "VNĐ"}
            </div>
          </div>
        </div>

        {form.type === 0 && (
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium text-foreground">Mức giảm tối đa</Label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                disabled={readOnly}
                value={form.maxDiscountAmount === null ? "" : form.maxDiscountAmount}
                onChange={(e) =>
                  setForm({ ...form, maxDiscountAmount: e.target.value === "" ? null : Number(e.target.value) })
                }
                className="h-8 text-xs rounded-[2px] border-border/60 pr-12 font-mono focus:border-foreground"
                placeholder="Không giới hạn"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">
                VNĐ
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );

  const scopeAndRulesSection = (
    <section className="flex flex-col gap-3 md:gap-4">
      <div>
        <h3 className="text-xs font-medium font-display uppercase tracking-[0.16em] text-foreground">
          Điều kiện & Phạm vi
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium text-foreground">Phạm vi áp dụng</Label>
          <Tabs
            value={(form.scope ?? 0).toString()}
            onValueChange={(v) => setForm({ ...form, scope: Number(v) })}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3">
              <TabsTrigger
                value="0"
                icon={<TagIcon className="w-3.5 h-3.5" />}
                className={readOnly ? "pointer-events-none opacity-60" : ""}
              >
                Toàn hệ thống
              </TabsTrigger>
              <TabsTrigger
                value="1"
                icon={<Squares2X2Icon className="w-3.5 h-3.5" />}
                className={readOnly ? "pointer-events-none opacity-60" : ""}
              >
                Theo danh mục
              </TabsTrigger>
              <TabsTrigger
                value="2"
                icon={<ShoppingBagIcon className="w-3.5 h-3.5" />}
                className={readOnly ? "pointer-events-none opacity-60" : ""}
              >
                Nhóm sản phẩm
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {form.scope === 1 && (
          <div className="sm:col-span-2 space-y-2 p-3 bg-surface/30 rounded-[2px]">
            <Label className="text-foreground text-xs font-medium">Danh mục áp dụng</Label>
            <ReactSelect
              isMulti={true as any}
              options={categoryOptions}
              isLoading={isCategoryLoading}
              isDisabled={readOnly || isCategoryLoading}
              value={selectedCategoryItems}
              onChange={(selected: any) => {
                const ids = selected ? selected.map((s: any) => s.value) : [];
                setForm({ ...form, categoryIds: ids });
              }}
              placeholder="Chọn các danh mục..."
              styles={reactSelectDarkStyles}
              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            />
          </div>
        )}

        {form.scope === 2 && (
          <div className="sm:col-span-2 space-y-2 p-3 bg-surface/30 rounded-[2px]">
            <Label className="text-foreground text-xs font-medium">Sản phẩm áp dụng (ID)</Label>
            <Input
              value={form.productIds?.join(", ")}
              disabled={readOnly}
              onChange={(e) => {
                const ids = e.target.value
                  .split(",")
                  .map((s) => Number(s.trim()))
                  .filter((n) => !isNaN(n) && n > 0);
                setForm({ ...form, productIds: ids });
              }}
              className="h-8 text-xs rounded-[2px] border-border/60 font-mono focus:border-foreground"
              placeholder="VD: 101, 102, 103"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Đơn tối thiểu (VNĐ)</Label>
          <Input
            type="number"
            min={0}
            disabled={readOnly}
            value={form.minOrderAmount === null ? "" : form.minOrderAmount}
            onChange={(e) =>
              setForm({ ...form, minOrderAmount: e.target.value === "" ? null : Number(e.target.value) })
            }
            className="h-8 text-xs rounded-[2px] border-border/60 font-mono focus:border-foreground"
            placeholder="0"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Lượt dùng tối đa</Label>
          <Input
            type="number"
            min={0}
            disabled={readOnly}
            value={form.maxRedemptions ?? ""}
            onChange={(e) =>
              setForm({ ...form, maxRedemptions: e.target.value === "" ? undefined : Number(e.target.value) })
            }
            className="h-8 text-xs rounded-[2px] border-border/60 font-mono focus:border-foreground"
            placeholder="∞"
          />
        </div>
      </div>
    </section>
  );

  const statusAndDurationSection = (
    <div className="flex flex-col gap-6">
      {/* Trạng thái */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium font-display uppercase tracking-[0.16em] text-foreground">
            Trạng thái kích hoạt
          </Label>
          <Switch
            disabled={readOnly}
            checked={!!form.isActive}
            onCheckedChange={(checked: boolean) => setForm({ ...form, isActive: checked })}
          />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {form.isActive
            ? "Khuyến mãi đang BẬT. Khách hàng có thể nhìn thấy và áp dụng ưu đãi này."
            : "Khuyến mãi đang TẮT. Chỉ có quản trị viên mới thấy bản ghi này."}
        </p>
      </div>

      {/* Thời gian */}
      <div className="flex flex-col gap-3">
        <div>
          <Label className="text-xs font-medium font-display uppercase tracking-[0.16em] text-foreground">
            Thời hạn áp dụng
          </Label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-foreground font-medium">Bắt đầu lúc</Label>
            <Input
              type="datetime-local"
              disabled={readOnly}
              value={startsAtStr}
              onChange={(e) => setStartsAtStr(e.target.value)}
              className="h-8 text-xs rounded-[2px] border-border/60 focus:border-foreground font-mono"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-foreground font-medium">Kết thúc lúc</Label>
            <Input
              type="datetime-local"
              disabled={readOnly}
              value={endsAtStr}
              onChange={(e) => setEndsAtStr(e.target.value)}
              className="h-8 text-xs rounded-[2px] border-border/60 focus:border-foreground font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // 1. DRAWER MODE: Clean vertical flow flat on canvas
  if (isDrawer) {
    return (
      <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          {basicInfoSection}
          {discountConfigSection}
          {scopeAndRulesSection}
        </div>

        {statusAndDurationSection}
      </form>
    );
  }

  // 2. FULL PAGE MODE: Two-Column Studio Monolith Layout flat on Canvas
  return (
    <>
      <form
        id={formId}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start"
      >
        {/* Left Column (8 cols): Main Information */}
        <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8 order-2 lg:order-1">
          {basicInfoSection}
          {discountConfigSection}
          {scopeAndRulesSection}
        </div>

        {/* Right Column (4 cols): Settings & Desktop Action */}
        <div className="lg:col-span-4 flex flex-col gap-6 order-1 lg:order-2 shrink-0">
          {statusAndDurationSection}

          {!readOnly && (
            <div className="hidden lg:flex flex-col gap-2 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-9 text-xs font-semibold tracking-wider uppercase rounded-[2px] shadow-none"
              >
                {loading ? "Đang xử lý..." : submitLabel}
              </Button>
            </div>
          )}
        </div>
      </form>

      {/* Mobile Sticky Bottom Bar */}
      {!readOnly && (
        <div className="sticky bottom-0 z-40 p-3 mt-4 -mx-3 -mb-3 bg-background/95 backdrop-blur-md lg:hidden flex flex-col justify-center">
          <Button
            type="submit"
            form={formId}
            disabled={loading}
            className="w-full h-10 text-xs font-semibold uppercase tracking-wider rounded-[2px] shadow-none"
          >
            {loading ? "Đang xử lý..." : submitLabel}
          </Button>
        </div>
      )}
    </>
  );
}
