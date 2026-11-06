import { useState } from "react";
import ReactSelect from "react-select";
import { reactSelectDarkStyles, Button, Input } from "@my-project/ui";
import { TableCellsIcon, TrashIcon } from "@heroicons/react/24/outline";

const compactSelectStyles = {
  ...reactSelectDarkStyles,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: (base: any, state: any) => ({
    ...reactSelectDarkStyles.control!(base, state),
    minHeight: "32px",
    height: "32px",
    fontSize: "0.75rem",
    backgroundColor: "hsl(var(--card))",
    borderColor: state.isFocused ? "hsl(var(--foreground))" : "hsl(var(--border) / 0.6)",
    borderRadius: "2px",
    boxShadow: "none",
  }),
};

interface Props {
  variantOptions: Array<{ value: number; label: string }>;
  productSlug: string;
  onGenerate: (skus: Array<{ skuCode: string; priceMinor: number; isActive: boolean; options: Array<{ attributeId: number; value: string }> }>) => void;
  toast: any;
  attrAll: any[];
}

export function SkuMatrixGenerator({ variantOptions, productSlug, onGenerate, toast, attrAll }: Props) {
  const [matrixVariants, setMatrixVariants] = useState<Array<{ attributeId: number; valuesText: string }>>([
    { attributeId: 0, valuesText: "" },
  ]);

  const handleGenerate = () => {
    const picked = matrixVariants
      .filter((x) => x.attributeId && x.valuesText?.trim())
      .map((x) => ({
        attributeId: Number(x.attributeId),
        attributeName: attrAll.find((a) => a.attributeId === Number(x.attributeId))?.name ?? `#${x.attributeId}`,
        values: Array.from(new Set(x.valuesText.split(",").map((v) => v.trim()).filter(Boolean))),
      }))
      .filter((x) => x.values.length > 0);

    if (picked.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 thuộc tính và nhập giá trị.");
      return;
    }

    const result: any[] = [];
    const recur = (idx: number, cur: any[]) => {
      if (idx === picked.length) {
        const vals = cur.map((c) => c.value);
        const code = `${productSlug.toUpperCase()}-${vals.map((v) => v.toUpperCase().replace(/\s+/g, "")).join("-")}`;

        result.push({
          skuCode: code,
          priceMinor: 0,
          isActive: true,
          options: cur.map((c) => ({ attributeId: c.attributeId, value: c.value })),
        });
        return;
      }
      for (const val of picked[idx].values) {
        recur(idx + 1, [...cur, { attributeId: picked[idx].attributeId, value: val }]);
      }
    };
    recur(0, []);

    if (result.length > 0) {
      onGenerate(result);
      setMatrixVariants([{ attributeId: 0, valuesText: "" }]);
    }
  };

  return (
    <div className="bg-surface/50 border border-border/60 p-4 rounded-[2px] mb-4 space-y-3 animate-in slide-in-from-top-3 duration-200">
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <h4 className="text-xs font-medium font-sans text-foreground uppercase tracking-[0.16em]">
          Trình tạo ma trận biến thể
        </h4>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setMatrixVariants((prev) => [...prev, { attributeId: 0, valuesText: "" }])}
          className="text-xs text-accent hover:bg-accent/10 px-2 py-1 h-7"
        >
          + Thêm thuộc tính
        </Button>
      </div>

      <div className="space-y-3">
        {matrixVariants.map((item, mIdx) => (
          <div key={mIdx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-4">
              <ReactSelect
                value={variantOptions.find((opt) => Number(opt.value) === item.attributeId)}
                onChange={(val: any) => {
                  const updated = [...matrixVariants];
                  updated[mIdx].attributeId = Number(val?.value || 0);
                  setMatrixVariants(updated);
                }}
                options={variantOptions}
                styles={compactSelectStyles}
                placeholder="Chọn thuộc tính..."
              />
            </div>
            <div className="md:col-span-7">
              <Input
                value={item.valuesText}
                onChange={(e) => {
                  const updated = [...matrixVariants];
                  updated[mIdx].valuesText = e.target.value;
                  setMatrixVariants(updated);
                }}
                placeholder="Nhập các giá trị phân tách bằng dấu phẩy (VD: Đỏ, Xanh, Vàng)"
                className="bg-card text-xs h-8 border-border/60"
              />
            </div>
            <div className="md:col-span-1 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMatrixVariants((prev) => prev.filter((_, i) => i !== mIdx))}
                disabled={matrixVariants.length <= 1}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-error hover:bg-error/10 rounded-[2px]"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={handleGenerate}
          className="text-xs h-8 px-4"
        >
          Sinh mã & Thêm SKU
        </Button>
      </div>
    </div>
  );
}

