import { useState, useEffect } from "react";
import { couponApi, CouponDto } from "@entities/coupon/api";
import {
  Card,
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Label
} from "@my-project/ui";
import { Ticket } from "lucide-react";

interface Props {
  promotionId: number;
}

export function CouponsManager({ promotionId }: Props) {
  const [items, setItems] = useState<CouponDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [generateCount, setGenerateCount] = useState<number | string>(10);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await couponApi.getCouponsByPromotion(promotionId, page, 10);
      setItems(res.items);
      setTotal(Math.ceil(res.total / 10));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [promotionId, page]);

  const handleGenerate = async () => {
    if (!generateCount || Number(generateCount) <= 0) return;
    setLoading(true);
    try {
      await couponApi.generateCoupons(promotionId, Number(generateCount));
      setOpened(false);
      setPage(1);
      fetchCoupons();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Danh sách Voucher sinh tự động</h3>
          <p className="text-sm text-muted-foreground">Dùng cho tính năng "Kho Voucher" để cấp từng mã cho người dùng sưu tầm</p>
        </div>
        <Button onClick={() => setOpened(true)} className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
          <Ticket size={16} />
          Sinh mã hàng loạt
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Mã Voucher</th>
              <th className="px-4 py-3 font-medium">Người sở hữu</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Ngày dùng</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.couponId} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                <td className="px-4 py-3">{c.couponId}</td>
                <td className="px-4 py-3 font-semibold">{c.code}</td>
                <td className="px-4 py-3">
                  {c.ownerId || <span className="text-muted-foreground text-sm">Chưa ai sưu tầm</span>}
                </td>
                <td className="px-4 py-3">
                  {c.isRedeemed ? (
                    <Badge variant="error">Đã dùng</Badge>
                  ) : (
                    <Badge variant="success">Chưa dùng</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.redeemedAt ? new Date(c.redeemedAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Chưa có mã voucher nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {total > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Trước
          </Button>
          <span className="text-sm font-medium">Trang {page} / {total}</span>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === total}
            onClick={() => setPage(p => p + 1)}
          >
            Sau
          </Button>
        </div>
      )}

      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sinh mã hàng loạt</DialogTitle>
            <DialogDescription>
              Hệ thống sẽ tạo ra số lượng mã ngẫu nhiên để người dùng sưu tầm.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label>Số lượng mã cần sinh</Label>
            <Input
              type="number"
              min={1}
              max={1000}
              value={generateCount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGenerateCount(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpened(false)}>Hủy</Button>
            <Button onClick={handleGenerate} disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
              {loading ? "Đang xử lý..." : "Xác nhận sinh mã"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

