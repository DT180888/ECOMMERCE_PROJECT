import { useState, useEffect, useMemo } from "react";
import { Input, Label } from "@my-project/ui";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { HeroSlideFormData } from "@entities/hero-slide/types";
import { useCategoryOptions } from "@entities/category/hooks";
import { useCollections } from "@entities/collection/hooks";
import { usePromotions } from "@entities/promotion/hooks";

interface LinkBuilderProps {
  setValue: UseFormSetValue<HeroSlideFormData>;
  watch: UseFormWatch<HeroSlideFormData>;
}

type LinkType = "category" | "collection" | "promotion" | "product" | "custom";

interface SimpleItem {
  id: string | number;
  name: string;
  slug: string | number;
}

export function LinkBuilder({ setValue, watch }: LinkBuilderProps) {
  const [linkType, setLinkType] = useState<LinkType>("custom");
  const [selectedValue, setSelectedValue] = useState<string>("");

  const actionUrl = watch("actionUrl");

  // Determine initial linkType based on actionUrl
  useEffect(() => {
    if (actionUrl) {
      if (actionUrl.startsWith("/catalog?categoryId=")) {
        setLinkType("category");
        setSelectedValue(actionUrl.split("=")[1] || "");
      }
      else if (actionUrl.startsWith("/catalog?collectionSlug=")) {
        setLinkType("collection");
        setSelectedValue(actionUrl.split("=")[1] || "");
      }
      else if (actionUrl.startsWith("/catalog?promotionId=")) {
        setLinkType("promotion");
        setSelectedValue(actionUrl.split("=")[1] || "");
      }
      else if (actionUrl.startsWith("/product/")) {
        setLinkType("product");
        setSelectedValue(actionUrl.replace("/product/", ""));
      }
      else {
        setLinkType("custom");
        setSelectedValue(actionUrl);
      }
    }
  }, []);

  const { options: categoryOptions, isLoading: isLoadingCats } = useCategoryOptions();
  const { data: collectionsData, isLoading: isLoadingCols } = useCollections({ page: 1, size: 100 });
  const { data: promotionsData, isLoading: isLoadingProms } = usePromotions(1, 100);
  
  const collections = collectionsData?.items || [];
  const promotions = promotionsData?.items || [];

  const options = useMemo<SimpleItem[]>(() => {
    if (linkType === "category") {
      return categoryOptions.map(o => ({
        id: o.value,
        name: o.label,
        slug: o.value
      }));
    }
    if (linkType === "collection") {
      return collections.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug
      }));
    }
    if (linkType === "promotion") {
      return promotions.map(p => ({
        id: p.promotionId,
        name: p.name,
        slug: p.promotionId
      }));
    }
    return [];
  }, [linkType, categoryOptions, collections, promotions]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLinkType(e.target.value as LinkType);
    setSelectedValue("");
    if (e.target.value !== "custom") {
      setValue("actionUrl", ""); // Clear it to force user to select a new one
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedValue(val);

    let newUrl = val;
    let selectedText = "";

    if (linkType === "category") {
      newUrl = `/catalog?categoryId=${val}`;
      selectedText = options.find(o => String(o.id) === val)?.name || "";
    } else if (linkType === "collection") {
      newUrl = `/catalog?collectionSlug=${val}`;
      selectedText = options.find(o => String(o.slug) === val)?.name || "";
    } else if (linkType === "promotion") {
      newUrl = `/catalog?promotionId=${val}`;
      selectedText = options.find(o => String(o.id) === val)?.name || "";
    } else if (linkType === "product") {
      newUrl = `/product/${val}`; // Assuming val is slug
    }

    // Clean up prefix "— " from category names if present
    selectedText = selectedText.replace(/^[—\s]+/, "");

    setValue("actionUrl", newUrl, { shouldValidate: true });

    // Auto-fill TitleText if empty
    const currentTitle = watch("titleText");
    if (!currentTitle && selectedText) {
      setValue("titleText", selectedText, { shouldValidate: true });
    }
  };

  const isLoading = (linkType === "category" && isLoadingCats) || (linkType === "collection" && isLoadingCols);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Liên Kết (Link Builder)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Loại liên kết (Target Type)</Label>
          <select 
            value={linkType} 
            onChange={handleTypeChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="category">Danh Mục (Category)</option>
            <option value="collection">Bộ Sưu Tập (Collection)</option>
            <option value="promotion">Khuyến Mãi (Promotion)</option>
            <option value="product">Sản Phẩm Cụ Thể (Product)</option>
            <option value="custom">Tuỳ chỉnh (Custom URL)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Giá trị liên kết (Target Value)</Label>
          {linkType === "custom" ? (
            <Input 
              value={selectedValue} 
              onChange={handleValueChange} 
              placeholder="VD: /pages/about-us" 
            />
          ) : linkType === "product" ? (
             <Input 
              value={selectedValue} 
              onChange={handleValueChange} 
              placeholder="Nhập Slug sản phẩm (VD: ao-thun-polo)" 
            />
          ) : (
            <select
              value={selectedValue}
              onChange={handleValueChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="" disabled>
                {isLoading ? "-- Đang tải... --" : "-- Chọn một giá trị --"}
              </option>
              {options.map((opt) => {
                const val = linkType === 'collection' ? opt.slug : opt.id;
                return <option key={opt.id} value={val}>{opt.name}</option>;
              })}
            </select>
          )}
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        <strong>URL Sinh ra:</strong> <span className="text-primary">{actionUrl || "Chưa có"}</span>
      </div>
    </div>
  );
}

