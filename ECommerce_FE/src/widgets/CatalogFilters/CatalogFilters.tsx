import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@shared/ui/Button";
import { Input } from "@shared/ui/Input";
import { Label } from "@shared/ui/Label";
import { Select } from "@shared/ui/Select";

type Option = { label: string; value: string | number };

type Props = {
  brandOptions?: Option[];
  categoryOptions?: Option[];
};

function useDebounce<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default function CatalogFilters({ brandOptions = [], categoryOptions = [] }: Props) {
  const [sp, setSp] = useSearchParams();

  const [q, setQ] = useState(sp.get("keyword") ?? "");
  const [brandId, setBrandId] = useState(sp.get("brandId") ?? "");
  const [categoryId, setCategoryId] = useState(sp.get("categoryId") ?? "");
  const [priceMin, setPriceMin] = useState(sp.get("priceMin") ?? "");
  const [priceMax, setPriceMax] = useState(sp.get("priceMax") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "");

  const debouncedQ = useDebounce(q);

  // push debounced keyword
  useEffect(() => {
    const next = new URLSearchParams(sp);
    if (debouncedQ) next.set("keyword", debouncedQ);
    else next.delete("keyword");
    next.set("page", "1"); // reset page on filter change
    setSp(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const onApply = () => {
    const next = new URLSearchParams(sp);
    const patch = (k: string, v?: string) => {
      if (v && v !== "") next.set(k, v);
      else next.delete(k);
    };
    patch("brandId", brandId);
    patch("categoryId", categoryId);
    patch("priceMin", priceMin);
    patch("priceMax", priceMax);
    patch("sort", sort);
    next.set("page", "1");
    setSp(next);
  };

  const onClear = () => {
    const next = new URLSearchParams(sp);
    ["brandId", "categoryId", "priceMin", "priceMax", "sort", "keyword", "page"].forEach((k) =>
      next.delete(k)
    );
    setQ("");
    setBrandId("");
    setCategoryId("");
    setPriceMin("");
    setPriceMax("");
    setSort("");
    setSp(next);
  };

  const sortOptions = useMemo(
    () => [
      { label: "Phổ biến", value: "" },
      { label: "Giá tăng dần", value: "price_asc" },
      { label: "Giá giảm dần", value: "price_desc" },
      { label: "Mới nhất", value: "created_desc" },
      { label: "Cũ hơn", value: "created_asc" },
    ],
    []
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3 md:p-4 shadow-sm space-y-3">
      <div>
        <Label htmlFor="keyword">Từ khóa</Label>
        <Input
          id="keyword"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm sản phẩm..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Thương hiệu</Label>
          <Select
            value={brandId}
            onValueChange={setBrandId}
            placeholder="Chọn thương hiệu"
            options={brandOptions}
            />
        </div>
        <div>
          <Label>Danh mục</Label>
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
            placeholder="Chọn danh mục"
            options={categoryOptions}
            />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Giá tối thiểu (VND)</Label>
          <Input
            type="number"
            min={0}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Giá tối đa (VND)</Label>
          <Input
            type="number"
            min={0}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="10000000"
          />
        </div>
      </div>

      <div>
        <Label>Sắp xếp</Label>
        <Select value={sort} onValueChange={setSort} placeholder="Mặc định" options={sortOptions} />
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={onApply} className="rounded-xl px-4 py-2">Áp dụng</Button>
        <Button onClick={onClear} variant="outline" className="rounded-xl px-4 py-2">
          Xóa lọc
        </Button>
      </div>
    </div>
  );
}
