import { useState, useEffect } from "react";
import { CreatePromotionReq } from "@entities/promotion/api";
import { useCategoryOptions } from "@entities/category/hooks";
import { Input, Button, Label, Switch, Tabs, TabsList, TabsTrigger, reactSelectDarkStyles } from "@my-project/ui";
import { Tag, Layers, ShoppingBag } from "lucide-react";
import ReactSelect from "react-select";

interface PromotionSharedFormProps {
  initialData?: CreatePromotionReq & { startsAtStr?: string; endsAtStr?: string };
  onSave: (payload: CreatePromotionReq & { startsAtStr?: string; endsAtStr?: string }) => Promise<void>;
  loading: boolean;
  submitLabel?: string;
  readOnly?: boolean;
}

export function PromotionSharedForm({ initialData, onSave, loading, submitLabel = "Lưu Khuyến Mãi", readOnly = false }: PromotionSharedFormProps) {
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

  const handleSubmit = () => {
    onSave({ ...form, startsAtStr, endsAtStr });
  };

  const selectedCategoryItems = form.categoryIds
    ?.map(id => categoryOptions.find(opt => opt.value === id))
    .filter(Boolean) as any[];

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-start lg:items-stretch lg:h-full min-h-0">
      {/* CỘT TRÁI (Main Content) */}
      <div className="bg-card lg:col-span-8 p-4 sm:p-6 rounded-card   flex flex-col gap-6 order-2 lg:order-1 min-h-0 lg:overflow-y-auto custom-scrollbar shadow-sm">
          {/* Khối 1: Thông tin cơ bản */}
          <section className="flex flex-col gap-4">
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-foreground">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-0 bg-transparent">
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-muted-foreground text-xs font-semibold">Tên chương trình <span className="text-red-500">*</span></Label>
                <Input
                  required
                  disabled={readOnly}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="shadow-neo-inset   focus:border-accent"
                  placeholder="VD: Siêu Sale Tháng 6"
                />
              </div>
              
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-muted-foreground text-xs font-semibold">Mã Code</Label>
                <Input
                  disabled={readOnly}
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="shadow-neo-inset   focus:border-accent font-mono tracking-wider uppercase"
                  placeholder="SUMMER2024"
                />
                <p className="text-[11px] text-muted-foreground/80 mt-1">
                  Bỏ trống nếu đây là Flash Sale hoặc sinh mã hàng loạt.
                </p>
              </div>
            </div>
          </section>

          {/* Khối 2: Cấu hình giảm giá */}
          <section className="flex flex-col gap-4">
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-foreground">Cấu hình giảm giá</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-0 bg-transparent">
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-muted-foreground text-xs font-semibold">Loại giảm giá</Label>
                <Tabs value={form.type.toString()} onValueChange={(v) => setForm({ ...form, type: Number(v) })} className="w-full sm:max-w-xs">
                  <TabsList className="w-full grid grid-cols-2 bg-foreground/[0.02] border border-muted/10 p-1 h-10 rounded-button shadow-neo-inset">
                    <TabsTrigger value="0" className={`rounded-button text-xs py-1.5 ${readOnly ? "pointer-events-none opacity-60" : ""}`}>Phần trăm (%)</TabsTrigger>
                    <TabsTrigger value="1" className={`rounded-button text-xs py-1.5 ${readOnly ? "pointer-events-none opacity-60" : ""}`}>Tiền mặt (VNĐ)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs font-semibold">Giá trị giảm <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    type="number"
                    required
                    disabled={readOnly}
                    min={0}
                    value={form.value || ""}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                    className="shadow-neo-inset pr-12 font-mono text-base   focus:border-accent"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-xs">
                    {form.type === 0 ? "%" : "VNĐ"}
                  </div>
                </div>
              </div>

              {form.type === 0 && (
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-semibold">Mức giảm tối đa</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      disabled={readOnly}
                      value={form.maxDiscountAmount === null ? "" : form.maxDiscountAmount}
                      onChange={(e) =>
                        setForm({ ...form, maxDiscountAmount: e.target.value === "" ? null : Number(e.target.value) })
                      }
                      className="shadow-neo-inset pr-12 font-mono text-base   focus:border-accent"
                      placeholder="Không giới hạn"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-xs">VNĐ</div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Khối 3: Điều kiện & Phạm vi */}
          <section className="flex flex-col gap-4">
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-foreground">Điều kiện & Phạm vi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-0 bg-transparent">
              
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-muted-foreground text-xs font-semibold">Phạm vi áp dụng</Label>
                <Tabs value={form.scope.toString()} onValueChange={(v) => setForm({ ...form, scope: Number(v) })} className="w-full">
                  <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 bg-foreground/[0.02] border border-muted/10 p-1 h-10 rounded-button shadow-neo-inset gap-1">
                    <TabsTrigger value="0" className={`gap-2 rounded-button text-xs py-1.5 data-[state=active]:text-accent ${readOnly ? "pointer-events-none opacity-60" : ""}`}>
                      <Tag size={12} strokeWidth={2}/> Toàn hệ thống
                    </TabsTrigger>
                    <TabsTrigger value="1" className={`gap-2 rounded-button text-xs py-1.5 data-[state=active]:text-accent ${readOnly ? "pointer-events-none opacity-60" : ""}`}>
                      <Layers size={12} strokeWidth={2}/> Theo danh mục
                    </TabsTrigger>
                    <TabsTrigger value="2" className={`gap-2 rounded-button text-xs py-1.5 data-[state=active]:text-accent ${readOnly ? "pointer-events-none opacity-60" : ""}`}>
                      <ShoppingBag size={12} strokeWidth={2}/> Nhóm sản phẩm
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {form.scope === 1 && (
                <div className="md:col-span-2 space-y-2 p-4 bg-secondary/10 rounded-card  ">
                  <Label className="text-foreground text-xs font-semibold">Danh mục áp dụng</Label>
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
                    placeholder="Tìm kiếm danh mục..."
                    styles={reactSelectDarkStyles}
                    menuPortalTarget={document.body}
                  />
                </div>
              )}

              {form.scope === 2 && (
                <div className="md:col-span-2 space-y-2 p-4 bg-secondary/10 rounded-card  ">
                  <Label className="text-foreground text-xs font-semibold">Sản phẩm áp dụng (ID)</Label>
                  <Input
                    value={form.productIds?.join(", ")}
                    disabled={readOnly}
                    onChange={(e) => {
                      const ids = e.target.value.split(",").map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0);
                      setForm({ ...form, productIds: ids });
                    }}
                    className="shadow-neo-inset font-mono text-sm   focus:border-accent"
                    placeholder="VD: 101, 102, 103"
                  />
                </div>
              )}

              <div className="space-y-1.5 mt-2">
                <Label className="text-muted-foreground text-xs font-semibold">Đơn hàng tối thiểu (VNĐ)</Label>
                <Input
                  type="number"
                  min={0}
                  disabled={readOnly}
                  value={form.minOrderAmount === null ? "" : form.minOrderAmount}
                  onChange={(e) =>
                    setForm({ ...form, minOrderAmount: e.target.value === "" ? null : Number(e.target.value) })
                  }
                  className="shadow-neo-inset font-mono text-base   focus:border-accent"
                  placeholder="0"
                />
              </div>

              <div className="space-y-1.5 mt-2">
                <Label className="text-muted-foreground text-xs font-semibold">Lượt dùng tối đa</Label>
                <Input
                  type="number"
                  min={0}
                  disabled={readOnly}
                  value={form.maxRedemptions === undefined ? "" : form.maxRedemptions}
                  onChange={(e) =>
                    setForm({ ...form, maxRedemptions: e.target.value === "" ? undefined : Number(e.target.value) })
                  }
                  className="shadow-neo-inset font-mono text-base   focus:border-accent"
                  placeholder="∞"
                />
              </div>
              
            </div>
          </section>
      </div>

      {/* CỘT PHẢI (Sidebar Settings) */}
      <div className="lg:col-span-4 flex flex-col gap-4 order-1 lg:order-2 shrink-0">
        {/* Trạng thái */}
        <div className="p-4 sm:p-5 bg-card rounded-card   shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold font-display">Trạng thái hiển thị</Label>
            <Switch
              disabled={readOnly}
              checked={form.isActive}
              onCheckedChange={(checked: boolean) => setForm({ ...form, isActive: checked })}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {form.isActive 
              ? "Khuyến mãi đang được BẬT. Khách hàng có thể thấy và áp dụng mã nếu đủ điều kiện."
              : "Khuyến mãi đang TẮT. Chỉ có admin mới nhìn thấy chương trình này."}
          </div>
        </div>

        {/* Thời gian */}
        <div className="p-4 sm:p-5 bg-card rounded-card   shadow-sm flex flex-col gap-3">
          <Label className="text-sm font-bold font-display">Thời hạn áp dụng</Label>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-semibold">Bắt đầu lúc</Label>
              <Input
                type="datetime-local"
                disabled={readOnly}
                value={startsAtStr}
                onChange={(e) => setStartsAtStr(e.target.value)}
                className="shadow-neo-inset text-sm   focus:border-accent"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-semibold">Kết thúc lúc</Label>
              <Input
                type="datetime-local"
                disabled={readOnly}
                value={endsAtStr}
                onChange={(e) => setEndsAtStr(e.target.value)}
                className="shadow-neo-inset text-sm   focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Actions (Desktop) */}
        {!readOnly && (
        <div className="hidden lg:flex p-4 sm:p-5 bg-card rounded-card   shadow-sm flex-col gap-3">
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full h-11 text-sm font-bold tracking-wide shadow-none hover:shadow-sm"
          >
            {loading ? "Đang xử lý..." : submitLabel}
          </Button>
        </div>
        )}
      </div>
    </div>

    {/* Actions (Mobile Sticky Bottom Bar) */}
    {!readOnly && (
    <div className="sticky bottom-0 z-50 p-4 mt-4 -mx-3 -mb-3 bg-background/90 backdrop-blur-md border-t border-foreground/[0.05] shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.2)] lg:hidden flex flex-col justify-center">
      <Button 
        onClick={handleSubmit} 
        disabled={loading}
        className="w-full h-12 text-sm font-bold tracking-wide shadow-none hover:shadow-sm rounded-button bg-primary text-primary-foreground"
      >
        {loading ? "Đang xử lý..." : submitLabel}
      </Button>
    </div>
    )}
    </>
  );
}

