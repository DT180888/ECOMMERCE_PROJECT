import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@my-project/ui";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  
  const status = searchParams.get("status"); // 'success' | 'fail'
  const orderId = searchParams.get("orderId");
  // const transId = searchParams.get("transId"); // Nếu cần hiển thị mã giao dịch

  const [displayState, setDisplayState] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    if (!status) {
        // Nếu không có status, có thể user vào nhầm link -> về home
        nav("/"); 
        return;
    }

    if (status === "success") {
      setDisplayState("success");
      // Có thể gọi thêm API clear cart tại đây nếu cần thiết (hoặc BE đã tự xử lý)
    } else {
      setDisplayState("failed");
    }
  }, [status, nav]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-6">
      
      {/* TRẠNG THÁI LOADING */}
      {displayState === "loading" && (
        <div className="text-muted font-bold uppercase tracking-wider animate-pulse">Đang xác nhận kết quả giao dịch...</div>
      )}

      {/* TRẠNG THÁI THÀNH CÔNG */}
      {displayState === "success" && (
        <div className="bg-background p-8 rounded-card shadow-neo max-w-md w-full animate-in zoom-in-95 duration-300">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-neo-inset mb-6 text-success">
            <CheckCircleIcon className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground mb-2">Thanh toán thành công!</h1>
          <p className="text-muted text-sm mb-6">
            Đơn hàng <span className="font-bold text-foreground">#{orderId}</span> của bạn đã được thanh toán. Chúng tôi sẽ sớm giao hàng.
          </p>
          <div className="flex flex-col gap-4">
             <Link to={`/account/orders/${orderId}`}>
                <Button className="w-full">Xem chi tiết đơn hàng</Button>
             </Link>
             <Link to="/">
                <Button variant="outline" className="w-full">
                    Về trang chủ
                </Button>
             </Link>
          </div>
        </div>
      )}

      {/* TRẠNG THÁI THẤT BẠI */}
      {displayState === "failed" && (
        <div className="bg-background p-8 rounded-card shadow-neo max-w-md w-full animate-in zoom-in-95 duration-300">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-neo-inset mb-6 text-error">
            <XCircleIcon className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground mb-2">Thanh toán thất bại</h1>
          <p className="text-muted text-sm mb-6">
            Giao dịch cho đơn hàng <span className="font-bold text-foreground">#{orderId}</span> bị hủy hoặc gặp lỗi.
          </p>
          <div className="flex flex-col gap-4">
             {/* Nút quay lại trang thanh toán để thử lại */}
             <Button 
                onClick={() => nav("/checkout")} 
                className="w-full"
             >
                Thử thanh toán lại
             </Button>
             <Link to="/">
                <Button variant="outline" className="w-full">
                    Về trang chủ
                </Button>
             </Link>
          </div>
        </div>
      )}
    </div>
  );
}