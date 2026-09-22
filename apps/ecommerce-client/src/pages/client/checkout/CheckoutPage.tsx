import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSmartCart } from "@features/client/cart/useSmartCart";
import AddressBook from "@widgets/client/Address/AddressBook";
import { useCheckoutOrder, useCheckoutPreview } from "@entities/order/hooks";
import { Button } from "@my-project/ui";
import { TextArea } from "@my-project/ui";
import { Checkbox } from "@my-project/ui";
import AddressPicker from "@widgets/client/Address/AddressPicker ";
import { useCreatePaymentUrl } from "@entities/payment/hooks";
import { useToast } from "@my-project/ui";
import { buildImgSrc } from "@shared/lib/url";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@shared/constants";
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  CreditCardIcon, 
  ChatBubbleLeftEllipsisIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  TicketIcon
} from "@heroicons/react/24/outline";
import { Input } from "@my-project/ui";

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format((minor ?? 0));

export default function CheckoutPage() {
  const nav = useNavigate();
  const { cart, isLoading, isLoggedIn } = useSmartCart();
  
  const checkout = useCheckoutOrder();
  const createPayment = useCreatePaymentUrl();
  const toast = useToast();

  const [shipToId, setShipToId] = useState<number | null>(null);
  const [billSame, setBillSame] = useState(true);
  const [billToId, setBillToId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const selectedItems = useMemo(
    () => cart?.items.filter((i) => i.isSelected) ?? [],
    [cart]
  );

  const selectedSubtotalMinor = useMemo(
    () =>
      selectedItems.reduce(
        (sum, it) => sum + it.priceMinor * it.quantity,
        0
      ),
    [selectedItems]
  );

  const effectiveBillToId = billSame ? shipToId : billToId ?? shipToId ?? null;

  const {
    data: preview,
    isLoading: previewLoading,
  } = useCheckoutPreview({
    shipToAddressId: shipToId,
    billToAddressId: effectiveBillToId,
    couponCode: appliedCoupon || undefined,
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold font-display text-foreground">XÃ¡c thá»±c danh tÃ­nh</h1>
          <p className="text-muted text-xs font-bold uppercase tracking-wider">Báº¡n cáº§n Ä‘Äƒng nháº­p Ä‘á»ƒ hoÃ n táº¥t viá»‡c thanh toÃ¡n vÃ  báº£o máº­t thÃ´ng tin.</p>
        </div>
        <Button asChild size="lg" className="px-10 font-bold uppercase tracking-widest text-xs">
          <Link to="/auth/login">ÄÄƒng nháº­p ngay</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="client-page-container py-10 flex flex-col responsive-gap animate-pulse">
        <div className="h-10 w-48 bg-muted/10 rounded-button" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-muted/10 rounded-card" />
          <div className="h-96 bg-muted/10 rounded-card" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0 || selectedItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-6 text-center">
        <h2 className="text-xl font-bold text-foreground">KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m thanh toÃ¡n</h2>
        <Link className="text-xs font-bold text-muted uppercase tracking-widest hover:text-foreground transition-colors" to="/cart">
          Quay láº¡i giá» hÃ ng
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!shipToId) {
      toast.error("Vui lÃ²ng chá»n Ä‘á»‹a chá»‰ nháº­n hÃ ng."); 
      return;
    }

    const payload = {
      shipToAddressId: shipToId,
      billToAddressId: billSame ? shipToId : billToId ?? shipToId,
      currency: "VND",
      notes: notes.trim() || null,
      couponCode: appliedCoupon || undefined,
    };

    try {
        const { orderId } = await checkout.mutateAsync(payload);
        toast.success("ÄÆ¡n hÃ ng Ä‘Ã£ Ä‘Æ°á»£c táº¡o!");
        
        const returnUrl = `${window.location.origin}/checkout/result`;
        const payRes = await createPayment.mutateAsync({ orderId, returnUrl });

        if (payRes.paymentUrl) {
            let finalUrl = payRes.paymentUrl;
            if (finalUrl.includes("10.0.2.2")) {
                finalUrl = finalUrl.replace("10.0.2.2", "localhost");
            }
            window.location.href = finalUrl;
        } else { 
            nav(`/OrderConfirm/${orderId}`);
        }
    } catch (error) {
        const err = error as any;
        const msg = err?.message || "CÃ³ lá»—i xáº£y ra khi xá»­ lÃ½ Ä‘Æ¡n hÃ ng.";
        toast.error(msg);
    }
  };

  return (
    <div className="client-page-container pb-32 lg:pb-20 flex flex-col responsive-gap animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="responsive-h2 text-foreground tracking-tight">Thanh toÃ¡n</h1>
          <div className="flex items-center gap-2 text-muted text-[10px] font-bold uppercase tracking-widest">
             <ShieldCheckIcon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
             Thanh toÃ¡n báº£o máº­t SSL
          </div>
        </div>
        <Link to="/cart" className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest hover:text-foreground transition-all group">
          <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Giá» hÃ ng
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 responsive-gap items-start">
        
        {/* Left: Configuration (Sunken Tray) */}
        <section className="bg-background rounded-card p-6 shadow-neo-inset transition-all duration-300 space-y-6 lg:col-span-1">
          
          {/* Shipping Address */}
          <section className="bg-background rounded-card shadow-neo p-8 space-y-6">
            <div className="flex items-center gap-3 text-foreground mb-2">
               <div className="p-2.5 rounded-inner bg-background shadow-neo-inset-sm">
                  <MapPinIcon className="w-5 h-5" />
               </div>
               <h2 className="text-lg font-bold tracking-tight">Äá»‹a chá»‰ nháº­n hÃ ng</h2>
            </div>
            <AddressPicker
              title=""
              selectedId={shipToId}
              onChange={(id) => setShipToId(id)}
            />
          </section>

          {/* Billing Address */}
          <section className="bg-background rounded-card shadow-neo p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-foreground">
                   <div className="p-2.5 rounded-inner bg-background shadow-neo-inset-sm">
                      <CreditCardIcon className="w-5 h-5" />
                   </div>
                   <h2 className="text-lg font-bold tracking-tight">Äá»‹a chá»‰ thanh toÃ¡n</h2>
                </div>
            </div>
            <div className="flex items-center gap-3 px-1">
                <Checkbox
                  id="billSame"
                  checked={billSame}
                  onChange={(e) => setBillSame(e.target.checked)}
                />
                <label htmlFor="billSame" className="text-xs font-bold text-muted cursor-pointer hover:text-foreground transition-colors">
                  DÃ¹ng cÃ¹ng Ä‘á»‹a chá»‰ vá»›i nháº­n hÃ ng
                </label>
            </div>

            {!billSame && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                <AddressBook
                  mode="select"
                  pageSize={5}
                  selectedId={billToId ?? undefined}
                  onSelect={(id) => setBillToId(id)}
                />
              </div>
            )}
          </section>

          {/* Notes */}
          <section className="bg-background rounded-card shadow-neo p-8 space-y-6">
            <div className="flex items-center gap-3 text-foreground">
               <div className="p-2.5 rounded-inner bg-background shadow-neo-inset-sm">
                  <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
               </div>
               <h2 className="text-lg font-bold tracking-tight">Ghi chÃº Ä‘Æ¡n hÃ ng</h2>
            </div>
            <TextArea
              rows={3}
              placeholder="Báº¡n cÃ³ yÃªu cáº§u Ä‘áº·c biá»‡t nÃ o khÃ´ng?..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </section>

          {/* Coupon */}
          <section className="bg-background rounded-card shadow-neo p-8 space-y-6">
            <div className="flex items-center gap-3 text-foreground">
               <div className="p-2.5 rounded-inner bg-background shadow-neo-inset-sm">
                  <TicketIcon className="w-5 h-5" />
               </div>
               <h2 className="text-lg font-bold tracking-tight">Mã giảm giá</h2>
            </div>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Nhập mã giảm giá..."
                value={couponCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => setAppliedCoupon(couponCode)}>
                Áp dụng
              </Button>
            </div>
          </section>
        </section>

        {/* Right: Summary & Payment */}
        <aside className="lg:sticky lg:top-24 space-y-10">
          <section className="bg-background rounded-card shadow-neo p-8 space-y-6">
            <h2 className="text-lg font-bold font-display text-foreground tracking-tight mb-4">TÃ³m táº¯t Ä‘Æ¡n hÃ ng</h2>

            {/* Item List Summary */}
            <div className="max-h-[300px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
              {(preview?.items || selectedItems).map((it: {
                skuId?: number;
                cartItemId?: number;
                productName?: string;
                name?: string;
                quantity: number;
                lineTotalMinor?: number;
                priceMinor?: number;
                primaryImageUrl?: string;
              }) => (
                <div key={it.skuId || it.cartItemId} className="flex justify-between items-center gap-4 text-xs py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 w-12 h-12 rounded-inner bg-background shadow-neo-inset-sm p-1.5 flex items-center justify-center relative overflow-hidden">
                      <img
                        src={it.primaryImageUrl ? buildImgSrc(it.primaryImageUrl) : DEFAULT_PRODUCT_IMAGE_URL}
                        alt={it.productName || it.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-bold text-foreground line-clamp-1">{it.productName || it.name}</p>
                      <p className="text-xs font-bold text-muted uppercase tracking-widest">x{it.quantity}</p>
                    </div>
                  </div>
                  <p className="font-extrabold text-foreground shrink-0">{formatVND(it.lineTotalMinor || (it.priceMinor ?? 0) * it.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="h-px w-full bg-background shadow-neo-inset-sm my-4" />
            <div className="space-y-4">
              {previewLoading && (
                <div className="text-xs font-bold text-primary uppercase tracking-widest animate-pulse">Äang tÃ­nh toÃ¡n...</div>
              )}
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-muted">Táº¡m tÃ­nh</span>
                <span className="font-bold text-foreground">{formatVND(preview?.subtotalMinor ?? selectedSubtotalMinor)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-muted">PhÃ­ váº­n chuyá»ƒn</span>
                <span className="font-bold text-foreground">{formatVND(preview?.shippingMinor ?? 0)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-muted">Thuế</span>
                <span className="font-bold text-foreground">{formatVND(preview?.taxMinor ?? 0)}</span>
              </div>
              
              {(preview?.discountMinor || 0) > 0 && (
                <div className="flex justify-between items-center text-xs font-medium text-green-600">
                  <span className="font-bold">Giảm giá</span>
                  <span className="font-bold">- {formatVND(preview!.discountMinor)}</span>
                </div>
              )}
              
              <div className="h-px w-full bg-background shadow-neo-inset-sm my-4" />
              <div className="flex justify-between items-end">
                <p className="text-xs font-bold text-foreground uppercase tracking-widest">Tá»•ng cá»™ng</p>
                <p className="text-2xl font-extrabold text-foreground tracking-tighter">{formatVND(preview?.totalMinor ?? selectedSubtotalMinor)}</p>
              </div>
            </div>

            <Button
              className="w-full h-14 rounded-button font-bold text-xs uppercase tracking-widest"
              disabled={checkout.isPending || createPayment.isPending || previewLoading}
              onClick={handlePlaceOrder}
            >
              {checkout.isPending ? "Äang xá»­ lÃ½..." : "Äáº·t hÃ ng & Thanh toÃ¡n"}
            </Button>

            <p className="text-center text-xs font-bold text-muted uppercase tracking-tight">Báº±ng viá»‡c Ä‘áº·t hÃ ng, báº¡n Ä‘á»“ng Ã½ vá»›i Äiá»u khoáº£n cá»§a chÃºng tÃ´i</p>
          </section>

          {/* Secure Payment Info */}
          <div className="p-5 rounded-card bg-background shadow-neo-inset-sm flex items-center gap-4">
             <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-neo text-primary shrink-0">
                <LockClosedIcon className="w-5 h-5" />
             </div>
             <div>
                <p className="text-xs font-bold text-foreground uppercase tracking-tight">Thanh toÃ¡n an toÃ n</p>
                <p className="text-xs text-muted leading-relaxed font-medium">ChÃºng tÃ´i mÃ£ hÃ³a dá»¯ liá»‡u thanh toÃ¡n cá»§a báº¡n Ä‘á»ƒ Ä‘áº£m báº£o an toÃ n tuyá»‡t Ä‘á»‘i.</p>
             </div>
          </div>
        </aside>

      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md shadow-neo p-4 flex items-center justify-between gap-4 z-40 border-t border-muted/5 animate-in slide-in-from-bottom duration-300">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Tá»•ng cá»™ng</p>
          <p className="text-lg font-extrabold text-foreground tracking-tight">
            {formatVND(preview?.totalMinor ?? selectedSubtotalMinor)}
          </p>
        </div>
        <Button
          className="flex-1 h-12 rounded-button font-bold text-xs uppercase tracking-widest"
          disabled={checkout.isPending || createPayment.isPending || previewLoading}
          onClick={handlePlaceOrder}
        >
          {checkout.isPending ? "..." : "Thanh toÃ¡n"}
        </Button>
      </div>

    </div>
  );
}

