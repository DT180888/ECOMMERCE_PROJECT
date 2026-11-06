import { useState, useEffect, useMemo } from "react";
import { couponApi, CouponDto } from "@my-project/api";
import {
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
import { AdminTable, type AdminTableColumn } from "@shared/ui";
import { TicketIcon } from "@heroicons/react/24/outline";

interface Props {
  promotionId: number;
}

export function CouponsManager({ promotionId }: Props) {
  const [items, setItems] = useState<CouponDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [generateCount, setGenerateCount] = useState<number | string>(10);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await couponApi.getCouponsByPromotion(promotionId, page, 10);
      setItems(res.items);
      setTotalCount(res.total);
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

  const columns: AdminTableColumn<CouponDto>[] = useMemo(
    () => [
      {
        key: "couponId",
        label: "ID",
        width: "70px",
        render: (c) => <span className="font-mono text-xs">{c.couponId}</span>,
      },
      {
        key: "code",
        label: "Mã Voucher",
        isMain: true,
        render: (c) => <span className="font-mono font-semibold text-foreground">{c.code}</span>,
      },
      {
        key: "ownerId",
        label: "Người sở hữu",
        render: (c) => (
          <span>{c.ownerId || <span className="text-muted-foreground italic">Chưa ai sưu tầm</span>}</span>
        ),
      },
      {
        key: "status",
        label: "Trạng thái",
        align: "center",
        render: (c) =>
          c.isRedeemed ? (
            <Badge variant="error" className="text-[10px]">Đã dùng</Badge>
          ) : (
            <Badge variant="success" className="text-[10px]">Chưa dùng</Badge>
          ),
      },
      {
        key: "redeemedAt",
        label: "Ngày dùng",
        align: "right",
        render: (c) => (
          <span className="font-mono text-xs text-muted-foreground">
            {c.redeemedAt ? new Date(c.redeemedAt).toLocaleString("vi-VN") : "—"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4 select-none">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-foreground">
            Danh sách Voucher sinh tự động
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dùng cho tính năng "Kho Voucher" để cấp từng mã cho người dùng sưu tầm
          </p>
        </div>
        <Button onClick={() => setOpened(true)} size="default" className="gap-2 h-8 text-xs font-medium shadow-none">
          <TicketIcon className="w-3.5 h-3.5" />
          Sinh mã hàng loạt
        </Button>
      </div>

      <div className="border border-border/60 rounded-[2px] overflow-hidden bg-card">
        <AdminTable
          columns={columns}
          data={items}
          isLoading={loading}
          rowKey="couponId"
          emptyText="Chưa có mã voucher nào."
          pagination={
            totalCount > 10
              ? {
                  page,
                  total: totalCount,
                  pageSize: 10,
                  onPageChange: setPage,
                }
              : undefined
          }
        />
      </div>

      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sinh mã hàng loạt</DialogTitle>
            <DialogDescription>
              Hệ thống sẽ tạo ra số lượng mã ngẫu nhiên để người dùng sưu tầm.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label className="text-xs">Số lượng mã cần sinh</Label>
            <Input
              type="number"
              min={1}
              max={1000}
              value={generateCount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGenerateCount(e.target.value)}
              className="h-8 text-xs font-mono"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="default" onClick={() => setOpened(false)} className="h-8 text-xs">
              Hủy
            </Button>
            <Button onClick={handleGenerate} disabled={loading} size="default" className="h-8 text-xs">
              {loading ? "Đang xử lý..." : "Xác nhận sinh mã"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
