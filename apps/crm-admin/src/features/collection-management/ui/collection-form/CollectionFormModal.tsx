import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@my-project/ui";
import { Button, Input, Switch, Label } from "@my-project/ui";
import { useCreateCollection, useUpdateCollection } from "@entities/collection/hooks";
import type { CollectionDto, CollectionFormData } from "@entities/collection/types";
import { useUploadTemp } from "@entities/upload/hooks";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface CollectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CollectionDto | null;
}

export function CollectionFormModal({ isOpen, onClose, initialData }: CollectionFormModalProps) {
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
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || "",
        coverImageUrl: initialData.coverImageUrl || "",
        isActive: initialData.isActive,
      });
    } else if (isOpen) {
      setFormData({
        name: "",
        slug: "",
        description: "",
        coverImageUrl: "",
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      updateMut.mutate(
        { id: initialData.id, payload: formData },
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
        setFormData({ ...formData, coverImageUrl: res[0].url });
      },
    });
  };

  const removeImage = () => {
    setFormData({ ...formData, coverImageUrl: "" });
  };

  const isPending = createMut.isPending || updateMut.isPending || uploadMut.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? "Chỉnh sửa bộ sưu tập" : "Thêm mới bộ sưu tập"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 p-4 sm:p-6">
            <div className="grid gap-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Tên bộ sưu tập</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="shadow-neo-inset border-border/10"
                placeholder="Ví dụ: Mùa hè sôi động"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="slug" className="text-xs font-semibold text-muted-foreground">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="shadow-neo-inset border-border/10"
                placeholder="mua-he-soi-dong"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-muted-foreground">Mô tả</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="shadow-neo-inset border-border/10"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Ảnh bìa</Label>
              {formData.coverImageUrl ? (
                <div className="relative w-full h-40 rounded-card overflow-hidden border border-border/10">
                  <img src={formData.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-40 border border-dashed border-border/20 rounded-card flex flex-col items-center justify-center bg-secondary/5 hover:bg-secondary/10 transition-colors cursor-pointer">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <PhotoIcon className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-semibold text-muted-foreground">Nhấn để tải ảnh lên</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <Label htmlFor="isActive" className="text-xs font-semibold text-foreground">Kích hoạt bộ sưu tập</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                className="data-[state=checked]:bg-accent"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu bộ sưu tập"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

