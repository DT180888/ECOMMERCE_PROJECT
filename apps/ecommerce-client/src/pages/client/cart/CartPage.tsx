import { useSmartCart } from "@features/client/cart/useSmartCart";
import { Link, useNavigate } from "react-router-dom";
import { buildImgSrc } from "@shared/lib/url";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@shared/constants";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@my-project/ui";
import { Button } from "@my-project/ui";
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

  // Sync selectedSkuIds when cart changes (e.g., initial load)
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
      <div className="client-page-container py-8 flex flex-col responsive-gap animate-pulse">
        <div className="h-10 w-64 bg-black/5 rounded-inner" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-black/5 rounded-card" />
            ))}
          </div>
          <div className="h-96 bg-black/5 rounded-card" />
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
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="responsive-h2 text-foreground tracking-tight">Giỏ hàng của bạn</h1>
          <p className="text-muted text-[10px] font-bold uppercase tracking-[0.2em]">Cửa hàng Minimalism • {cart.items.length} sản phẩm</p>
        </div>
        <button
          onClick={handleClearCart}
          className="text-[10px] font-bold text-muted uppercase tracking-widest hover:text-error transition-colors flex items-center gap-2 px-3 py-2 bg-background rounded-button shadow-neo-sm hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-neo-inset-sm transition-all duration-300"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          Xoá toàn bộ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 responsive-gap items-start">
        
        {/* Item List Container (Sunken Tray) */}
        <section className="lg:col-span-2 bg-background rounded-card p-6 transition-all duration-300 space-y-6">
          {/* Select All */}
          <div className="flex items-center gap-4 px-6 py-2">
            <Checkbox
              checked={selectedSkuIds.length === cart.items.length}
              onChange={toggleSelectAll}
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Chọn tất cả ({cart.items.length})</span>
          </div>

          {cart.items.map((item) => (
            <div
              key={item.skuId}
              className={`group bg-background rounded-inner shadow-neo p-5 sm:p-6 flex flex-col sm:flex-row gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-neo-inset-hover ${
                selectedSkuIds.includes(item.skuId) ? "shadow-neo-inset" : ""
              }`}
            >
              {/* Checkbox */}
              <div className="flex items-center">
                <Checkbox
                  checked={selectedSkuIds.includes(item.skuId)}
                  onChange={() => toggleSelectItem(item.skuId)}
                />
              </div>

              {/* Product Image */}
              <Link to={`/product/${item.skuId}`} className="shrink-0 relative overflow-hidden rounded-gallery bg-background aspect-square w-full sm:w-32 shadow-neo-inset-sm p-2 flex items-center justify-center">
                <img
                  src={item.primaryImageUrl ? buildImgSrc(item.primaryImageUrl) : DEFAULT_PRODUCT_IMAGE_URL}
                  alt={item.name}
                  className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${updatingSkuId === item.skuId ? "scale-90 opacity-50 grayscale" : ""}`}
                />
                {updatingSkuId === item.skuId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </Link>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-foreground leading-tight">
                        <Link to={`/product/${item.skuId}`} className="hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      {item.skuCode && (
                        <p className="text-[10px] font-mono text-muted uppercase tracking-wider">{item.skuCode}</p>
                      )}
                    </div>
                    <p className="text-base font-extrabold text-foreground">{formatVND(item.priceMinor)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  {/* Quantity Control */}
                  <div className="flex items-center gap-2 bg-background p-1 rounded-inner shadow-neo-inset-sm">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-inner hover:bg-background hover:shadow-neo transition-all disabled:opacity-20"
                      onClick={() => handleUpdateQuantity(item.skuId, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1 || updatingSkuId === item.skuId}
                    >
                      <MinusIcon className="w-3.5 h-3.5 text-foreground" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-foreground tabular-nums">
                      {updatingSkuId === item.skuId ? "..." : item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-inner hover:bg-background hover:shadow-neo transition-all disabled:opacity-20"
                      onClick={() => handleUpdateQuantity(item.skuId, item.quantity + 1)}
                      disabled={updatingSkuId === item.skuId}
                    >
                      <PlusIcon className="w-3.5 h-3.5 text-foreground" />
                    </button>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden xs:block">
                      <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Thành tiền</p>
                      <p className="font-extrabold text-foreground">{formatVND(item.priceMinor * item.quantity)}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.skuId, item.name)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-background text-muted hover:text-error shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-neo-inset-sm transition-all"
                    >
                      <TrashIcon className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Summary Sidebar */}
        <aside className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-background rounded-card shadow-neo-inset p-8 space-y-6">
            <h2 className="text-lg font-bold font-display text-foreground tracking-tight pb-2 border-b border-muted/10">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted">Tạm tính ({selectedItems.length} sản phẩm)</span>
                <span className="font-bold text-foreground">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Ước tính phí giao hàng</span>
                <span className="text-success uppercase text-[9px] font-bold tracking-widest">Miễn phí</span>
              </div>
              <div className="pt-4 border-t border-muted/10 flex justify-between items-end">
                <div className="space-y-0.5">
                   <p className="text-xs font-bold text-foreground uppercase tracking-wider">Tổng cộng</p>
                   <p className="text-[10px] text-muted">Bao gồm thuế VAT</p>
                </div>
                <p className="text-xl font-extrabold text-foreground tracking-tight">{formatVND(subtotal)}</p>
              </div>
            </div>

            <Button
              onClick={handleCheckoutClick}
              disabled={selectedItems.length === 0}
              className="w-full h-14 rounded-button font-bold text-xs uppercase tracking-widest"
            >
              {isLoggedIn ? `Thanh toán (${selectedItems.length})` : "Đăng nhập để mua"}
              <ArrowRightIcon className="w-3.5 h-3.5 ml-2" />
            </Button>

            <div className="text-center pt-2">
               <Link to="/catalog" className="text-[9px] font-bold text-muted uppercase tracking-widest hover:text-foreground transition-colors">
                  Tiếp tục mua sắm
               </Link>
            </div>
          </div>

          <div className="p-5 rounded-card bg-background shadow-neo-inset-sm space-y-3">
             <div className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-neo text-sm">
                   🚚
                </div>
                <p className="text-xs font-bold uppercase tracking-tight">Giao hàng dự kiến: 2-4 ngày</p>
             </div>
             <p className="text-[10px] text-muted leading-relaxed font-medium">Chính sách trả hàng trong vòng 30 ngày nếu không hài lòng về sản phẩm.</p>
          </div>
        </aside>

      </div>
    </div>
  );
}
