import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderPaymentPolling } from '@hooks/useOrder';
import { useSmartCart } from '@hooks/useSmartCart';
import { Button, useToast } from '@my-project/ui';

interface VietQRPaymentModalProps {
  orderId: number;
  amount?: number;
  paymentUrl: string;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const VietQRPaymentModal: React.FC<VietQRPaymentModalProps> = ({
  orderId,
  amount,
  paymentUrl,
  isOpen = true,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { clearCart } = useSmartCart();
  const [copied, setCopied] = useState(false);
  const transferContent = `ORD${orderId}`;

  const { data: order, refetch, isFetching } = useOrderPaymentPolling(orderId, isOpen);

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
        if (onSuccess) {
          onSuccess();
        } else {
          onClose?.();
        }
        navigate(`/account/orders/${order.orderId || orderId}`);
      }
    }
  }, [order, clearCart, navigate, onClose, onSuccess, orderId, toast]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-background rounded-card shadow-neo p-6 text-foreground border border-muted/20 space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-muted/10">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <h3 className="font-bold text-base uppercase tracking-wider text-foreground">
              Thanh toán VietQR
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
            title="Đóng"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-card shadow-neo-inset-sm">
          <img
            src={paymentUrl}
            alt={`VietQR ORD${orderId}`}
            className="w-64 h-64 object-contain rounded-lg shadow-sm"
          />
          <p className="mt-2 text-[11px] font-medium text-gray-500 text-center">
            Quét mã bằng App Ngân hàng bất kỳ (Sacombank, MB, Vietcombank, TPBank, Momo...)
          </p>
        </div>

        <div className="bg-background rounded-card p-4 shadow-neo-inset-sm space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-muted">
            <span>Ngân hàng thụ hưởng:</span>
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
          {amount && (
            <div className="flex justify-between items-center text-muted pt-1 border-t border-muted/10">
              <span>Số tiền:</span>
              <span className="font-extrabold text-primary text-sm">{formatVND(amount)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-muted/10 flex items-center justify-between bg-primary/5 p-2.5 rounded-button border border-primary/20">
            <div>
              <div className="text-[10px] text-muted uppercase tracking-wider font-bold">Nội dung chuyển khoản</div>
              <div className="font-mono font-extrabold text-primary text-sm tracking-wide">{transferContent}</div>
            </div>
            <Button
              onClick={handleCopyContent}
              className="px-3 py-1.5 text-xs font-bold rounded-button shadow-neo-sm hover:opacity-90 transition-all"
            >
              {copied ? '✓ Đã chép' : 'Sao chép'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-1 text-xs text-muted font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>{isFetching ? 'Đang kiểm tra...' : 'Đang tự động xác nhận giao dịch...'}</span>
        </div>

        <div className="flex gap-3 pt-1">
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider bg-background text-foreground shadow-neo hover:shadow-neo-hover rounded-button border border-muted/20"
          >
            {isFetching ? 'Đang kiểm tra...' : 'Tôi đã chuyển khoản'}
          </Button>
          <Button
            onClick={onClose}
            className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider bg-muted/20 text-muted hover:text-foreground rounded-button"
          >
            Đóng
          </Button>
        </div>

      </div>
    </div>
  );
};

export default VietQRPaymentModal;
