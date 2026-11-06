import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePaymentUrl } from '@hooks/usePayment';
import { useOrderPaymentPolling } from '@hooks/useOrder';
import { useSmartCart } from '@hooks/useSmartCart';
import { Button, useToast } from '@my-project/ui';

interface VietQRPaymentWidgetProps {
  orderId: number;
  amount: number;
}

export const VietQRPaymentWidget: React.FC<VietQRPaymentWidgetProps> = ({
  orderId,
  amount,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const createPayment = useCreatePaymentUrl();
  const { clearCart } = useSmartCart();

  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const transferContent = `ORD${orderId}`;

  const { data: order, refetch, isFetching } = useOrderPaymentPolling(orderId, true);

  useEffect(() => {
    if (order) {
      const isPaid =
        order.status === 2 ||
        order.status === 3 ||
        order.status === 5 ||
        (order.status as any) === 'Paid' ||
        order.statusText?.toLowerCase() === 'paid' ||
        order.statusText === 'Đã thanh toán' ||
        !!order.paidAt;

      if (isPaid) {
        clearCart?.();
        toast.success(`Thanh toán đơn hàng #${order.orderNumber || orderId} thành công! 🎉`);
        navigate(`/account/orders/${order.orderId || orderId}`);
      }
    }
  }, [order, clearCart, navigate, orderId, toast]);

  const fetchPaymentUrl = async () => {
    setLoading(true);
    setErrorMsg(null);
    const returnUrl = `${window.location.origin}/checkout/result`;
    try {
      const res = await createPayment.mutateAsync({ orderId, returnUrl });
      const rawUrl = (res as any)?.paymentUrl || (res as any)?.data?.paymentUrl || (typeof res === "string" ? res : null);
      if (rawUrl) {
        let finalUrl = rawUrl;
        if (finalUrl.includes("10.0.2.2")) {
          finalUrl = finalUrl.replace("10.0.2.2", "localhost");
        }
        setPaymentUrl(finalUrl);
      } else {
        setErrorMsg("Không thể lấy mã VietQR thanh toán.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Lỗi kết nối tạo mã VietQR.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchPaymentUrl();
    }
  }, [orderId]);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(transferContent);
    setCopied(true);
    toast.success('Đã sao chép nội dung chuyển khoản!');
    setTimeout(() => setCopied(false), 2500);
  };

  const formatVND = (val?: number) => {
    if (!val) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  if (loading) {
    return (
      <div className="bg-background rounded-card shadow-neo-sm p-6 text-center space-y-3 animate-pulse">
        <div className="w-12 h-12 bg-muted/20 rounded-full mx-auto" />
        <p className="text-xs font-bold text-muted uppercase tracking-wider">Đang khởi tạo mã VietQR...</p>
      </div>
    );
  }

  if (errorMsg || !paymentUrl) {
    return (
      <div className="bg-background rounded-card shadow-neo-sm p-6 text-center space-y-3 border border-error/20">
        <p className="text-xs text-error font-bold">{errorMsg || "Không tải được mã QR"}</p>
        <Button size="sm" variant="outline" onClick={fetchPaymentUrl} className="text-xs font-bold uppercase">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-card shadow-neo p-6 space-y-4 border border-muted/15">
      <div className="flex items-center justify-between pb-2 border-b border-muted/10">
        <div className="flex items-center gap-2">
          <span className="text-lg">💳</span>
          <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
            Thanh toán qua VietQR
          </h3>
        </div>
        <span className="text-[10px] font-bold text-success uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/10">
          Tự động xác nhận
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-3 bg-white rounded-card shadow-neo-inset-sm">
        <img
          src={paymentUrl}
          alt={`VietQR ORD${orderId}`}
          className="w-56 h-56 object-contain rounded-lg"
        />
        <p className="mt-2 text-[10px] font-medium text-gray-500 text-center">
          Mở ứng dụng Ngân hàng / MoMo để quét mã
        </p>
      </div>

      <div className="bg-background rounded-card p-3.5 shadow-neo-inset-sm space-y-2 text-xs">
        <div className="flex justify-between items-center text-muted">
          <span>Ngân hàng:</span>
          <span className="font-bold text-foreground">Sacombank</span>
        </div>
        <div className="flex justify-between items-center text-muted">
          <span>Số tài khoản:</span>
          <span className="font-mono font-bold text-foreground">070118506098</span>
        </div>
        <div className="flex justify-between items-center text-muted">
          <span>Chủ tài khoản:</span>
          <span className="font-bold text-foreground uppercase">PHAM DUC TAM</span>
        </div>
        <div className="flex justify-between items-center text-muted pt-1 border-t border-muted/10">
          <span>Số tiền:</span>
          <span className="font-extrabold text-primary text-sm">{formatVND(amount)}</span>
        </div>

        <div className="pt-2 border-t border-muted/10 flex items-center justify-between bg-primary/5 p-2 rounded-button border border-primary/20">
          <div>
            <div className="text-[9px] text-muted uppercase tracking-wider font-bold">Nội dung chuyển khoản</div>
            <div className="font-mono font-extrabold text-primary text-xs tracking-wide">{transferContent}</div>
          </div>
          <Button
            onClick={handleCopyContent}
            size="sm"
            className="px-2.5 py-1 text-[10px] font-bold rounded-button shadow-neo-sm hover:opacity-90 transition-all"
          >
            {copied ? '✓ Đã chép' : 'Sao chép'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 pt-1">
        <div className="flex items-center justify-center gap-2 text-[11px] text-muted font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>{isFetching ? 'Đang kiểm tra...' : 'Đang tự động kiểm tra giao dịch...'}</span>
        </div>
        <Button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="w-full text-xs font-bold py-2 rounded-button hover:opacity-90 transition"
        >
          {isFetching ? 'Đang kiểm tra...' : 'Tôi đã chuyển khoản'}
        </Button>
      </div>
    </div>
  );
};

export default VietQRPaymentWidget;
