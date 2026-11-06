import { useSmartCart } from "@hooks/useSmartCart";
import { Link, useNavigate } from "react-router-dom";
import { buildImgSrc } from "@my-project/shared-utils";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@my-project/shared-utils";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@my-project/ui";
import { Button, Skeleton } from "@my-project/ui";
import { Checkbox } from "@my-project/ui";
import { useState, useMemo, useEffect } from "react";

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    minor
  );

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem, clearCart, isLoggedIn } =
    useSmartCart();

  const nav = useNavigate();
  const toast = useToast();

  const [selectedSkuIds, setSelectedSkuIds] = useState<number[]>([]);
  const [updatingSkuId, setUpdatingSkuId] = useState<number | null>(null);

  useEffect(() => {
    if (cart && selectedSkuIds.length === 0 && cart.items.length > 0) {
      setSelectedSkuIds(cart.items.map((i) => i.skuId));
    }
  }, [cart?.items.length]);

  const toggleSelectAll = () => {
    if (selectedSkuIds.length === cart?.items.length) {
      setSelectedSkuIds([]);
    } else {
      setSelectedSkuIds(cart?.items.map((i) => i.skuId) || []);
    }
  };

  const toggleSelectItem = (skuId: number) => {
    setSelectedSkuIds((prev) =>
      prev.includes(skuId)
        ? prev.filter((id) => id !== skuId)
        : [...prev, skuId]
    );
  };

  const selectedItems = useMemo(() => {
    return cart?.items.filter((item) => selectedSkuIds.includes(item.skuId)) || [];
  }, [cart?.items, selectedSkuIds]);

  const subtotal = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => acc + item.priceMinor * item.quantity,
      0
    );
  }, [selectedItems]);

  const handleUpdateQuantity = async (skuId: number, newQty: number) => {
    setUpdatingSkuId(skuId);
    try {
      await updateQuantity(skuId, newQty);
    } finally {
      setUpdatingSkuId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="client-page-container py-8 flex flex-col responsive-gap">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-24 h-24 bg-background rounded-full shadow-neo flex items-center justify-center text-muted">
          <ShoppingBagIcon className="w-12 h-12" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold font-display text-foreground">Giỏ hàng đang trống</h2>
          <p className="text-muted text-xs font-bold uppercase tracking-wider">Hành trình phong cách của bạn bắt đầu bằng một bước chọn đồ.</p>
        </div>
        <Button asChild size="lg" className="px-10 font-bold uppercase tracking-widest text-xs">
          <Link to="/catalog">Khám phá ngay</Link>
        </Button>
      </div>
    );
  }

  const handleCheckoutClick = () => {
    if (selectedItems.length === 0) {
      toast.info("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }
    if (!isLoggedIn) {
      nav("/auth/login?redirect=/checkout");
    } else {
      nav("/checkout");
    }
  };

  const handleRemove = (skuId: number, name: string) => {
    toast.confirm(
      `Bạn có muốn xóa "${name}" khỏi giỏ hàng?`,
      async () => {
        await removeItem(skuId);
        setSelectedSkuIds(prev => prev.filter(id => id !== skuId));
        toast.success("Đã xóa sản phẩm");
      },
      "Xóa ngay"
    );
  };

  const handleClearCart = () => {
    toast.confirm(
      "Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?",
      async () => {
        await clearCart();
        setSelectedSkuIds([]);
        toast.info("Giỏ hàng đã được làm trống");
      },
      "Xóa hết"
    );
  };

  return (
    <div className="client-page-container pt-6 md:pt-10 pb-20 flex flex-col responsive-gap animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="responsive-h2 text-foreground tracking-tight">Giỏ hàng của bạn</h1>
          <p className="text-muted text-[10px] font-bold uppercase tracking-[0.2em]">Cửa hàng Minimalism • {cart.items.length} sản phẩm</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearCart}
          className="gap-2 text-[11px] rounded-[2px]"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          <span>Xóa Toàn Bộ</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 responsive-gap items-start">
        <section className="lg:col-span-2 bg-card border border-border/60 rounded-[2px] p-6 transition-all duration-300 space-y-6">
          <div className="flex items-center gap-4 px-6 py-2">
            <Checkbox
              checked={selectedSkuIds.length === cart.items.length && cart.items.length > 0}
              onChange={toggleSelectAll}
            />
            <span className="text-[10px] font-display font-medium uppercase tracking-widest text-muted-foreground">Chọn tất cả ({cart.items.length})</span>
          </div>

          {cart.items.map((item) => (
            <div
              key={item.skuId}
              className={`group bg-surface/30 border border-border/60 rounded-[2px] p-5 sm:p-6 flex flex-col sm:flex-row gap-6 transition-colors ${
                selectedSkuIds.includes(item.skuId) ? "border-foreground/60 bg-surface/50" : "hover:border-foreground/30"
              }`}
            >
              <div className="flex items-center">
                <Checkbox
                  checked={selectedSkuIds.includes(item.skuId)}
                  onChange={() => toggleSelectItem(item.skuId)}
                />
              </div>

              <Link to={`/product/${item.skuId}`} className="shrink-0 relative overflow-hidden rounded-[2px] bg-background border border-border/40 aspect-square w-full sm:w-32 p-2 flex items-center justify-center">
                <img
                  src={item.primaryImageUrl ? buildImgSrc(item.primaryImageUrl) : DEFAULT_PRODUCT_IMAGE_URL}
                  alt={item.name}
                  className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${updatingSkuId === item.skuId ? "scale-90 opacity-50 grayscale" : ""}`}
                />
                {updatingSkuId === item.skuId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </Link>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-display font-medium text-foreground leading-tight">
                        <Link to={`/product/${item.skuId}`} className="hover:text-muted-foreground transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      {item.skuCode && (
                        <p className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">{item.skuCode}</p>
                      )}
                    </div>
                    <p className="text-sm font-display font-medium text-foreground tabular-nums">{formatVND(item.priceMinor)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  {/* Flat Hairline Stepper */}
                  <div className="flex items-center border border-border/60 rounded-[2px] h-9 bg-surface/40">
                    <button
                      type="button"
                      className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20 cursor-pointer"
                      onClick={() => handleUpdateQuantity(item.skuId, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1 || updatingSkuId === item.skuId}
                      aria-label="Giảm số lượng"
                    >
                      <MinusIcon className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-display font-medium text-foreground tabular-nums">
                      {updatingSkuId === item.skuId ? "..." : item.quantity}
                    </span>
                    <button
                      type="button"
                      className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20 cursor-pointer"
                      onClick={() => handleUpdateQuantity(item.skuId, item.quantity + 1)}
                      disabled={updatingSkuId === item.skuId}
                      aria-label="Tăng số lượng"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden xs:block">
                      <p className="text-[9px] font-display uppercase tracking-widest text-muted-foreground mb-0.5">Thành tiền</p>
                      <p className="font-display font-medium text-foreground tabular-nums">{formatVND(item.priceMinor * item.quantity)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.skuId, item.name)}
                      className="w-8 h-8 flex items-center justify-center rounded-[2px] border border-border/60 text-muted-foreground hover:text-error hover:border-error/40 transition-colors"
                      aria-label={`Xóa ${item.name}`}
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <aside className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-card border border-border/60 rounded-[2px] p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-display font-medium text-foreground tracking-tight pb-3 border-b border-border/60">Tóm Tắt Đơn Hàng</h2>
            
            <div className="space-y-4 text-xs font-display">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tạm tính ({selectedItems.length} sản phẩm)</span>
                <span className="font-medium text-foreground tabular-nums">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ước tính phí giao hàng</span>
                <span className="text-success uppercase text-[10px] font-medium tracking-widest">Miễn phí</span>
              </div>
              <div className="pt-4 border-t border-border/60 flex justify-between items-end">
                <div className="space-y-0.5">
                   <p className="text-xs font-medium text-foreground uppercase tracking-wider">Tổng cộng</p>
                   <p className="text-[10px] text-muted-foreground">Đã bao gồm thuế</p>
                </div>
                <p className="text-lg font-medium text-foreground tracking-tight tabular-nums">{formatVND(subtotal)}</p>
              </div>
            </div>

            <Button
              onClick={handleCheckoutClick}
              disabled={selectedItems.length === 0}
              className="w-full h-11 rounded-[2px] font-display font-medium text-xs uppercase tracking-[0.18em]"
            >
              {isLoggedIn ? `Thanh toán (${selectedItems.length})` : "Đăng nhập để mua"}
              <ArrowRightIcon className="w-3.5 h-3.5 ml-2" />
            </Button>

            <div className="text-center pt-2">
               <Link to="/catalog" className="text-[10px] font-display font-medium text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors">
                  Tiếp tục mua sắm →
               </Link>
            </div>
          </div>

          <div className="p-5 rounded-[2px] bg-surface/30 border border-border/40 space-y-2 text-xs font-display">
             <div className="flex items-center gap-2 text-foreground font-medium uppercase tracking-wider text-[11px]">
                <span>✓ Giao hàng tiêu chuẩn 2-4 ngày</span>
             </div>
             <p className="text-[11px] text-muted-foreground leading-relaxed font-light">Chính sách đổi trả 14 ngày chuẩn Studio nếu sản phẩm chưa qua sử dụng.</p>
          </div>
        </aside>

      </div>
    </div>
  );
}
