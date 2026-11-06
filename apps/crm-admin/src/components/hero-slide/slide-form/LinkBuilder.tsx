import { useState, useEffect, useMemo } from "react";
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@my-project/ui";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { HeroSlideFormData } from "@my-project/api";
import { useCategoryOptions } from "@hooks/useCategory";
import { useCollections } from "@hooks/useCollection";
import { usePromotions } from "@hooks/usePromotion";

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
      } else if (actionUrl.startsWith("/catalog?collectionSlug=")) {
        setLinkType("collection");
        setSelectedValue(actionUrl.split("=")[1] || "");
      } else if (actionUrl.startsWith("/catalog?promotionId=")) {
        setLinkType("promotion");
        setSelectedValue(actionUrl.split("=")[1] || "");
      } else if (actionUrl.startsWith("/product/")) {
        setLinkType("product");
        setSelectedValue(actionUrl.replace("/product/", ""));
      } else {
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
      return categoryOptions.map((o) => ({
        id: o.value,
        name: o.label,
        slug: o.value,
      }));
    }
    if (linkType === "collection") {
      return collections.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      }));
    }
    if (linkType === "promotion") {
      return promotions.map((p: any) => ({
        id: p.promotionId,
        name: p.name,
        slug: p.promotionId,
      }));
    }
    return [];
  }, [linkType, categoryOptions, collections, promotions]);

  const onTypeSelect = (val: string) => {
    const nextType = val as LinkType;
    setLinkType(nextType);
    setSelectedValue("");
    if (nextType !== "custom") {
      setValue("actionUrl", "");
    }
  };

  const onValueSelect = (val: string) => {
    setSelectedValue(val);

    let newUrl = val;
    let selectedText = "";

    if (linkType === "category") {
      newUrl = `/catalog?categoryId=${val}`;
      selectedText = options.find((o) => String(o.id) === val)?.name || "";
    } else if (linkType === "collection") {
      newUrl = `/catalog?collectionSlug=${val}`;
      selectedText = options.find((o) => String(o.slug) === val)?.name || "";
    } else if (linkType === "promotion") {
      newUrl = `/catalog?promotionId=${val}`;
      selectedText = options.find((o) => String(o.id) === val)?.name || "";
    } else if (linkType === "product") {
      newUrl = `/product/${val}`;
    }

    selectedText = selectedText.replace(/^[—\s]+/, "");
    setValue("actionUrl", newUrl, { shouldValidate: true });

    const currentTitle = watch("titleText");
    if (!currentTitle && selectedText) {
      setValue("titleText", selectedText, { shouldValidate: true });
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedValue(val);

    let newUrl = val;
    let selectedText = "";

    if (linkType === "category") {
      newUrl = `/catalog?categoryId=${val}`;
      selectedText = options.find((o) => String(o.id) === val)?.name || "";
    } else if (linkType === "collection") {
      newUrl = `/catalog?collectionSlug=${val}`;
      selectedText = options.find((o) => String(o.slug) === val)?.name || "";
    } else if (linkType === "promotion") {
      newUrl = `/catalog?promotionId=${val}`;
      selectedText = options.find((o) => String(o.id) === val)?.name || "";
    } else if (linkType === "product") {
      newUrl = `/product/${val}`;
    }

    selectedText = selectedText.replace(/^[—\s]+/, "");
    setValue("actionUrl", newUrl, { shouldValidate: true });

    const currentTitle = watch("titleText");
    if (!currentTitle && selectedText) {
      setValue("titleText", selectedText, { shouldValidate: true });
    }
  };

  const isLoading = (linkType === "category" && isLoadingCats) || (linkType === "collection" && isLoadingCols);

  return (
    <div className="space-y-4">
      <div className="border-b border-border/60 pb-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider font-display text-foreground">
          Điều Hướng Liên Kết (Link Builder)
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Loại liên kết (Target Type)</Label>
          <Select value={linkType} onValueChange={onTypeSelect}>
            <SelectTrigger className="h-8 text-xs bg-surface border-border/60 rounded-[2px]">
              <SelectValue placeholder="Chọn loại liên kết" />
            </SelectTrigger>
            <SelectContent className="rounded-[2px] border-border/60">
              <SelectItem value="category">Danh Mục (Category)</SelectItem>
              <SelectItem value="collection">Bộ Sưu Tập (Collection)</SelectItem>
              <SelectItem value="promotion">Khuyến Mãi (Promotion)</SelectItem>
              <SelectItem value="product">Sản Phẩm Cụ Thể (Product)</SelectItem>
              <SelectItem value="custom">Tuỳ chỉnh (Custom URL)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Giá trị liên kết (Target Value)</Label>
          {linkType === "custom" ? (
            <Input
              value={selectedValue}
              onChange={handleValueChange}
              placeholder="VD: /pages/about-us"
              className="h-8 text-xs bg-surface border-border/60 rounded-[2px]"
            />
          ) : linkType === "product" ? (
            <Input
              value={selectedValue}
              onChange={handleValueChange}
              placeholder="Nhập Slug sản phẩm (VD: ao-thun-cotton-oversized)"
              className="h-8 text-xs bg-surface border-border/60 rounded-[2px]"
            />
          ) : (
            <Select value={selectedValue} onValueChange={onValueSelect} disabled={isLoading}>
              <SelectTrigger className="h-8 text-xs bg-surface border-border/60 rounded-[2px]">
                <SelectValue placeholder={isLoading ? "Đang tải dữ liệu..." : "Chọn một giá trị..."} />
              </SelectTrigger>
              <SelectContent className="rounded-[2px] border-border/60">
                {options.map((opt) => {
                  const val = String(linkType === "collection" ? opt.slug : opt.id);
                  return (
                    <SelectItem key={opt.id} value={val}>
                      {opt.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-2 font-mono flex items-center gap-1">
        <span className="text-muted-foreground">URL Sinh ra:</span>
        <span className="text-foreground font-semibold bg-surface px-2 py-0.5 rounded-[2px] border border-border/60">
          {actionUrl || "Chưa có"}
        </span>
      </div>
    </div>
  );
}
