import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Switch,
  Label,
} from "@my-project/ui";
import { useCreateCollection, useUpdateCollection } from "@hooks/useCollection";
import type { CollectionDto, CollectionFormData } from "@my-project/api";
import { useUploadTemp } from "@hooks/useUpload";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { SplitPaneInspector } from "@components/common/SplitPaneInspector";

interface CollectionDrawerFormProps {
  open: boolean;
  onClose: () => void;
  collection: CollectionDto | null;
}

export function CollectionDrawerForm({ open, onClose, collection }: CollectionDrawerFormProps) {
  const isCreate = collection === null;
  const [formData, setFormData] = useState<CollectionFormData>({
    name: "",
    slug: "",
    description: "",
    coverImageUrl: "",
    isActive: true,
  });

  const createMut = useCreateCollection();
  const updateMut = useUpdateCollection();
  const uploadMut = useUploadTemp();

  useEffect(() => {
    if (collection && open) {
      setFormData({
        name: collection.name,
        slug: collection.slug,
        description: collection.description || "",
        coverImageUrl: collection.coverImageUrl || "",
        isActive: collection.isActive,
      });
    } else if (open) {
      setFormData({
        name: "",
        slug: "",
        description: "",
        coverImageUrl: "",
        isActive: true,
      });
    }
  }, [collection, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (collection) {
      updateMut.mutate(
        { id: collection.id, payload: formData },
        { onSuccess: () => onClose() }
      );
    } else {
      createMut.mutate(formData, { onSuccess: () => onClose() });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMut.mutate([file], {
      onSuccess: (res) => {
        setFormData((prev) => ({ ...prev, coverImageUrl: res[0].url }));
      },
    });
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, coverImageUrl: "" }));
  };

  const isPending = createMut.isPending || updateMut.isPending || uploadMut.isPending;

  return (
    <SplitPaneInspector
      open={open}
      onClose={onClose}
      title={isCreate ? "Thêm Bộ Sưu Tập" : `Chỉnh Sửa Bộ Sưu Tập #${collection?.id}`}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
            fullWidthOnSm
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="collection-split-form"
            variant="default"
            isLoading={isPending}
            loadingText="Đang lưu..."
            fullWidthOnSm
          >
            {isCreate ? "Tạo bộ sưu tập" : "Lưu thay đổi"}
          </Button>
        </>
      }
    >
      <form id="collection-split-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Tên */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="col-name" className="text-xs font-medium text-foreground">
            Tên bộ sưu tập <span className="text-destructive">*</span>
          </Label>
          <Input
            id="col-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="h-8 text-xs rounded-[2px] border-border/60"
            placeholder="Ví dụ: Mùa hè sôi động"
            autoFocus
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="col-slug" className="text-xs font-medium text-foreground">
            Đường dẫn (Slug) <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center bg-surface/50 border border-border/60 rounded-[2px] h-8 text-muted-foreground text-xs overflow-hidden focus-within:border-foreground transition-colors">
            <span className="pl-2.5 select-none text-muted-foreground pr-2 bg-surface h-full flex items-center font-mono text-xs shrink-0">
              /collection/
            </span>
            <Input
              id="col-slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="border-0 focus:border-0 rounded-none h-full shadow-none bg-transparent outline-none text-foreground flex-1 pr-2.5 placeholder-muted-foreground/50 font-mono text-xs"
              placeholder="mua-he-soi-dong"
            />
          </div>
        </div>

        {/* Mô tả */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="col-desc" className="text-xs font-medium text-foreground">
            Mô tả ngắn
          </Label>
          <Input
            id="col-desc"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả bộ sưu tập..."
            className="h-8 text-xs rounded-[2px] border-border/60"
          />
        </div>

        {/* Ảnh bìa */}
        <div className="flex flex-col gap-1 pt-2 border-t border-border/60">
          <Label className="text-xs font-medium text-foreground">Ảnh bìa đại diện</Label>
          {formData.coverImageUrl ? (
            <div className="relative w-full h-40 rounded-[2px] overflow-hidden border border-border/60">
              <img src={formData.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeImage}
                className="absolute top-2 right-2 h-9 w-9 bg-background/80 hover:bg-background text-foreground rounded-[2px] border border-border/60"
                title="Xóa ảnh"
              >
                <XMarkIcon className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="relative w-full h-36 border border-dashed border-border/60 rounded-[2px] flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*"
              />
              <PhotoIcon className="w-7 h-7 text-muted-foreground mb-1.5 opacity-60" />
              <span className="text-xs font-medium text-muted-foreground">Nhấn để tải ảnh lên</span>
              <span className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">PNG, JPG, WEBP</span>
            </div>
          )}
        </div>

        {/* Kích hoạt */}
        <div className="flex items-center justify-between p-3 rounded-[2px] border border-border/60 bg-surface/30">
          <div className="space-y-0.5">
            <Label htmlFor="col-active" className="text-xs font-medium text-foreground">
              Trạng thái hoạt động
            </Label>
            <p className="text-[10px] text-muted-foreground">
              {formData.isActive ? "Đang kích hoạt hiển thị" : "Đang ẩn khỏi danh sách khách hàng"}
            </p>
          </div>
          <Switch
            id="col-active"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
        </div>
      </form>
    </SplitPaneInspector>
  );
}
