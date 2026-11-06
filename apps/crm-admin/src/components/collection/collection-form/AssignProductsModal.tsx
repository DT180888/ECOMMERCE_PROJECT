
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Checkbox, Input, Button } from "@my-project/ui";
import { AdminTable, type AdminTableColumn } from "@shared/ui";
import { useProductList } from "@hooks/useProduct";
import { useUpdateCollectionProducts } from "@hooks/useCollection";
import type { CollectionDto, ProductCard } from "@my-project/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";


interface AssignProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: CollectionDto;
}

export function AssignProductsModal({ isOpen, onClose, collection }: AssignProductsModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedKeyword(keyword), 500);
    return () => clearTimeout(handler);
  }, [keyword]);
  const [page, setPage] = useState(1);
  const size = 10;

  // 1. Fetch current assigned products (we use a large size to get all IDs at once)
  // This is only enabled when the modal opens to initialize the checked state.
  const { data: currentProducts, isLoading: isCurrentLoading } = useProductList(
    { collectionSlug: collection.slug, size: 1000 },
    { enabled: isOpen }
  );

  useEffect(() => {
    if (currentProducts && isOpen) {
      setSelectedIds(currentProducts.items.map((p) => p.productId));
    } else if (!isOpen) {
      setSelectedIds([]);
      setKeyword("");
      setPage(1);
    }
  }, [currentProducts, isOpen]);

  // 2. Fetch all products with pagination & search
  const { data: allProducts, isLoading: isAllLoading } = useProductList(
    { page, size, keyword: debouncedKeyword },
    { enabled: isOpen }
  );

  const updateMut = useUpdateCollectionProducts();

  const handleToggleProduct = (productId: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  const handleToggleAllOnPage = (checked: boolean) => {
    if (!allProducts) return;
    const pageIds = allProducts.items.map((p) => p.productId);
    if (checked) {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMut.mutate(
      { id: collection.id, productIds: selectedIds },
      { onSuccess: () => onClose() }
    );
  };

  const isPageAllChecked = allProducts?.items.length
    ? allProducts.items.every((p) => selectedIds.includes(p.productId))
    : false;

  const isLoading = isCurrentLoading || isAllLoading;

  const columns: AdminTableColumn<ProductCard>[] = useMemo(
    () => [
      {
        key: "product",
        label: "Sản phẩm",
        isMain: true,
        render: (product) => (
          <div className="flex items-center gap-2">
            {product.thumbnailUrl ? (
              <img
                src={product.thumbnailUrl}
                alt={product.name}
                className="w-8 h-8 object-cover rounded-[2px] bg-surface border border-border/40 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-[2px] bg-surface border border-border/40 shrink-0" />
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-foreground truncate">
                {product.name}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground truncate">
                {product.slug}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: "price",
        label: "Giá từ",
        align: "right",
        render: (product) => (
          <span className="font-mono text-xs tabular-nums text-foreground font-medium">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
              product.minPriceMinor
            )}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] flex flex-col max-h-[85vh] p-0 bg-surface border border-border/40 rounded-[2px] shadow-none gap-0 overflow-hidden">
        {/* Modal Header */}
        <div className="h-12 px-4 border-b border-border/40 flex items-center justify-between shrink-0 bg-surface">
          <DialogTitle className="text-xs uppercase tracking-wider font-medium text-foreground">
            Gán sản phẩm — {collection.name}
          </DialogTitle>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col gap-3 p-4 min-h-0 bg-background">
          <div className="relative">
            <MagnifyingGlassIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm kiếm sản phẩm theo tên..."
              className="pl-8 h-8 text-xs bg-surface border-border/40 rounded-[2px] w-full focus:bg-background transition-colors"
            />
          </div>

          <div className="flex-1 overflow-auto min-h-0 border-y border-border/40 bg-background">
            <AdminTable
              columns={columns}
              data={allProducts?.items ?? []}
              isLoading={isLoading}
              rowKey="productId"
              onRowClick={(item) => handleToggleProduct(item.productId, !selectedIds.includes(item.productId))}
              selection={{
                selected: new Set(selectedIds),
                onSelect: (id, checked) => handleToggleProduct(id as number, checked),
                onSelectAll: handleToggleAllOnPage,
                getRowKey: (item: any) => item.productId,
              }}
              emptyText="Không tìm thấy sản phẩm nào"
            />
          </div>

          {/* Sub-footer inside body */}
          <div className="flex items-center justify-between text-xs text-muted-foreground shrink-0 pt-1">
            <span className="text-[11px]">
              Đã chọn: <span className="font-mono tabular-nums font-medium text-foreground">{selectedIds.length}</span> sản phẩm
            </span>
            {allProducts && allProducts.total > size && (
              <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
                <span>
                  Trang {page} / {Math.ceil(allProducts.total / size)}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="default"
                    className="h-6 px-2 text-xs rounded-[2px]"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    className="h-6 px-2 text-xs rounded-[2px]"
                    disabled={page >= Math.ceil(allProducts.total / size)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="h-12 px-4 border-t border-border/40 bg-surface/40 flex items-center justify-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateMut.isPending}
            className="h-8 px-3 text-xs font-normal rounded-[2px] border-border/40"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={updateMut.isPending || isCurrentLoading}
            className="h-8 px-4 text-xs font-normal rounded-[2px]"
          >
            {updateMut.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}



