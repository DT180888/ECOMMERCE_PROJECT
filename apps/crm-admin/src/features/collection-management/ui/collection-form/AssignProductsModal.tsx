
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Checkbox, Input, Button } from "@my-project/ui";
import { useProductList } from "@entities/product/hooks";
import { useUpdateCollectionProducts } from "@entities/collection/hooks";
import type { CollectionDto } from "@entities/collection/types";
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Gán sản phẩm - {collection.name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 py-4 min-h-0">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm kiếm sản phẩm theo tên..."
              className="pl-10 shadow-neo-inset border-border/10"
            />
          </div>

          <div className="flex-1 overflow-auto border border-border/10 rounded-card bg-card">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/10 sticky top-0 z-10 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">
                    <Checkbox
                      checked={isPageAllChecked}
                      onChange={(e) => handleToggleAllOnPage(e.target.checked)}
                      aria-label="Select all on page"
                    />
                  </th>
                  <th className="px-4 py-3 font-medium">Sản phẩm</th>
                  <th className="px-4 py-3 font-medium text-right">Giá từ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : !allProducts?.items.length ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground italic">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  allProducts.items.map((product) => {
                    const isChecked = selectedIds.includes(product.productId);
                    return (
                      <tr key={product.productId} className="hover:bg-muted/5 transition-colors group">
                        <td className="px-4 py-3 text-center">
                          <Checkbox
                            checked={isChecked}
                            onChange={(e) => handleToggleProduct(product.productId, e.target.checked)}
                            aria-label={`Select ${product.name}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {product.thumbnailUrl ? (
                              <img src={product.thumbnailUrl} alt={product.name} className="w-10 h-10 object-cover rounded-inner bg-secondary/10" />
                            ) : (
                              <div className="w-10 h-10 rounded-inner bg-secondary/10 border border-border/10" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                              <span className="text-xs text-muted-foreground">{product.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap text-muted-foreground">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.minPriceMinor)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {allProducts && allProducts.total > size && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">
                Trang {page} / {Math.ceil(allProducts.total / size)} (Tổng {allProducts.total})
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-secondary/20 shadow-none border border-border/10"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Trước
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-secondary/20 shadow-none border border-border/10"
                  disabled={page >= Math.ceil(allProducts.total / size)}
                  onClick={() => setPage(p => p + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            Đã chọn: <span className="font-medium text-foreground">{selectedIds.length}</span> sản phẩm
          </div>
        </div>

        <DialogFooter className="mt-auto">
          <Button type="button" variant="outline" onClick={onClose} disabled={updateMut.isPending}>
            Hủy
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={updateMut.isPending || isCurrentLoading}>
            {updateMut.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

